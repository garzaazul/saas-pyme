"use server";

import { createClient } from "@/utils/supabase/server";
import { getOrgId } from "@/lib/auth/org";
import { revalidatePath } from "next/cache";
import {
    Quote,
    CreateQuoteInput,
    UpdateQuoteInput,
    QuoteStatus
} from "@/types/quotes";

// ---------------------------------------------------------------------------
// Lectura
// ---------------------------------------------------------------------------

/**
 * Retorna todas las cotizaciones de la organización del usuario autenticado.
 * Sin cambios de seguridad: ya filtraba por organization_id correctamente.
 */
export async function getQuotes() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) throw new Error("Perfil no encontrado");

    const { data, error } = await supabase
        .from("quotes")
        .select(`
            *,
            clients (business_name, phone)
        `)
        .eq("organization_id", profile.organization_id)
        .order("folio", { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Retorna una cotización completa con items, cliente y organización.
 * Anteriormente cualquier usuario autenticado podía leer cualquier cotización
 * con un ID válido — corregido filtrando por organization_id.
 */
export async function getQuote(id: string) {
    const supabase = await createClient();

    // Obtener orgId para filtrar solo cotizaciones propias
    const orgId = await getOrgId(supabase); // lanza si no autenticado

    const { data, error } = await supabase
        .from("quotes")
        .select(`
            *,
            items:quote_items (*),
            client:clients (*),
            organization:organizations (*)
        `)
        .eq("id", id)
        .eq("organization_id", orgId) // ← FILTRO MULTI-TENANT
        .single();

    if (error) throw error;
    return data as any; // Tipado completo pendiente — Fase 4 del plan de acción
}

// ---------------------------------------------------------------------------
// Creación
// ---------------------------------------------------------------------------

/**
 * Crea una nueva cotización con sus items.
 * Sin cambios de seguridad: ya asignaba organization_id desde el perfil.
 */
export async function createQuote(input: CreateQuoteInput) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return { error: "Perfil no encontrado" };

    // 1. Obtener siguiente folio (atómico y concurrente vía RPC)
    const { data: folio, error: folioError } = await supabase.rpc("get_next_correlative", {
        p_org_id: profile.organization_id,
    });

    if (folioError) {
        console.error("RPC Error (get_next_correlative):", folioError);
        return { error: "Error generando folio" };
    }

    // 2. Calcular total (Neto × 1.19 para Total Bruto)
    const net_amount = input.items.reduce(
        (acc, item) => acc + item.quantity * item.unit_price,
        0
    );
    const total_amount = Math.round(net_amount * 1.19);

    // 3. Insertar cabecera
    const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
            organization_id: profile.organization_id,
            client_id: input.client_id,
            folio,
            status: input.status || "pendiente",
            is_active: true,
            total_amount,
            valid_until: input.valid_until,
            observations: input.observations,
            payment_condition: input.payment_condition,
            version: 1,
        })
        .select()
        .single();

    if (quoteError) return { error: quoteError.message };

    // 4. Insertar items
    const itemsToInsert = input.items.map((item) => ({
        quote_id: quote.id,
        product_id: item.product_id || null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_line: item.quantity * item.unit_price,
    }));

    const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsToInsert);

    if (itemsError) {
        // Rollback manual de cabecera (operación no atómica — pendiente migrar a RPC en Fase 1.3)
        await supabase.from("quotes").delete().eq("id", quote.id);
        return { error: itemsError.message };
    }

    revalidatePath("/dashboard/quotes");
    return { data: quote };
}

// ---------------------------------------------------------------------------
// Actualización
// ---------------------------------------------------------------------------

/**
 * Actualiza una cotización existente con nuevos items.
 *
 * Seguridad corregida:
 * - El UPDATE de cabecera ahora incluye .eq("organization_id", orgId).
 * - Si la cotización no pertenece a esta org, el UPDATE no afecta filas y
 *   Supabase retorna PGRST116 — se detiene ANTES de borrar los items,
 *   evitando corrupción de datos ajenos.
 */
export async function updateQuote(input: UpdateQuoteInput) {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch (e: any) {
        return { error: e.message || "No autenticado" };
    }

    // 1. Actualizar cabecera — la guardia de organización va aquí
    //    Si el id no pertenece a esta org, .single() lanza PGRST116 y
    //    se retorna error ANTES de llegar al DELETE de items.
    const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .update({
            client_id: input.client_id,
            status: input.status,
            valid_until: input.valid_until,
            observations: input.observations,
            payment_condition: input.payment_condition,
            updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .eq("organization_id", orgId) // ← GUARDIA MULTI-TENANT
        .select()
        .single();

    if (quoteError) {
        // PGRST116: id no existe o no pertenece a esta organización
        if (quoteError.code === "PGRST116") {
            return { error: "Cotización no encontrada" };
        }
        console.error("Error updating quote header:", quoteError);
        return { error: quoteError.message };
    }

    // 2. Refrescar items — solo se ejecuta si el paso 1 fue exitoso (cotización propia)
    const { error: deleteError } = await supabase
        .from("quote_items")
        .delete()
        .eq("quote_id", input.id);

    if (deleteError) {
        return { error: deleteError.message };
    }

    if (input.items && input.items.length > 0) {
        const itemsToInsert = input.items.map((item) => ({
            quote_id: input.id,
            product_id: item.product_id || null,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_line: item.quantity * item.unit_price,
        }));

        const { error: itemsError } = await supabase
            .from("quote_items")
            .insert(itemsToInsert);

        if (itemsError) {
            return { error: itemsError.message };
        }
    }

    // 3. Actualizar total en cabecera (Neto × 1.19)
    const net_amount = (input.items || []).reduce(
        (acc, item) => acc + item.quantity * item.unit_price,
        0
    );
    const total_amount = Math.round(net_amount * 1.19);

    await supabase
        .from("quotes")
        .update({ total_amount })
        .eq("id", input.id)
        .eq("organization_id", orgId); // ← consistencia en el UPDATE final

    revalidatePath("/dashboard/quotes");
    return { data: { ...quote, total_amount } };
}

// ---------------------------------------------------------------------------
// Cambios de estado
// ---------------------------------------------------------------------------

/**
 * Aprueba una cotización.
 * Anteriormente cualquier usuario podía aprobar cualquier cotización — corregido.
 */
export async function approveQuote(id: string) {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch (e: any) {
        return { error: e.message || "No autenticado" };
    }

    const { error } = await supabase
        .from("quotes")
        .update({
            status: "aprobada" as QuoteStatus,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("organization_id", orgId); // ← GUARDIA MULTI-TENANT

    if (error) return { error: error.message };

    revalidatePath("/dashboard/quotes");
    return { success: true };
}

/**
 * Actualiza el estado de una cotización.
 * Anteriormente cualquier usuario podía cambiar el estado de cualquier cotización — corregido.
 */
export async function updateQuoteStatus(id: string, status: QuoteStatus) {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch (e: any) {
        return { error: e.message || "No autenticado" };
    }

    const { error } = await supabase
        .from("quotes")
        .update({ status })
        .eq("id", id)
        .eq("organization_id", orgId); // ← GUARDIA MULTI-TENANT

    if (error) return { error: error.message };

    revalidatePath("/dashboard/quotes");
    return { success: true };
}

// ---------------------------------------------------------------------------
// Soft-delete / Reactivación
// ---------------------------------------------------------------------------

/**
 * Desactiva una cotización (soft-delete).
 * Anteriormente cualquier usuario podía desactivar cualquier cotización — corregido.
 */
export async function softDeleteQuote(id: string) {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch (e: any) {
        return { error: e.message || "No autenticado" };
    }

    const { error } = await supabase
        .from("quotes")
        .update({ is_active: false })
        .eq("id", id)
        .eq("organization_id", orgId); // ← GUARDIA MULTI-TENANT

    if (error) return { error: error.message };

    revalidatePath("/dashboard/quotes");
    return { success: true };
}

/**
 * Reactiva una cotización.
 * Anteriormente cualquier usuario podía reactivar cualquier cotización — corregido.
 */
export async function reactivateQuote(id: string) {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch (e: any) {
        return { error: e.message || "No autenticado" };
    }

    const { error } = await supabase
        .from("quotes")
        .update({ is_active: true })
        .eq("id", id)
        .eq("organization_id", orgId); // ← GUARDIA MULTI-TENANT

    if (error) return { error: error.message };

    revalidatePath("/dashboard/quotes");
    return { success: true };
}

// ---------------------------------------------------------------------------
// Duplicado
// ---------------------------------------------------------------------------

/**
 * Duplica una cotización creando una nueva versión.
 * La guardia de organización queda cubierta por getQuote(), que ahora filtra
 * por organization_id. Si la cotización no pertenece a esta org, getQuote()
 * lanzará un error y duplicateQuote no continuará.
 */
export async function duplicateQuote(id: string) {
    const supabase = await createClient();

    // getQuote ya tiene la guardia de organización — si falla, propagamos el error
    let original: any;
    try {
        original = await getQuote(id);
    } catch {
        return { error: "Cotización no encontrada" };
    }

    if (!original) return { error: "Cotización no encontrada" };

    const input: CreateQuoteInput = {
        client_id: original.client_id,
        status: "pendiente",
        valid_until: original.valid_until,
        observations: original.observations,
        is_active: true,
        items: original.items?.map((item: any) => ({
            product_id: item.product_id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
        })) || [],
    };

    const result = await createQuote(input);

    if (result.data) {
        await supabase
            .from("quotes")
            .update({ version: original.version + 1 })
            .eq("id", result.data.id);
    }

    return result;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/**
 * Obtiene el folio que correspondería a la siguiente cotización sin incrementarlo.
 * Sin cambios de seguridad: ya filtraba por organization_id correctamente.
 */
export async function getFolioPreview() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", user.id)
            .single();

        if (!profile) return null;

        const { data: folio, error } = await supabase.rpc("get_next_folio_preview", {
            p_org_id: profile.organization_id,
        });

        if (error) {
            console.error("RPC Error (get_next_folio_preview):", error);
            return null;
        }

        return folio as number;
    } catch (error) {
        console.error("Error in getFolioPreview action:", error);
        return null;
    }
}

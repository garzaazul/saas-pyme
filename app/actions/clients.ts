"use server";

import { createClient } from "@/utils/supabase/server";
import { getOrgId } from "@/lib/auth/org";

export interface Client {
    id: string;
    razon_social: string;
    rut: string;
    email: string;
    telefono: string;
    direccion: string;
    created_at: string;
    organization_id: string;
    is_active: boolean;
}

// ---------------------------------------------------------------------------
// Mapeo DB ↔ dominio
// ---------------------------------------------------------------------------

const mapFromDb = (dbClient: any): Client => ({
    id: dbClient.id,
    razon_social: dbClient.business_name,
    rut: dbClient.rut,
    email: dbClient.email,
    telefono: dbClient.phone,
    direccion: dbClient.address,
    created_at: dbClient.created_at,
    organization_id: dbClient.organization_id,
    is_active: dbClient.is_active ?? true,
});

const mapToDb = (client: Partial<Client>) => {
    const dbObj: any = {};
    if (client.razon_social !== undefined) dbObj.business_name = client.razon_social;
    if (client.rut !== undefined) dbObj.rut = client.rut;
    if (client.email !== undefined) dbObj.email = client.email;
    if (client.telefono !== undefined) dbObj.phone = client.telefono;
    if (client.direccion !== undefined) dbObj.address = client.direccion;
    if (client.organization_id !== undefined) dbObj.organization_id = client.organization_id;
    if (client.is_active !== undefined) dbObj.is_active = client.is_active;
    return dbObj;
};

// ---------------------------------------------------------------------------
// Queries de lectura
// ---------------------------------------------------------------------------

/**
 * Retorna todos los clientes de la organización del usuario autenticado.
 * Anteriormente retornaba clientes de TODAS las organizaciones — corregido.
 */
export async function getClients() {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch {
        // Sin sesión activa: retornar vacío igual que en el resto de funciones de lectura
        return [];
    }

    const { data: clients, error } = await supabase
        .from("clients")
        .select("*")
        .eq("organization_id", orgId) // ← FILTRO MULTI-TENANT
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching clients:", error);
        return [];
    }

    return (clients || []).map(mapFromDb);
}

/**
 * Cuenta los clientes activos de la organización del usuario autenticado.
 * Anteriormente contaba clientes de TODAS las organizaciones — corregido.
 */
export async function getClientsCount() {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch {
        return 0;
    }

    const { count, error } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId) // ← FILTRO MULTI-TENANT
        .eq("is_active", true);

    if (error) {
        console.error("Error fetching clients count:", error);
        return 0;
    }

    return count || 0;
}

/**
 * Cuenta los clientes activos creados en el mes actual para la organización.
 * Anteriormente contaba de TODAS las organizaciones — corregido.
 */
export async function getNewClientsThisMonth() {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch {
        return 0;
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count, error } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId) // ← FILTRO MULTI-TENANT
        .eq("is_active", true)
        .gte("created_at", firstDayOfMonth);

    if (error) {
        console.error("Error fetching new clients count:", error);
        return 0;
    }

    return count || 0;
}

// ---------------------------------------------------------------------------
// Mutaciones
// ---------------------------------------------------------------------------

/**
 * Crea un nuevo cliente en la organización del usuario autenticado.
 */
export async function createClientAction(
    data: Omit<Client, "id" | "created_at" | "organization_id" | "is_active">
) {
    const supabase = await createClient();

    // Refactorizado para usar getOrgId; comportamiento idéntico al original
    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch (e: any) {
        throw new Error(e.message || "No autenticado");
    }

    const dbData = mapToDb({
        ...data,
        organization_id: orgId,
        is_active: true,
    });

    const { data: client, error } = await supabase
        .from("clients")
        .insert([dbData])
        .select()
        .single();

    if (error) {
        console.error("Error creating client:", error);
        if (error.code === "23505") {
            return { error: "Un cliente con este RUT ya existe." };
        }
        return { error: error.message };
    }

    return { data: mapFromDb(client) };
}

/**
 * Actualiza un cliente verificando que pertenece a la organización del usuario.
 * Anteriormente permitía editar clientes de cualquier organización — corregido.
 */
export async function updateClientAction(
    id: string,
    data: Partial<Omit<Client, "id" | "created_at" | "organization_id" | "is_active">>
) {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch (e: any) {
        return { error: e.message || "No autenticado" };
    }

    const dbData = mapToDb(data);

    const { data: client, error } = await supabase
        .from("clients")
        .update(dbData)
        .eq("id", id)
        .eq("organization_id", orgId) // ← GUARDIA MULTI-TENANT: solo afecta filas propias
        .select()
        .single();

    if (error) {
        console.error("Error updating client:", error);
        if (error.code === "23505") {
            return { error: "Un cliente con este RUT ya existe." };
        }
        // PGRST116 = no rows: el id no existe O no pertenece a esta organización
        if (error.code === "PGRST116") {
            return { error: "Cliente no encontrado" };
        }
        return { error: error.message };
    }

    return { data: mapFromDb(client) };
}

/**
 * Desactiva un cliente (soft-delete) verificando que pertenece a la organización.
 * Anteriormente permitía desactivar clientes de cualquier organización — corregido.
 */
export async function softDeleteClient(id: string) {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch (e: any) {
        return { error: e.message || "No autenticado" };
    }

    const { error } = await supabase
        .from("clients")
        .update({ is_active: false })
        .eq("id", id)
        .eq("organization_id", orgId); // ← GUARDIA MULTI-TENANT

    if (error) {
        console.error("Error deactivating client:", error);
        return { error: error.message };
    }

    return { success: true };
}

/**
 * Reactiva un cliente verificando que pertenece a la organización.
 * Anteriormente permitía reactivar clientes de cualquier organización — corregido.
 */
export async function reactivateClient(id: string) {
    const supabase = await createClient();

    let orgId: string;
    try {
        orgId = await getOrgId(supabase);
    } catch (e: any) {
        return { error: e.message || "No autenticado" };
    }

    const { error } = await supabase
        .from("clients")
        .update({ is_active: true })
        .eq("id", id)
        .eq("organization_id", orgId); // ← GUARDIA MULTI-TENANT

    if (error) {
        console.error("Error reactivating client:", error);
        return { error: error.message };
    }

    return { success: true };
}

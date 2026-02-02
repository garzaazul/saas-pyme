"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
    Quote,
    CreateQuoteInput,
    UpdateQuoteInput,
    QuoteStatus
} from "@/types/quotes";

/**
 * Fetch all quotes for the authenticated user's organization
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
            clients (business_name)
        `)
        .eq("organization_id", profile.organization_id)
        .order("folio", { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Get a single quote with items
 */
export async function getQuote(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("quotes")
        .select(`
            *,
            items:quote_items (*),
            client:clients (*),
            organization:organizations (*)
        `)
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as any; // Using any to include organization field easily
}

/**
 * Create a new quote with items
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

    // 1. Get next folio
    const { data: folio, error: folioError } = await supabase.rpc('get_next_quote_folio', {
        org_id: profile.organization_id
    });

    if (folioError) return { error: "Error generando folio" };

    // 2. Calculate total amount
    const total_amount = input.items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);

    // 3. Insert header
    const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
            organization_id: profile.organization_id,
            client_id: input.client_id,
            folio,
            status: input.status || 'borrador',
            total_amount,
            valid_until: input.valid_until,
            observations: input.observations,
            payment_condition: input.payment_condition,
            version: 1
        })
        .select()
        .single();

    if (quoteError) return { error: quoteError.message };

    // 4. Insert items
    const itemsToInsert = input.items.map(item => ({
        quote_id: quote.id,
        product_id: item.product_id || null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_line: item.quantity * item.unit_price
    }));

    const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsToInsert);

    if (itemsError) {
        // Rollback header (basic approach)
        await supabase.from("quotes").delete().eq("id", quote.id);
        return { error: itemsError.message };
    }

    revalidatePath("/dashboard/quotes");
    return { data: quote };
}

/**
 * Update an existing quote with items
 */
export async function updateQuote(input: UpdateQuoteInput) {
    const supabase = await createClient();

    // 1. Update header
    const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .update({
            client_id: input.client_id,
            status: input.status,
            valid_until: input.valid_until,
            observations: input.observations,
            payment_condition: input.payment_condition,
            updated_at: new Date().toISOString()
        })
        .eq("id", input.id)
        .select()
        .single();

    if (quoteError) {
        console.error("Error updating quote header:", quoteError);
        return { error: quoteError.message };
    }

    // 2. Refresh items (Delete then Insert)
    const { error: deleteError } = await supabase
        .from("quote_items")
        .delete()
        .eq("quote_id", input.id);

    if (deleteError) {
        return { error: deleteError.message };
    }

    if (input.items && input.items.length > 0) {
        const itemsToInsert = input.items.map(item => ({
            quote_id: input.id,
            product_id: item.product_id || null,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_line: item.quantity * item.unit_price
        }));

        const { error: itemsError } = await supabase
            .from("quote_items")
            .insert(itemsToInsert);

        if (itemsError) {
            return { error: itemsError.message };
        }
    }

    // 3. Update total amount in header
    const total_amount = (input.items || []).reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    await supabase
        .from("quotes")
        .update({ total_amount })
        .eq("id", input.id);

    revalidatePath("/dashboard/quotes");
    return { data: { ...quote, total_amount } };
}

/**
 * Duplicate a quote (Versioning logic)
 */
export async function duplicateQuote(id: string) {
    const supabase = await createClient();
    const original = await getQuote(id);
    if (!original) return { error: "Cotización no encontrada" };

    // Create a new input based on original data
    const input: CreateQuoteInput = {
        client_id: original.client_id,
        status: 'borrador', // New copy starts as draft
        valid_until: original.valid_until,
        observations: original.observations,
        items: original.items?.map((item: any) => ({
            product_id: item.product_id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price
        })) || []
    };

    // Create the quote (createQuote already handles folio and organization)
    const result = await createQuote(input);

    if (result.data) {
        // Update version of the new quote
        await supabase
            .from("quotes")
            .update({ version: original.version + 1 })
            .eq("id", result.data.id);
    }

    return result;
}

/**
 * Update quote status
 */
export async function updateQuoteStatus(id: string, status: QuoteStatus) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("quotes")
        .update({ status })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/quotes");
    return { success: true };
}

/**
 * Desactiva una cotización (soft-delete).
 */
export async function softDeleteQuote(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("quotes")
        .update({ is_active: false })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/quotes");
    return { success: true };
}

/**
 * Reactiva una cotización.
 */
export async function reactivateQuote(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("quotes")
        .update({ is_active: true })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/quotes");
    return { success: true };
}

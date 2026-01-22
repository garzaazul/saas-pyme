"use server";

import { createClient } from "@/utils/supabase/server";

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

// Internal mapping helper
const mapFromDb = (dbClient: any): Client => ({
    id: dbClient.id,
    razon_social: dbClient.business_name,
    rut: dbClient.rut,
    email: dbClient.email,
    telefono: dbClient.phone,
    direccion: dbClient.address,
    created_at: dbClient.created_at,
    organization_id: dbClient.organization_id,
    is_active: dbClient.is_active ?? true
});

const mapToDb = (client: Partial<Client>) => {
    const dbObj: any = {};
    if (client.razon_social) dbObj.business_name = client.razon_social;
    if (client.rut) dbObj.rut = client.rut;
    if (client.email) dbObj.email = client.email;
    if (client.telefono) dbObj.phone = client.telefono;
    if (client.direccion) dbObj.address = client.direccion;
    if (client.organization_id) dbObj.organization_id = client.organization_id;
    if (client.is_active !== undefined) dbObj.is_active = client.is_active;
    return dbObj;
};

export async function getClients() {
    const supabase = await createClient();

    const { data: clients, error } = await supabase
        .from("clients")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching clients:", error);
        return [];
    }

    return (clients || []).map(mapFromDb);
}

export async function getClientsCount() {
    const supabase = await createClient();

    const { count, error } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

    if (error) {
        console.error("Error fetching clients count:", error);
        return 0;
    }

    return count || 0;
}

export async function getNewClientsThisMonth() {
    const supabase = await createClient();

    // Get first day of current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count, error } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)
        .gte("created_at", firstDayOfMonth);

    if (error) {
        console.error("Error fetching new clients count:", error);
        return 0;
    }

    return count || 0;
}

export async function createClientAction(data: Omit<Client, "id" | "created_at" | "organization_id" | "is_active">) {
    const supabase = await createClient();

    // Get current session to get organization_id (assuming organization_id is linked to the user's profile)
    // For now, we'll try to insert and let the DB default or handle organization_id if it's set up in RLS
    // If we need a specific organization_id, we would fetch it first.

    // Check if the user is authenticated and get their profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    const dbData = mapToDb({
        ...data,
        organization_id: profile?.organization_id,
        is_active: true
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

export async function updateClientAction(id: string, data: Partial<Omit<Client, "id" | "created_at" | "organization_id" | "is_active">>) {
    const supabase = await createClient();

    const dbData = mapToDb(data);

    const { data: client, error } = await supabase
        .from("clients")
        .update(dbData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating client:", error);
        if (error.code === "23505") {
            return { error: "Un cliente con este RUT ya existe." };
        }
        return { error: error.message };
    }

    return { data: mapFromDb(client) };
}

export async function softDeleteClient(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("clients")
        .update({ is_active: false })
        .eq("id", id);

    if (error) {
        console.error("Error deactivating client:", error);
        return { error: error.message };
    }

    return { success: true };
}

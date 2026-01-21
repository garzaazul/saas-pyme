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
}

export async function getClients() {
    const supabase = await createClient();

    const { data: clients, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching clients:", error);
        return [];
    }

    return clients as Client[];
}

export async function getClientsCount() {
    const supabase = await createClient();

    const { count, error } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

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
        .gte("created_at", firstDayOfMonth);

    if (error) {
        console.error("Error fetching new clients count:", error);
        return 0;
    }

    return count || 0;
}

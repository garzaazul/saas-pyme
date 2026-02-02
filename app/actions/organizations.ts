"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Organization, UpdateOrganizationInput } from "@/types/organizations";

/**
 * Obtiene la información de la organización del usuario autenticado.
 */
export async function getMyOrganization() {
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
        .from("organizations")
        .select("*")
        .eq("id", profile.organization_id)
        .single();

    if (error) {
        console.error("Error fetching organization:", error);
        throw new Error(error.message);
    }

    return data as Organization;
}

/**
 * Actualiza la información de la organización.
 * Valida que el usuario pertenezca a la organización que intenta editar.
 */
export async function updateMyOrganization(input: UpdateOrganizationInput) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return { error: "Perfil no encontrado" };

    // El ID de la organización siempre viene del perfil del usuario por seguridad
    const { data, error } = await supabase
        .from("organizations")
        .update({
            ...input,
            // No permitimos actualizar el ID ni el created_at
        })
        .eq("id", profile.organization_id)
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            return { error: "Ya existe una empresa con este web slug." };
        }
        if (error.code === 'PGRST116') {
            return { error: "Error de permisos o registro no encontrado. Asegúrate de tener permisos para editar esta empresa." };
        }
        return { error: error.message };
    }

    revalidatePath("/dashboard/mi-empresa");
    return { success: true, data: data as Organization };
}

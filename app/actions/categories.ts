"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/categories";

/**
 * Obtiene todas las categorías de la organización del usuario autenticado.
 */
export async function getCategories() {
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
        .from("categories")
        .select("*")
        .eq("organization_id", profile.organization_id)
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data as Category[];
}

/**
 * Crea una nueva categoría.
 */
export async function createCategory(input: CreateCategoryInput) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return { error: "Perfil no encontrado" };

    const { data, error } = await supabase
        .from("categories")
        .insert({
            name: input.name,
            description: input.description,
            target_type: input.target_type,
            is_active: input.is_active ?? true,
            organization_id: profile.organization_id, // Siempre desde el perfil
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            return { error: "Ya existe una categoría con este nombre para ese tipo." };
        }
        return { error: error.message };
    }

    revalidatePath("/dashboard/categories");
    return { success: true, data: data as Category };
}

/**
 * Actualiza una categoría existente.
 */
export async function updateCategory(input: UpdateCategoryInput) {
    const supabase = await createClient();

    const { id, ...updates } = input;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };

    const { data, error } = await supabase
        .from("categories")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            return { error: "Ya existe otra categoría con este nombre para ese tipo." };
        }
        return { error: error.message };
    }

    revalidatePath("/dashboard/categories");
    return { success: true, data: data as Category };
}

/**
 * Desactiva una categoría (soft-delete).
 */
export async function softDeleteCategory(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };

    const { error } = await supabase
        .from("categories")
        .update({ is_active: false })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/categories");
    return { success: true };
}

/**
 * Reactiva una categoría.
 */
export async function reactivateCategory(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };

    const { error } = await supabase
        .from("categories")
        .update({ is_active: true })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard/categories");
    return { success: true };
}

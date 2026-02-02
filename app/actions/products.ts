"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CreateProductInput, UpdateProductInput, Product } from "@/types/products";

export async function getProducts() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return [];

    const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("organization_id", profile.organization_id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    return data as (Product & { categories: { name: string } | null })[];
}

export async function createProduct(input: CreateProductInput) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return { error: "Perfil no encontrado" };

    // Server-side validation for image count (Senior Developer standard)
    if (input.image_urls.length > 3) {
        return { error: "Máximo 3 imágenes permitidas" };
    }

    const { data, error } = await supabase
        .from("products")
        .insert({
            organization_id: profile.organization_id,
            category_id: input.category_id,
            name: input.name,
            description: input.description,
            price: input.price,
            stock_quantity: input.stock_quantity ?? 0,
            type: input.type,
            image_urls: input.image_urls,
            is_active: input.is_active ?? true,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating product:", error);
        return { error: "Error al crear el producto" };
    }

    revalidatePath("/dashboard/products");
    return { data };
}

export async function updateProduct(input: UpdateProductInput) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return { error: "Perfil no encontrado" };

    // Validate image count
    if (input.image_urls && input.image_urls.length > 3) {
        return { error: "Máximo 3 imágenes permitidas" };
    }

    const { data, error } = await supabase
        .from("products")
        .update({
            category_id: input.category_id,
            name: input.name,
            description: input.description,
            price: input.price,
            stock_quantity: input.stock_quantity,
            type: input.type,
            image_urls: input.image_urls,
            is_active: input.is_active,
        })
        .eq("id", input.id)
        .eq("organization_id", profile.organization_id) // Security check
        .select()
        .single();

    if (error) {
        console.error("Error updating product:", error);
        return { error: "Error al actualizar el producto" };
    }

    revalidatePath("/dashboard/products");
    return { data };
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "No autenticado" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return { error: "Perfil no encontrado" };

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .eq("organization_id", profile.organization_id);

    if (error) {
        console.error("Error deleting product:", error);
        return { error: "Error al eliminar el producto" };
    }

    revalidatePath("/dashboard/products");
    return { success: true };
}

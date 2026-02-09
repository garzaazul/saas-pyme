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
        .select(`
            *,
            product_categories (
                category_id,
                categories (
                    name
                )
            )
        `)
        .eq("organization_id", profile.organization_id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    // Adaptar la estructura para que sea compatible con lo que espera el frontend
    return data.map(product => ({
        ...product,
        category_ids: product.product_categories?.map((pc: any) => pc.category_id) || [],
        categories: product.product_categories?.[0]?.categories || null // Mantener compatibilidad básica if needed
    })) as (Product & { categories: { name: string } | null })[];
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

    // 1. Insertar el producto
    const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
            organization_id: profile.organization_id,
            name: input.name,
            description: input.description,
            base_price: input.base_price,
            current_stock: input.current_stock ?? 0,
            min_stock_alert: input.min_stock_alert ?? 5,
            unit: input.unit ?? 'un',
            is_stock_product: input.is_stock_product ?? (input.type === 'product'),
            type: input.type,
            image_urls: input.image_urls,
            is_active: input.is_active ?? true,
        })
        .select()
        .single();

    if (productError) {
        console.error("Error creating product:", productError);
        return { error: "Error al crear el producto" };
    }

    // 2. Insertar relaciones de categorías si existen
    if (input.category_ids && input.category_ids.length > 0) {
        const productCategories = input.category_ids.map(categoryId => ({
            product_id: product.id,
            category_id: categoryId,
            organization_id: profile.organization_id
        }));

        const { error: relationError } = await supabase
            .from("product_categories")
            .insert(productCategories);

        if (relationError) {
            console.error("Error creating product-category relations:", relationError);
            // No fallamos el proceso completo, pero informamos (o podríamos hacer un rollback si fuera crítico)
        }
    }

    revalidatePath("/dashboard/products");
    return { data: product };
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

    // 1. Actualizar datos básicos del producto
    const { data: product, error: productError } = await supabase
        .from("products")
        .update({
            name: input.name,
            description: input.description,
            base_price: input.base_price,
            current_stock: input.current_stock,
            min_stock_alert: input.min_stock_alert,
            unit: input.unit,
            is_stock_product: input.is_stock_product,
            type: input.type,
            image_urls: input.image_urls,
            is_active: input.is_active,
        })
        .eq("id", input.id)
        .eq("organization_id", profile.organization_id) // Security check
        .select()
        .single();

    if (productError) {
        console.error("Error updating product:", productError);
        return { error: "Error al actualizar el producto" };
    }

    // 2. Actualizar relaciones de categorías si se proporcionan
    if (input.category_ids !== undefined) {
        // Eliminar relaciones actuales
        await supabase
            .from("product_categories")
            .delete()
            .eq("product_id", input.id);

        // Insertar nuevas relaciones si el array no está vacío
        if (input.category_ids.length > 0) {
            const productCategories = input.category_ids.map(categoryId => ({
                product_id: input.id,
                category_id: categoryId,
                organization_id: profile.organization_id
            }));

            const { error: relationError } = await supabase
                .from("product_categories")
                .insert(productCategories);

            if (relationError) {
                console.error("Error updating product-category relations:", relationError);
            }
        }
    }

    revalidatePath("/dashboard/products");
    return { data: product };
}

/**
 * Desactiva un producto (soft-delete).
 */
export async function softDeleteProduct(id: string) {
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
        .update({ is_active: false })
        .eq("id", id)
        .eq("organization_id", profile.organization_id);

    if (error) {
        console.error("Error deactivating product:", error);
        return { error: "Error al desactivar el producto" };
    }

    revalidatePath("/dashboard/products");
    return { success: true };
}

/**
 * Reactiva un producto.
 */
export async function reactivateProduct(id: string) {
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
        .update({ is_active: true })
        .eq("id", id)
        .eq("organization_id", profile.organization_id);

    if (error) {
        console.error("Error reactivating product:", error);
        return { error: "Error al reactivar el producto" };
    }

    revalidatePath("/dashboard/products");
    return { success: true };
}

"use server";

import { createClient } from "@/utils/supabase/server";
import { Organization } from "@/types/organizations";
import { Product } from "@/types/products";
import { Category } from "@/types/categories";

export async function getStoreData(slug: string) {
    const supabase = await createClient();

    // 1. Fetch Organization by slug
    const { data: organization, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("web_slug", slug)
        .single();

    if (orgError || !organization) {
        return { error: "Organization not found" };
    }

    // 2. Fetch Active Products for this Org with their Categories
    const { data: products, error: prodError } = await supabase
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
        .eq("organization_id", organization.id)
        .eq("is_active", true)
        .order("name", { ascending: true });

    if (prodError) {
        console.error("Error fetching store products:", prodError);
    }

    // Adaptar la estructura para el catálogo público
    const adaptedProducts = (products || []).map(p => ({
        ...p,
        category_ids: p.product_categories?.map((pc: any) => pc.category_id) || [],
    }));

    // 3. Fetch Active Categories for filter
    const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("organization_id", organization.id)
        .eq("is_active", true)
        .order("name", { ascending: true });

    return {
        organization: organization as Organization,
        products: adaptedProducts as (Product & { product_categories: any[] })[],
        categories: (categories || []) as Category[]
    };
}

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

    // 2. Fetch Active Products for this Org
    const { data: products, error: prodError } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("organization_id", organization.id)
        .eq("is_active", true)
        .order("name", { ascending: true });

    if (prodError) {
        console.error("Error fetching store products:", prodError);
    }

    // 3. Fetch Active Categories for filter
    const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("*")
        .eq("organization_id", organization.id)
        .eq("is_active", true)
        .order("name", { ascending: true });

    return {
        organization: organization as Organization,
        products: (products || []) as (Product & { categories: { name: string } | null })[],
        categories: (categories || []) as Category[]
    };
}

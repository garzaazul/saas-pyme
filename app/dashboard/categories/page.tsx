import { getCategories } from "@/app/actions/categories";
import { CategoriesClient } from "./categories-client";

/**
 * Server Component — obtiene datos antes de enviar el HTML al navegador.
 */
export default async function CategoriesPage() {
    const initialCategories = await getCategories();

    return (
        <CategoriesClient initialCategories={initialCategories} />
    );
}

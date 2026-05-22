import { getProducts } from "@/app/actions/products";
import { getMyOrganization } from "@/app/actions/organizations";
import { ProductsClient } from "./products-client";

/**
 * Server Component — obtiene datos antes de enviar el HTML al navegador.
 */
export default async function ProductsPage() {
    const [initialProducts, orgData] = await Promise.all([
        getProducts(),
        getMyOrganization(),
    ]);

    return (
        <ProductsClient
            initialProducts={initialProducts}
            initialOrgSlug={orgData?.web_slug ?? null}
        />
    );
}

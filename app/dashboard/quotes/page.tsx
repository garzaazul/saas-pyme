import { getQuotes, getFolioPreview } from "@/app/actions/quotes";
import { getMyOrganization } from "@/app/actions/organizations";
import { getClients } from "@/app/actions/clients";
import { getProducts } from "@/app/actions/products";
import { QuotesClient } from "./quotes-client";

/**
 * Server Component — obtiene todos los datos necesarios para la página
 * antes de enviar el HTML al navegador. El Client Component recibe los datos
 * como props iniciales y no necesita hacer fetch en el montaje.
 */
export default async function QuotesPage() {
    const [quotesData, orgData, clientsData, productsData, folioData] = await Promise.all([
        getQuotes(),
        getMyOrganization(),
        getClients(),
        getProducts(),
        getFolioPreview(),
    ]);

    return (
        <QuotesClient
            initialQuotes={quotesData ?? []}
            initialOrganization={orgData}
            initialClients={clientsData}
            initialProducts={productsData}
            initialNextFolio={folioData}
        />
    );
}

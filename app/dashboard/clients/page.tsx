import { getClients, getClientsCount, getNewClientsThisMonth } from "@/app/actions/clients";
import { ClientsClient } from "./clients-client";

/**
 * Server Component — obtiene datos antes de enviar el HTML al navegador.
 */
export default async function ClientsPage() {
    const [initialClients, initialTotal, initialNewThisMonth] = await Promise.all([
        getClients(),
        getClientsCount(),
        getNewClientsThisMonth(),
    ]);

    return (
        <ClientsClient
            initialClients={initialClients}
            initialTotal={initialTotal}
            initialNewThisMonth={initialNewThisMonth}
        />
    );
}

import { getQuoteDashboardKPIs } from "@/app/actions/dashboard";
import { getQuotes } from "@/app/actions/quotes";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
    // Carga paralela de datos — mismo patrón que la página de cotizaciones
    const [kpis, quotesRaw] = await Promise.all([
        getQuoteDashboardKPIs(),
        getQuotes(),
    ]);

    // Pasamos solo las últimas 5 al DashboardClient
    const recentQuotes = (quotesRaw ?? []).slice(0, 5);

    return <DashboardClient kpis={kpis} quotes={recentQuotes} />;
}

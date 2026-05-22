"use server";

import { createClient } from "@/utils/supabase/server";

export interface DashboardKPIs {
    totalIncome: number;
    totalExpenses: number;
    operatingResult: number;
    netMargin: number;
    documentedSalesPercent: number;
    totalClients: number;
    newClientsThisMonth: number;
}

export interface RecentMovement {
    id: string;
    entity: string;
    initials: string;
    date: string;
    type: "income" | "expense";
    amount: number;
    status: "billed" | "pending";
}

export interface QuoteAlert {
    count: number;
    totalValue: number;
}

/**
 * Obtiene los KPIs principales del dashboard para el mes actual
 */
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            totalIncome: 0,
            totalExpenses: 0,
            operatingResult: 0,
            netMargin: 0,
            documentedSalesPercent: 0,
            totalClients: 0,
            newClientsThisMonth: 0
        };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) {
        return {
            totalIncome: 0,
            totalExpenses: 0,
            operatingResult: 0,
            netMargin: 0,
            documentedSalesPercent: 0,
            totalClients: 0,
            newClientsThisMonth: 0
        };
    }

    const orgId = profile.organization_id;

    // Obtener primer día del mes actual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

    // 1. Total de ingresos (ventas del mes)
    const { data: salesData } = await supabase
        .from("sales")
        .select("total_amount, sale_type")
        .eq("organization_id", orgId)
        .gte("date", firstDayOfMonth)
        .lte("date", lastDayOfMonth);

    const totalIncome = salesData?.reduce((acc, sale) => acc + Number(sale.total_amount || 0), 0) || 0;

    // Calcular porcentaje de ventas documentadas (factura o boleta)
    const totalSales = salesData?.length || 0;
    const documentedSales = salesData?.filter(s => s.sale_type === 'factura' || s.sale_type === 'boleta').length || 0;
    const documentedSalesPercent = totalSales > 0 ? Math.round((documentedSales / totalSales) * 100) : 0;

    // 2. Total de gastos del mes
    const { data: expensesData } = await supabase
        .from("expenses")
        .select("amount")
        .eq("organization_id", orgId)
        .gte("date", firstDayOfMonth)
        .lte("date", lastDayOfMonth);

    const totalExpenses = expensesData?.reduce((acc, expense) => acc + Number(expense.amount || 0), 0) || 0;

    // 3. Resultado operacional
    const operatingResult = totalIncome - totalExpenses;

    // 4. Margen neto
    const netMargin = totalIncome > 0 ? Math.round((operatingResult / totalIncome) * 100) : 0;

    // 5. Total de clientes activos
    const { count: totalClients } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("is_active", true);

    // 6. Nuevos clientes este mes
    const { count: newClientsThisMonth } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("is_active", true)
        .gte("created_at", firstDayOfMonth);

    return {
        totalIncome,
        totalExpenses,
        operatingResult,
        netMargin,
        documentedSalesPercent,
        totalClients: totalClients || 0,
        newClientsThisMonth: newClientsThisMonth || 0
    };
}

/**
 * Obtiene los últimos movimientos (ventas + gastos) combinados y ordenados por fecha
 */
export async function getRecentMovements(limit: number = 5): Promise<RecentMovement[]> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return [];

    const orgId = profile.organization_id;

    // Obtener últimas ventas
    const { data: salesData } = await supabase
        .from("sales")
        .select(`
            id,
            date,
            total_amount,
            payment_status,
            sale_type,
            clients (business_name)
        `)
        .eq("organization_id", orgId)
        .order("date", { ascending: false })
        .limit(limit);

    // Obtener últimos gastos
    const { data: expensesData } = await supabase
        .from("expenses")
        .select("id, date, amount, supplier_name, category")
        .eq("organization_id", orgId)
        .order("date", { ascending: false })
        .limit(limit);

    // Combinar y ordenar
    const movements: RecentMovement[] = [];

    // Agregar ventas
    salesData?.forEach(sale => {
        const clientName = (sale.clients as any)?.business_name || "Cliente";
        movements.push({
            id: sale.id,
            entity: clientName,
            initials: clientName.substring(0, 2).toUpperCase(),
            date: formatDateShort(sale.date),
            type: "income",
            amount: Number(sale.total_amount || 0),
            status: sale.payment_status === "pagado" ? "billed" : "pending"
        });
    });

    // Agregar gastos
    expensesData?.forEach(expense => {
        const supplierName = expense.supplier_name || expense.category || "Gasto";
        movements.push({
            id: expense.id,
            entity: supplierName,
            initials: supplierName.substring(0, 2).toUpperCase(),
            date: formatDateShort(expense.date),
            type: "expense",
            amount: Number(expense.amount || 0),
            status: "billed" // Los gastos se asumen pagados
        });
    });

    // Ordenar por fecha descendente y limitar
    return movements
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
}

/**
 * Obtiene alertas de cotizaciones próximas a vencer
 */
export async function getQuoteAlerts(): Promise<QuoteAlert> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { count: 0, totalValue: 0 };

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return { count: 0, totalValue: 0 };

    const orgId = profile.organization_id;

    // Cotizaciones que vencen en los próximos 7 días
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const { data: expiringQuotes } = await supabase
        .from("quotes")
        .select("id, total_amount")
        .eq("organization_id", orgId)
        .eq("status", "pendiente")
        .eq("is_active", true)
        .gte("valid_until", today)
        .lte("valid_until", nextWeek);

    const count = expiringQuotes?.length || 0;
    const totalValue = expiringQuotes?.reduce((acc, q) => acc + Number(q.total_amount || 0), 0) || 0;

    return { count, totalValue };
}

// Helper para formatear fecha corta
function formatDateShort(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// =============================================================================
// Fase 2.1 — KPIs del plan de entrada (cotizaciones)
// Las funciones anteriores (getDashboardKPIs, getRecentMovements, getQuoteAlerts)
// quedan intactas para el plan superior de control financiero.
// =============================================================================

export interface QuoteDashboardKPIs {
    /** Cotizaciones pendientes activas */
    pipelineCount: number;
    /** Monto total del pipeline pendiente */
    pipelineAmount: number;
    /** Cotizaciones creadas en el mes actual */
    quotesThisMonth: number;
    /** Cotizaciones aprobadas en el mes actual */
    approvedThisMonth: number;
    /** Tasa de aceptación del mes (0-100) */
    acceptanceRate: number;
    /** Clientes activos de la organización */
    totalClients: number;
    /** Cotizaciones pendientes que vencen en los próximos 7 días */
    expiringCount: number;
    /** Monto total de las cotizaciones próximas a vencer */
    expiringAmount: number;
}

const EMPTY_QUOTE_KPIS: QuoteDashboardKPIs = {
    pipelineCount: 0,
    pipelineAmount: 0,
    quotesThisMonth: 0,
    approvedThisMonth: 0,
    acceptanceRate: 0,
    totalClients: 0,
    expiringCount: 0,
    expiringAmount: 0,
};

/**
 * KPIs orientados a cotizaciones para el plan de entrada.
 * Corre todas las queries en paralelo con Promise.all.
 */
export async function getQuoteDashboardKPIs(): Promise<QuoteDashboardKPIs> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return EMPTY_QUOTE_KPIS;

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile) return EMPTY_QUOTE_KPIS;

    const orgId = profile.organization_id;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
    const today = now.toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    const [
        pendingResult,
        monthResult,
        clientsResult,
        expiringResult,
    ] = await Promise.all([
        // a. Pipeline: cotizaciones pendientes activas
        supabase
            .from("quotes")
            .select("total_amount")
            .eq("organization_id", orgId)
            .eq("status", "pendiente")
            .eq("is_active", true),

        // b. Mes actual: todas las cotizaciones activas creadas este mes
        supabase
            .from("quotes")
            .select("status")
            .eq("organization_id", orgId)
            .eq("is_active", true)
            .gte("created_at", firstDayOfMonth),

        // c. Clientes activos de la organización
        supabase
            .from("clients")
            .select("*", { count: "exact", head: true })
            .eq("organization_id", orgId)
            .eq("is_active", true),

        // d. Cotizaciones por vencer en 7 días
        supabase
            .from("quotes")
            .select("total_amount")
            .eq("organization_id", orgId)
            .eq("status", "pendiente")
            .eq("is_active", true)
            .gte("valid_until", today)
            .lte("valid_until", nextWeek),
    ]);

    // Pipeline
    const pipelineCount = pendingResult.data?.length ?? 0;
    const pipelineAmount = pendingResult.data?.reduce(
        (acc, q) => acc + Number(q.total_amount ?? 0), 0
    ) ?? 0;

    // Conversión del mes
    const quotesThisMonth = monthResult.data?.length ?? 0;
    const approvedThisMonth =
        monthResult.data?.filter((q) => q.status === "aprobada").length ?? 0;
    const acceptanceRate =
        quotesThisMonth > 0
            ? Math.round((approvedThisMonth / quotesThisMonth) * 100)
            : 0;

    // Clientes
    const totalClients = clientsResult.count ?? 0;

    // Alertas de vencimiento
    const expiringCount = expiringResult.data?.length ?? 0;
    const expiringAmount = expiringResult.data?.reduce(
        (acc, q) => acc + Number(q.total_amount ?? 0), 0
    ) ?? 0;

    return {
        pipelineCount,
        pipelineAmount,
        quotesThisMonth,
        approvedThisMonth,
        acceptanceRate,
        totalClients,
        expiringCount,
        expiringAmount,
    };
}

"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { formatCLP } from "@/lib/currency";
import { QuoteDashboardKPIs, getQuoteDashboardKPIs } from "@/app/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    TrendingUp,
    Calendar,
    Plus,
    Clock,
    Users,
    Sparkles,
    FileText,
    CheckCircle2,
    ChevronDown,
    Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface QuoteRow {
    id: string;
    folio: number;
    total_amount: number;
    status: string;
    created_at: string;
    is_active: boolean;
    clients?: { business_name: string; phone: string } | null;
}

interface DashboardClientProps {
    kpis: QuoteDashboardKPIs;
    quotes: QuoteRow[];
}

interface MonthOption {
    year: number;
    month: number; // 0-indexed
    label: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_STYLES: Record<string, string> = {
    pendiente:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    aprobada:   "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
    rechazada:  "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
    facturada:  "bg-[#091226]/10 text-[#091226] dark:bg-white/10 dark:text-white/80",
};

const STATUS_LABEL: Record<string, string> = {
    pendiente: "Pendiente",
    aprobada:  "Aprobada",
    rechazada: "Rechazada",
    facturada: "Facturada",
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

/** Genera las últimas N meses como opciones de selector */
function buildMonthOptions(count = 12): MonthOption[] {
    const options: MonthOption[] = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        options.push({
            year: d.getFullYear(),
            month: d.getMonth(),
            label: d.toLocaleDateString("es-CL", { month: "long", year: "numeric" }),
        });
    }
    return options;
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export function DashboardClient({ kpis: initialKpis, quotes }: DashboardClientProps) {
    const monthOptions = buildMonthOptions(12);
    const [selected, setSelected] = useState<MonthOption>(monthOptions[0]);
    const [kpis, setKpis] = useState<QuoteDashboardKPIs>(initialKpis);
    const [isPending, startTransition] = useTransition();

    function handleMonthChange(option: MonthOption) {
        if (option.year === selected.year && option.month === selected.month) return;
        setSelected(option);
        startTransition(async () => {
            const fresh = await getQuoteDashboardKPIs(option.year, option.month);
            setKpis(fresh);
        });
    }

    return (
        <div className="space-y-10 pb-10">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Resumen Ejecutivo
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Bienvenido de vuelta. Aquí está el estado actual de tu negocio.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">

                    {/* ── Selector de mes ── */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="gap-2 bg-white dark:bg-slate-900 shadow-sm border-gray-200 dark:border-slate-800 capitalize min-w-[160px] justify-between"
                                disabled={isPending}
                            >
                                <div className="flex items-center gap-2">
                                    {isPending
                                        ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                        : <Calendar className="w-4 h-4 text-gray-400" />
                                    }
                                    <span className="font-semibold text-sm capitalize">
                                        {selected.label}
                                    </span>
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 max-h-72 overflow-y-auto">
                            {monthOptions.map((opt, i) => (
                                <DropdownMenuItem
                                    key={`${opt.year}-${opt.month}`}
                                    onClick={() => handleMonthChange(opt)}
                                    className={cn(
                                        "capitalize cursor-pointer text-sm",
                                        opt.year === selected.year && opt.month === selected.month
                                            ? "font-bold text-[#091226] bg-[#091226]/5"
                                            : "text-gray-700"
                                    )}
                                >
                                    {i === 0 ? `${opt.label} (actual)` : opt.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/dashboard/quotes">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2">
                            <Plus className="w-4 h-4" />
                            <span className="font-bold">Nueva Cotización</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ── KPI Cards ──────────────────────────────────────────────── */}
            <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4 transition-opacity duration-200", isPending && "opacity-50")}>

                {/* Pipeline activo */}
                <Card className="relative overflow-hidden group card-hover border-none premium-shadow bg-white dark:bg-slate-900">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-[#091226]" />
                    </div>
                    <CardContent className="pt-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Pipeline Activo
                            </span>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                {formatCLP(kpis.pipelineAmount)}
                            </h3>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-[#091226]/8 dark:bg-white/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-[#091226]" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">
                                {kpis.pipelineCount} pendientes
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Aprobadas ese mes */}
                <Card className="relative overflow-hidden group card-hover border-none premium-shadow bg-white dark:bg-slate-900">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CheckCircle2 className="w-24 h-24 text-green-600" />
                    </div>
                    <CardContent className="pt-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Aprobadas · {selected.label.split(" ")[0]}
                            </span>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                {kpis.approvedThisMonth}
                            </h3>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Cerradas</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Tasa de aceptación */}
                <Card className="relative overflow-hidden group card-hover border-none premium-shadow bg-white dark:bg-slate-900">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-24 h-24 text-purple-600" />
                    </div>
                    <CardContent className="pt-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Tasa de aceptación
                            </span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                    {kpis.acceptanceRate}%
                                </h3>
                                {kpis.acceptanceRate >= 60 && (
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-1.5 py-0 h-5 text-[10px] font-bold">
                                        Saludable
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Del mes</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Por vencer en 7 días — no cambia con el filtro */}
                <Card className="relative overflow-hidden group card-hover border-none premium-shadow bg-white dark:bg-slate-900">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Clock className="w-24 h-24 text-orange-500" />
                    </div>
                    <CardContent className="pt-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Por vencer (7 días)
                            </span>
                            <h3 className={cn(
                                "text-2xl font-black tracking-tight leading-none",
                                kpis.expiringCount > 0
                                    ? "text-orange-500"
                                    : "text-gray-900 dark:text-gray-100"
                            )}>
                                {kpis.expiringCount} cotizaciones
                            </h3>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-500" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">
                                {kpis.expiringCount > 0 ? formatCLP(kpis.expiringAmount) : "Sin urgencias"}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Main Grid ──────────────────────────────────────────────── */}
            <div className={cn("grid gap-8 lg:grid-cols-3 transition-opacity duration-200", isPending && "opacity-50")}>

                {/* ── Columna izquierda (2/3) ──────────────────────────── */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Conversión del mes */}
                    <Card className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">
                                        Conversión · <span className="capitalize">{selected.label}</span>
                                    </CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        De cotizadas a aprobadas
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-extrabold text-primary">
                                        {kpis.acceptanceRate}%
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                        Aceptación
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8">
                            {/* Barra: cotizaciones del mes */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider italic">
                                        EMITIDAS
                                    </span>
                                    <span className="text-sm font-black italic">{kpis.quotesThisMonth}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-4 relative shadow-inner overflow-hidden">
                                    <div
                                        className="bg-[#091226] h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                                        style={{ width: kpis.quotesThisMonth > 0 ? "100%" : "0%" }}
                                    >
                                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            {/* Barra: aprobadas */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-gray-400">
                                    <span className="text-xs font-bold uppercase tracking-wider italic">
                                        APROBADAS
                                    </span>
                                    <span className="text-sm font-black italic">{kpis.approvedThisMonth}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-4 relative shadow-inner overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                                        style={{
                                            width: kpis.quotesThisMonth > 0
                                                ? `${kpis.acceptanceRate}%`
                                                : "0%",
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Últimas cotizaciones — siempre las 5 más recientes */}
                    <Card className="border-none premium-shadow bg-white dark:bg-slate-900">
                        <CardHeader className="p-8 pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">
                                        Últimas Cotizaciones
                                    </CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Las 5 más recientes
                                    </p>
                                </div>
                                <Link href="/dashboard/quotes">
                                    <Button
                                        variant="ghost"
                                        className="text-primary font-bold hover:bg-primary/5 rounded-xl px-4"
                                    >
                                        Ver todas
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                {quotes.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">No hay cotizaciones aún</p>
                                        <p className="text-sm mt-1">
                                            Las cotizaciones que crees aparecerán aquí
                                        </p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-50 dark:border-slate-800 hover:bg-transparent">
                                                <TableHead className="pl-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">FOLIO</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CLIENTE</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">FECHA</TableHead>
                                                <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">MONTO</TableHead>
                                                <TableHead className="pr-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">ESTADO</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {quotes.map((quote) => (
                                                <TableRow
                                                    key={quote.id}
                                                    className="group border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                                >
                                                    <TableCell className="pl-8 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border border-gray-100 dark:border-slate-700 flex items-center justify-center text-primary text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
                                                                #{quote.folio}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-bold text-gray-900 dark:text-gray-100">
                                                        {quote.clients?.business_name || "Particular"}
                                                    </TableCell>
                                                    <TableCell className="text-gray-500 dark:text-gray-400 font-medium text-xs italic">
                                                        {formatDate(quote.created_at)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-black text-gray-900 dark:text-gray-100 italic">
                                                        {formatCLP(Number(quote.total_amount))}
                                                    </TableCell>
                                                    <TableCell className="pr-8 text-center">
                                                        <Badge
                                                            className={cn(
                                                                "rounded-lg px-2 text-[10px] font-bold border-none",
                                                                STATUS_STYLES[quote.status] ?? STATUS_STYLES["pendiente"]
                                                            )}
                                                        >
                                                            {STATUS_LABEL[quote.status] ?? quote.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Columna derecha (1/3) ─────────────────────────────── */}
                <div className="space-y-6">

                    {/* Alertas */}
                    <Card className="border-none premium-shadow bg-gradient-to-br from-slate-900 to-black text-white p-2">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                                Alertas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {kpis.expiringCount > 0 ? (
                                <Link href="/dashboard/quotes">
                                    <div className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">
                                                COTIZACIONES
                                            </span>
                                            <Clock className="w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="font-bold text-sm leading-tight group-hover:text-yellow-100 transition-colors">
                                            {kpis.expiringCount} cotización{kpis.expiringCount > 1 ? "es" : ""} vence{kpis.expiringCount > 1 ? "n" : ""} esta semana
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2 font-medium">
                                            Valor: {formatCLP(kpis.expiringAmount)}
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">
                                            TODO EN ORDEN
                                        </span>
                                        <Clock className="w-4 h-4 text-green-400" />
                                    </div>
                                    <p className="font-bold text-sm leading-tight">
                                        Sin cotizaciones por vencer
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">
                                        Todas tus cotizaciones están al día
                                    </p>
                                </div>
                            )}

                            {/* Resumen del mes */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                                    RESUMEN · <span className="capitalize">{selected.label.split(" ")[0]}</span>
                                </span>
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-400">Clientes activos</span>
                                        <span className="font-black">{kpis.totalClients}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-400">Cotizaciones emitidas</span>
                                        <span className="font-black text-white/90">{kpis.quotesThisMonth}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-400">Pipeline pendiente</span>
                                        <span className="font-black text-yellow-400">{kpis.pipelineCount}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Clientes quick stat */}
                    <Card className="border-none premium-shadow bg-[#091226] text-white overflow-hidden group relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <Users className="w-20 h-20" />
                        </div>
                        <CardContent className="p-8">
                            <h4 className="font-black text-lg">Clientes</h4>
                            <p className="text-white/70 text-xs font-medium mt-1">
                                {kpis.totalClients > 0
                                    ? `Tienes ${kpis.totalClients} cliente${kpis.totalClients > 1 ? "s" : ""} activo${kpis.totalClients > 1 ? "s" : ""}.`
                                    : "Aún no tienes clientes registrados."}
                            </p>
                            <Link href="/dashboard/clients">
                                <Button
                                    variant="outline"
                                    className="mt-6 bg-white/10 border-white/20 hover:bg-white/20 text-white text-xs font-bold rounded-xl h-9"
                                >
                                    Ver Clientes
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

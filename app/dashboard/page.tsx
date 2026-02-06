import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
    TrendingDown,
    Calendar,
    Search,
    Plus,
    AlertTriangle,
    Clock,
    Users,
    Sparkles,
} from "lucide-react";
import { getDashboardKPIs, getRecentMovements, getQuoteAlerts } from "@/app/actions/dashboard";
import { formatCLP } from "@/lib/currency";
import Link from "next/link";

export default async function DashboardPage() {
    // Obtener datos reales
    const kpis = await getDashboardKPIs();
    const recentMovements = await getRecentMovements(5);
    const quoteAlerts = await getQuoteAlerts();

    // Obtener mes actual para mostrar en el header
    const currentMonth = new Date().toLocaleDateString("es-CL", { month: "short", year: "numeric" });

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
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
                    <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900 shadow-sm border-gray-200 dark:border-slate-800">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm capitalize">{currentMonth}</span>
                    </Button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar operaciones..."
                            className="pl-10 w-64 h-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 focus:ring-primary/20 transition-all rounded-xl shadow-sm"
                        />
                    </div>
                    <Link href="/dashboard/sales">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2">
                            <Plus className="w-4 h-4" />
                            <span className="font-bold">Nueva Entrada</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Income */}
                <Card className="relative overflow-hidden group card-hover border-none premium-shadow bg-white dark:bg-slate-900">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-green-600" />
                    </div>
                    <CardContent className="pt-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ingresos del Mes</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                    {formatCLP(kpis.totalIncome)}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Ventas totales</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Expenses */}
                <Card className="relative overflow-hidden group card-hover border-none premium-shadow bg-white dark:bg-slate-900">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingDown className="w-24 h-24 text-red-600" />
                    </div>
                    <CardContent className="pt-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gastos del Mes</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                    {formatCLP(kpis.totalExpenses)}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Egresos totales</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Operating Result */}
                <Card className="relative overflow-hidden group card-hover border-none premium-shadow bg-white dark:bg-slate-900">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-24 h-24 text-blue-600" />
                    </div>
                    <CardContent className="pt-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Resultado Operacional</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className={cn(
                                    "text-2xl font-black tracking-tight leading-none",
                                    kpis.operatingResult >= 0
                                        ? "text-gray-900 dark:text-gray-100"
                                        : "text-red-600"
                                )}>
                                    {formatCLP(kpis.operatingResult)}
                                </h3>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Ingresos - Gastos</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Net Margin */}
                <Card className="relative overflow-hidden group card-hover border-none premium-shadow bg-white dark:bg-slate-900">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-24 h-24 text-purple-600" />
                    </div>
                    <CardContent className="pt-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Margen Neto</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className={cn(
                                    "text-2xl font-black tracking-tight leading-none",
                                    kpis.netMargin >= 0
                                        ? "text-gray-900 dark:text-gray-100"
                                        : "text-red-600"
                                )}>
                                    {kpis.netMargin}%
                                </h3>
                                {kpis.netMargin > 30 && (
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-1.5 py-0 h-5 text-[10px] font-bold">
                                        Saludable
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Rentabilidad</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column - 2/3 */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Operational Health */}
                    <Card className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">Salud Operacional</CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Distribución de formalización de ventas
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-4xl font-extrabold text-primary">{kpis.documentedSalesPercent}%</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Documentado</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider italic">
                                        VENTAS DOCUMENTADAS
                                    </span>
                                    <span className="text-sm font-black italic">{kpis.documentedSalesPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-4 relative shadow-inner overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                                        style={{ width: `${kpis.documentedSalesPercent}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-gray-400">
                                    <span className="text-xs font-bold uppercase tracking-wider italic">
                                        SIN DOCUMENTAR
                                    </span>
                                    <span className="text-sm font-black italic">{100 - kpis.documentedSalesPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-4 relative shadow-inner overflow-hidden">
                                    <div
                                        className="bg-gray-300 dark:bg-slate-700 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${100 - kpis.documentedSalesPercent}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Movements */}
                    <Card className="border-none premium-shadow bg-white dark:bg-slate-900">
                        <CardHeader className="p-8 pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold tracking-tight">Movimientos Recientes</CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Últimas transacciones registradas</p>
                                </div>
                                <Link href="/dashboard/sales">
                                    <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl px-4">
                                        Ver Historial Completo
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                {recentMovements.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <p className="font-medium">No hay movimientos registrados aún</p>
                                        <p className="text-sm mt-1">Las ventas y gastos aparecerán aquí</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-gray-50 dark:border-slate-800 hover:bg-transparent">
                                                <TableHead className="pl-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">ENTIDAD</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">FECHA</TableHead>
                                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">TIPO</TableHead>
                                                <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">MONTO</TableHead>
                                                <TableHead className="pr-8 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">ESTADO</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentMovements.map((mov) => (
                                                <TableRow key={mov.id} className="group border-gray-50 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <TableCell className="pl-8 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border border-gray-100 dark:border-slate-700 flex items-center justify-center text-primary text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
                                                                {mov.initials}
                                                            </div>
                                                            <span className="font-bold text-gray-900 dark:text-gray-100">{mov.entity}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-500 dark:text-gray-400 font-medium text-xs italic">{mov.date}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={cn(
                                                                "rounded-lg px-2 px-1 text-[10px] font-bold border-none",
                                                                mov.type === "income"
                                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                            )}
                                                        >
                                                            {mov.type === "income" ? "INGRESO" : "EGRESO"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-black text-gray-900 dark:text-gray-100 italic">
                                                        {formatCLP(mov.amount)}
                                                    </TableCell>
                                                    <TableCell className="pr-8 text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "rounded-full px-3 py-0.5 text-[9px] font-black tracking-widest",
                                                                mov.status === "billed"
                                                                    ? "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                                                                    : "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400"
                                                            )}
                                                        >
                                                            {mov.status === "billed" ? "✓ PAGADO" : "🕒 PENDIENTE"}
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

                {/* Right Column - 1/3 - Insights & Alerts */}
                <div className="space-y-6">
                    <Card className="border-none premium-shadow bg-gradient-to-br from-slate-900 to-black text-white p-2">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                                Alertas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {/* Alert - Expiring Quotes */}
                            {quoteAlerts.count > 0 ? (
                                <Link href="/dashboard/quotes">
                                    <div className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-colors cursor-pointer group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">COTIZACIONES</span>
                                            <Clock className="w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="font-bold text-sm leading-tight group-hover:text-yellow-100 transition-colors">
                                            {quoteAlerts.count} Cotización{quoteAlerts.count > 1 ? "es" : ""} vence{quoteAlerts.count > 1 ? "n" : ""} esta semana
                                        </p>
                                        <p className="text-xs text-slate-400 mt-2 font-medium">
                                            Valor: {formatCLP(quoteAlerts.totalValue)}
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">TODO EN ORDEN</span>
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

                            {/* Stats Summary */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">RESUMEN DEL MES</span>
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-400">Clientes activos</span>
                                        <span className="font-black">{kpis.totalClients}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-400">Nuevos este mes</span>
                                        <span className="font-black text-green-400">+{kpis.newClientsThisMonth}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats Helper */}
                    <Card className="border-none premium-shadow bg-blue-600 text-white overflow-hidden group relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <Users className="w-20 h-20" />
                        </div>
                        <CardContent className="p-8">
                            <h4 className="font-black text-lg">Clientes</h4>
                            <p className="text-blue-100 text-xs font-medium mt-1">
                                {kpis.newClientsThisMonth > 0
                                    ? `Has sumado ${kpis.newClientsThisMonth} cliente${kpis.newClientsThisMonth > 1 ? "s" : ""} este mes.`
                                    : "Aún no hay nuevos clientes este mes."
                                }
                            </p>
                            <Link href="/dashboard/clients">
                                <Button variant="outline" className="mt-6 bg-white/10 border-white/20 hover:bg-white/20 text-white text-xs font-bold rounded-xl h-9">
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

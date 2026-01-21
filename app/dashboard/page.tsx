"use client";

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

function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(amount);
}

// Datos mock
const kpis = {
    totalIncome: 45200000,
    totalExpenses: 28450000,
    operatingResult: 16750000,
    netMargin: 37,
};

const recentMovements = [
    {
        id: "1",
        entity: "Acme Corp",
        initials: "AC",
        date: "24 Oct 2024",
        type: "income",
        amount: 12400000,
        status: "billed",
    },
    {
        id: "2",
        entity: "Server Stack",
        initials: "SS",
        date: "22 Oct 2024",
        type: "expense",
        amount: 1200000,
        status: "pending",
    },
    {
        id: "3",
        entity: "Design Labs",
        initials: "DL",
        date: "21 Oct 2024",
        type: "income",
        amount: 8900000,
        status: "billed",
    },
];

export default function DashboardPage() {
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
                        <span className="font-semibold text-sm">Oct 2024</span>
                    </Button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar operaciones..."
                            className="pl-10 w-64 h-10 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 focus:ring-primary/20 transition-all rounded-xl shadow-sm"
                        />
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2">
                        <Plus className="w-4 h-4" />
                        <span className="font-bold">Nueva Entrada</span>
                    </Button>
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
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ingresos Totales</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                    {formatCLP(kpis.totalIncome)}
                                </h3>
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none px-1.5 py-0 h-5 text-[10px] font-bold">
                                    +12%
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Crecimiento sólido</span>
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
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gastos Mensuales</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                    {formatCLP(kpis.totalExpenses)}
                                </h3>
                                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none px-1.5 py-0 h-5 text-[10px] font-bold">
                                    -4%
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Bajo control</span>
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
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">EBITDA / Operacional</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                    {formatCLP(kpis.operatingResult)}
                                </h3>
                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none px-1.5 py-0 h-5 text-[10px] font-bold">
                                    +8%
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Máximo histórico</span>
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
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Margen de Salud</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                    {kpis.netMargin}%
                                </h3>
                                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-none px-1.5 py-0 h-5 text-[10px] font-bold">
                                    +2%
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-xs font-semibold text-gray-400 italic">Estado óptimo</span>
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
                                    <p className="text-4xl font-extrabold text-primary">78%</p>
                                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">+5% vs objetivo</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider italic">
                                        VENTAS DOCUMENTADAS
                                    </span>
                                    <span className="text-sm font-black italic">78%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-4 relative shadow-inner overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                                        style={{ width: "78%" }}
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
                                    <span className="text-sm font-black italic">22%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-4 relative shadow-inner overflow-hidden">
                                    <div
                                        className="bg-gray-300 dark:bg-slate-700 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: "22%" }}
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
                                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl px-4">
                                    Ver Historial Completo
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
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
                                                        {mov.status === "billed" ? "✓ FACTURADO" : "🕒 PENDIENTE"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
                                AI Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {/* Alert 1 - Overdue Payments */}
                            <div className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-colors cursor-pointer group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">PAGOS VENCIDOS</span>
                                    <AlertTriangle className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="font-bold text-sm leading-tight group-hover:text-red-200 transition-colors">
                                    3 Cuentas con mora significativa
                                </p>
                                <p className="text-xs text-slate-400 mt-2 font-medium">
                                    Exposición: $14.200. Acción requerida urgente.
                                </p>
                            </div>

                            {/* Alert 2 - Expiring Quotes */}
                            <div className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-colors cursor-pointer group">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">COTIZACIONES</span>
                                    <Clock className="w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="font-bold text-sm leading-tight group-hover:text-yellow-100 transition-colors">
                                    12 Cotizaciones vencen pronto
                                </p>
                                <p className="text-xs text-slate-400 mt-2 font-medium">
                                    Valor: $45k. Probabilidad de cierre: 85%.
                                </p>
                            </div>

                            {/* Forecast */}
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">PRONÓSTICO 30 DÍAS</span>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-3xl font-black italic">
                                        +{formatCLP(22400000)}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-end gap-1.5 h-16">
                                    {[40, 55, 45, 60, 50, 65, 58, 70, 65, 75, 80, 85].map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400/80 rounded-t-sm transition-all hover:scale-y-110 h-full"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] font-bold text-center text-slate-500 mt-4 tracking-widest">CONFIANZA DEL MODELO: 92%</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats Helper */}
                    <Card className="border-none premium-shadow bg-blue-600 text-white overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <Users className="w-20 h-20" />
                        </div>
                        <CardContent className="p-8">
                            <h4 className="font-black text-lg">Crecimiento de Clientes</h4>
                            <p className="text-blue-100 text-xs font-medium mt-1">Has sumado 5 clientes VIP este mes.</p>
                            <Button variant="outline" className="mt-6 bg-white/10 border-white/20 hover:bg-white/20 text-white text-xs font-bold rounded-xl h-9">
                                Ver Segmentación
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

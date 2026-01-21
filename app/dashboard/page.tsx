"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Resumen Ejecutivo</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Oct 1 - Oct 31, 2024
                    </Button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar operaciones..."
                            className="pl-10 w-56 h-9"
                        />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                        <Plus className="w-4 h-4" />
                        Nueva Entrada
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Income */}
                <Card className="bg-white dark:bg-[#020817] border-gray-200 dark:border-gray-800">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Ingresos Totales
                                </p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">
                                    {formatCLP(kpis.totalIncome)}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-green-600">+12.5%</span>
                                    <span className="text-xs text-gray-400">vs mes anterior</span>
                                </div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Expenses */}
                <Card className="bg-white dark:bg-[#020817] border-gray-200 dark:border-gray-800">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Gastos Totales
                                </p>
                                <p className="text-2xl font-bold text-red-500 mt-1">
                                    {formatCLP(kpis.totalExpenses)}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingDown className="w-3 h-3 text-red-500" />
                                    <span className="text-xs text-red-500">-4.2%</span>
                                    <span className="text-xs text-gray-400">vs mes anterior</span>
                                </div>
                            </div>
                            <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Operating Result */}
                <Card className="bg-white dark:bg-[#020817] border-gray-200 dark:border-gray-800">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Resultado Operacional
                                </p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    {formatCLP(kpis.operatingResult)}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3 text-blue-500" />
                                    <span className="text-xs text-blue-600">+8.1%</span>
                                    <span className="text-xs text-gray-400">optimización</span>
                                </div>
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Net Margin */}
                <Card className="bg-white">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Margen Neto</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">
                                    {kpis.netMargin}%
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp className="w-3 h-3 text-purple-500" />
                                    <span className="text-xs text-purple-600">+2.4%</span>
                                    <span className="text-xs text-gray-400">índice salud</span>
                                </div>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - 2/3 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Operational Health */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Salud Operacional</CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        % Formalización (Documentado vs Sin Documentar)
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">78%</p>
                                    <p className="text-xs text-green-600 dark:text-green-500">+5% este ciclo</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        DOCUMENTADO (FACTURADO)
                                    </span>
                                    <span className="text-sm font-medium">78%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all"
                                        style={{ width: "78%" }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                                        SIN DOCUMENTAR
                                    </span>
                                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">22%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                                    <div
                                        className="bg-gray-300 dark:bg-gray-700 h-3 rounded-full transition-all"
                                        style={{ width: "22%" }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Movements */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Movimientos Recientes</CardTitle>
                                <Button variant="link" className="text-blue-600 p-0 h-auto">
                                    Ver Todo
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ENTIDAD</TableHead>
                                        <TableHead>FECHA</TableHead>
                                        <TableHead>TIPO</TableHead>
                                        <TableHead className="text-right">MONTO</TableHead>
                                        <TableHead>ESTADO</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentMovements.map((mov) => (
                                        <TableRow key={mov.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                                                        {mov.initials}
                                                    </div>
                                                    <span className="font-medium">{mov.entity}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-500">{mov.date}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        mov.type === "income"
                                                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                            : "bg-red-100 text-red-700 hover:bg-red-100"
                                                    }
                                                >
                                                    {mov.type === "income" ? "Ingreso" : "Gasto"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCLP(mov.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        mov.status === "billed"
                                                            ? "border-blue-200 text-blue-700"
                                                            : "border-yellow-200 text-yellow-700"
                                                    }
                                                >
                                                    {mov.status === "billed" ? "FACTURADO" : "PENDIENTE"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - 1/3 - Insights & Alerts */}
                <div className="space-y-4">
                    <Card className="bg-gradient-to-br from-gray-50 to-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                                Insights y Alertas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Alert 1 - Overdue Payments */}
                            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-xs font-semibold text-red-600 mb-1">
                                    PAGOS VENCIDOS
                                </p>
                                <p className="font-medium text-gray-900">
                                    3 Cuentas con mora significativa
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Exposición total: $14.200. Acción requerida para mantener
                                    flujo de caja.
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 w-full border-red-200 text-red-700 hover:bg-red-50"
                                >
                                    Revisar Ahora
                                </Button>
                            </div>

                            {/* Alert 2 - Expiring Quotes */}
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                <p className="text-xs font-semibold text-yellow-600 mb-1">
                                    COTIZACIONES POR VENCER
                                </p>
                                <p className="font-medium text-gray-900">
                                    12 Cotizaciones vencen en 48h
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Valor oportunidad: $45k. Alta probabilidad de conversión si se
                                    contacta.
                                </p>
                            </div>

                            {/* Alert 3 - Inactive Clients */}
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <p className="text-xs font-semibold text-purple-600 mb-1">
                                    CLIENTES INACTIVOS
                                </p>
                                <p className="font-medium text-gray-900">
                                    Riesgo de pérdida detectado
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    5 clientes con +$500k en valor histórico llevan 60 días sin
                                    actividad.
                                </p>
                            </div>

                            {/* Forecast */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs font-semibold text-blue-600 mb-1">
                                    PRONÓSTICO 30 DÍAS
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-bold text-blue-700">
                                        +{formatCLP(22400000)}
                                    </p>
                                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                        CONFIANZA: 92%
                                    </span>
                                </div>
                                {/* Simple chart placeholder */}
                                <div className="mt-3 h-12 flex items-end gap-1">
                                    {[40, 55, 45, 60, 50, 65, 58, 70, 65, 75, 80, 85].map(
                                        (h, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-blue-200 rounded-t"
                                                style={{ height: `${h}%` }}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

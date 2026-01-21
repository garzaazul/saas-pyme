"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Receipt, RefreshCw, TrendingDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatUF(amount: number): string {
    return `UF ${new Intl.NumberFormat("es-CL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)}`;
}

// Valor UF de ejemplo
const UF_VALUE = 38500;

const mockExpenses = [
    {
        id: "1",
        description: "Arriendo Oficina",
        category: "Arriendo",
        amount: 1500000,
        isRecurring: true,
        date: "2024-10-01",
    },
    {
        id: "2",
        description: "Servicios Básicos",
        category: "Servicios",
        amount: 180000,
        isRecurring: true,
        date: "2024-10-05",
    },
    {
        id: "3",
        description: "Compra Materiales",
        category: "Insumos",
        amount: 450000,
        isRecurring: false,
        date: "2024-10-10",
    },
    {
        id: "4",
        description: "Pago Proveedor XYZ",
        category: "Proveedores",
        amount: 2300000,
        isRecurring: false,
        date: "2024-10-12",
    },
];

export default function ExpensesPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUF, setIsUF] = useState(false);
    const [ufAmount, setUfAmount] = useState<string>("");

    const totalExpenses = mockExpenses.reduce((acc, e) => acc + e.amount, 0);
    const recurringExpenses = mockExpenses
        .filter((e) => e.isRecurring)
        .reduce((acc, e) => acc + e.amount, 0);

    const clpEquivalent = isUF && ufAmount ? parseFloat(ufAmount) * UF_VALUE : 0;

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Gastos
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Controla tus egresos y optimiza tu flujo de caja.
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2">
                            <Plus className="w-4 h-4" />
                            <span className="font-bold">Nuevo Gasto</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight">Registrar Nuevo Gasto</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Descripción</label>
                                <Input placeholder="Ej: Arriendo oficina Octubre" className="rounded-xl bg-gray-50 dark:bg-slate-800 border-none h-11" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Categoría</label>
                                <Select>
                                    <SelectTrigger className="rounded-xl bg-gray-50 dark:bg-slate-800 border-none h-11">
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="rent">Arriendo</SelectItem>
                                        <SelectItem value="services">Servicios</SelectItem>
                                        <SelectItem value="supplies">Insumos</SelectItem>
                                        <SelectItem value="providers">Proveedores</SelectItem>
                                        <SelectItem value="salaries">Sueldos</SelectItem>
                                        <SelectItem value="other">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* UF Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                        <Receipt className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold">Ingresar en UF</span>
                                </div>
                                <Switch checked={isUF} onCheckedChange={setIsUF} />
                            </div>

                            {isUF ? (
                                <div className="space-y-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Monto en UF"
                                        value={ufAmount}
                                        onChange={(e) => setUfAmount(e.target.value)}
                                        className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 text-lg font-black"
                                    />
                                    {ufAmount && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Equivalente CLP</span>
                                            <span className="text-sm font-black text-primary">{formatCLP(clpEquivalent)}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Monto CLP</label>
                                    <Input type="number" placeholder="0" className="rounded-xl bg-gray-50 dark:bg-slate-800 border-none h-11 text-lg font-black" />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Fecha de Operación</label>
                                <Input type="date" className="rounded-xl bg-gray-50 dark:bg-slate-800 border-none h-11" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                        <RefreshCw className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold">Gasto Recurrente</span>
                                </div>
                                <Switch />
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <Button variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl font-bold">
                                    Cancelar
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold px-8">
                                    Guardar Gasto
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Gastos del Mes
                        </CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight text-red-600 leading-none">
                            {formatCLP(totalExpenses)}
                        </div>
                        <p className="text-xs font-bold text-red-600 mt-2 italic shadow-sm bg-red-50 dark:bg-red-900/20 inline-block px-2 py-0.5 rounded-full">-4% vs sept</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Gastos Fijos
                        </CardTitle>
                        <RefreshCw className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none">
                            {formatCLP(recurringExpenses)}
                        </div>
                        <p className="text-xs font-bold text-purple-600 mt-2 italic shadow-sm bg-purple-50 dark:bg-purple-900/20 inline-block px-2 py-0.5 rounded-full">
                            {formatUF(recurringExpenses / UF_VALUE)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-indigo-600 text-white overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-indigo-100">
                            Valor UF Actual
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none">{formatCLP(UF_VALUE)}</div>
                        <p className="text-xs font-bold text-indigo-100 mt-2 italic opacity-80 shadow-sm bg-white/10 inline-block px-2 py-0.5 rounded-full">Indicador Diario</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Table */}
            <Card className="border-none premium-shadow bg-white dark:bg-slate-900">
                <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Buscar por descripción..." className="pl-10 rounded-xl bg-gray-50 dark:bg-slate-800 border-none" />
                    </div>
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full md:w-48 rounded-xl border-gray-200 dark:border-slate-800">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            <SelectItem value="rent">Arriendo</SelectItem>
                            <SelectItem value="services">Servicios</SelectItem>
                            <SelectItem value="supplies">Insumos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                            <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400">DESCRIPCIÓN</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CATEGORÍA</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">MONTO</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">FECHA</TableHead>
                            <TableHead className="pr-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">TIPO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockExpenses.map((expense) => (
                            <TableRow key={expense.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800">
                                <TableCell className="pl-6 font-bold text-gray-900 dark:text-gray-100">
                                    {expense.description}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="rounded-lg border-gray-200 dark:border-slate-700 font-bold px-2 py-0 text-[10px] uppercase tracking-tighter">
                                        {expense.category}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-black text-red-600 italic">
                                    {formatCLP(expense.amount)}
                                </TableCell>
                                <TableCell className="text-gray-500 font-medium text-xs">
                                    {expense.date}
                                </TableCell>
                                <TableCell className="pr-6 text-center">
                                    {expense.isRecurring ? (
                                        <Badge className="rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-none font-black text-[9px] px-3 py-0.5 tracking-widest">
                                            <RefreshCw className="w-3 h-3 mr-1 inline" />
                                            RECURRENTE
                                        </Badge>
                                    ) : (
                                        <Badge className="rounded-full bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-400 border-none font-black text-[9px] px-3 py-0.5 tracking-widest uppercase">
                                            ÚNICO
                                        </Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

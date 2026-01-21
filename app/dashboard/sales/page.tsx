"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
    DialogDescription,
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
import { Plus, Upload, FileText, Receipt, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(amount);
}

// Mock data
const mockSales = [
    {
        id: "1",
        folio: "FAC-001",
        type: "invoice",
        client: "Tech Solutions S.A.",
        total: 5600000,
        date: "2024-10-15",
        status: "paid",
    },
    {
        id: "2",
        folio: "BOL-001",
        type: "receipt",
        client: "Juan Pérez",
        total: 150000,
        date: "2024-10-14",
        status: "paid",
    },
    {
        id: "3",
        folio: "SD-001",
        type: "nodoc",
        client: "Venta Directa",
        total: 85000,
        date: "2024-10-13",
        status: "pending",
    },
];

export default function SalesPage() {
    const [activeTab, setActiveTab] = useState("invoice");
    const [dialogOpen, setDialogOpen] = useState(false);

    const totalSales = mockSales.reduce((acc, s) => acc + s.total, 0);

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Ventas
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Registra y gestiona tus ingresos y documentos tributarios.
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2">
                            <Plus className="w-4 h-4 outline-none" />
                            <span className="font-bold">Nueva Venta</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight">Registrar Nueva Venta</DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium">
                                Selecciona el tipo de documento para registrar la venta
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="invoice" className="w-full mt-4">
                            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                                <TabsTrigger value="invoice" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Factura
                                </TabsTrigger>
                                <TabsTrigger value="receipt" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                                    <Receipt className="w-4 h-4 mr-2" />
                                    Boleta
                                </TabsTrigger>
                                <TabsTrigger value="nodoc" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
                                    Sin Doc.
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="invoice" className="space-y-4 mt-6">
                                <div className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-8 text-center bg-gray-50/50 dark:bg-slate-800/20 group hover:border-primary/50 transition-colors cursor-pointer">
                                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-4 group-hover:text-primary transition-colors" />
                                    <p className="text-sm text-gray-500 font-bold mb-2">
                                        Arrastra tu PDF de factura aquí
                                    </p>
                                    <Button variant="outline" size="sm" className="rounded-lg font-bold border-gray-200 dark:border-slate-700">
                                        Seleccionar archivo
                                    </Button>
                                </div>
                                <Input placeholder="Número de Factura" className="rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800" />
                                <Select>
                                    <SelectTrigger className="rounded-xl border-gray-200 dark:border-slate-800">
                                        <SelectValue placeholder="Seleccionar Cliente" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-200 dark:border-slate-800">
                                        <SelectItem value="1">Tech Solutions S.A.</SelectItem>
                                        <SelectItem value="2">Global Corp</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TabsContent>
                            <TabsContent value="receipt" className="space-y-4 mt-6">
                                <Input placeholder="Número de Boleta" className="rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800" />
                                <Input placeholder="Nombre del Cliente (opcional)" className="rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800" />
                                <Input type="number" placeholder="Monto Total" className="rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800" />
                                <Input type="date" className="rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800" />
                            </TabsContent>
                            <TabsContent value="nodoc" className="space-y-4 mt-6">
                                <Input placeholder="Descripción de la Venta" className="rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800" />
                                <Input type="number" placeholder="Monto Total" className="rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800" />
                                <Select>
                                    <SelectTrigger className="rounded-xl border-gray-200 dark:border-slate-800">
                                        <SelectValue placeholder="Método de Pago" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-200 dark:border-slate-800">
                                        <SelectItem value="cash">Efectivo</SelectItem>
                                        <SelectItem value="transfer">Transferencia</SelectItem>
                                        <SelectItem value="card">Tarjeta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TabsContent>
                        </Tabs>
                        <div className="flex justify-end gap-3 mt-8">
                            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl font-bold">
                                Cancelar
                            </Button>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold px-8">
                                Guardar Venta
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Ventas del Mes
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none">{formatCLP(totalSales)}</div>
                        <p className="text-xs font-bold text-green-600 mt-2 italic shadow-sm bg-green-50 dark:bg-green-900/20 inline-block px-2 py-0.5 rounded-full">+12% vs sept</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Facturas Emitidas
                        </CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none">12</div>
                        <p className="text-xs font-bold text-blue-600 mt-2 italic shadow-sm bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-0.5 rounded-full">Formalidad: 85%</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Boletas Emitidas
                        </CardTitle>
                        <Receipt className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none">45</div>
                        <p className="text-xs font-bold text-purple-600 mt-2 italic shadow-sm bg-purple-50 dark:bg-purple-900/20 inline-block px-2 py-0.5 rounded-full">Retail / Minorista</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="p-6 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <TabsList className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                            <TabsTrigger value="invoice" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Facturas</TabsTrigger>
                            <TabsTrigger value="receipt" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Boletas</TabsTrigger>
                            <TabsTrigger value="nodoc" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">Sin Doc.</TabsTrigger>
                        </TabsList>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input placeholder="Buscar por cliente o folio..." className="pl-10 w-full md:w-80 bg-gray-50 dark:bg-slate-800/50 border-none rounded-xl" />
                        </div>
                    </div>

                    <TabsContent value="invoice" className="m-0 border-t border-gray-50 dark:border-slate-800">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                                    <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400">FOLIO</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CLIENTE</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">TOTAL</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">FECHA</TableHead>
                                    <TableHead className="pr-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">ESTADO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockSales
                                    .filter((s) => s.type === "invoice")
                                    .map((sale) => (
                                        <TableRow key={sale.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800">
                                            <TableCell className="pl-6 font-bold text-gray-900 dark:text-gray-100 italic">{sale.folio}</TableCell>
                                            <TableCell className="font-semibold">{sale.client}</TableCell>
                                            <TableCell className="font-black text-primary italic">{formatCLP(sale.total)}</TableCell>
                                            <TableCell className="text-gray-500 font-medium text-xs">{sale.date}</TableCell>
                                            <TableCell className="pr-6 text-center">
                                                <Badge
                                                    className={cn(
                                                        "rounded-full px-3 py-0.5 text-[9px] font-black tracking-widest border-none",
                                                        sale.status === "paid"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    )}
                                                >
                                                    {sale.status === "paid" ? "✓ PAGADA" : "🕒 PENDIENTE"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="receipt" className="m-0 border-t border-gray-50 dark:border-slate-800">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                                    <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400">FOLIO</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CLIENTE</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">TOTAL</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">FECHA</TableHead>
                                    <TableHead className="pr-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">ESTADO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockSales
                                    .filter((s) => s.type === "receipt")
                                    .map((sale) => (
                                        <TableRow key={sale.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800">
                                            <TableCell className="pl-6 font-bold text-gray-900 dark:text-gray-100 italic">{sale.folio}</TableCell>
                                            <TableCell className="font-semibold">{sale.client}</TableCell>
                                            <TableCell className="font-black text-primary italic">{formatCLP(sale.total)}</TableCell>
                                            <TableCell className="text-gray-500 font-medium text-xs">{sale.date}</TableCell>
                                            <TableCell className="pr-6 text-center">
                                                <Badge className="rounded-full px-3 py-0.5 text-[9px] font-black tracking-widest border-none bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                    ✓ PAGADA
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="nodoc" className="m-0 border-t border-gray-50 dark:border-slate-800">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                                    <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400">FOLIO</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">DESCRIPCIÓN</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">TOTAL</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">FECHA</TableHead>
                                    <TableHead className="pr-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">ESTADO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockSales
                                    .filter((s) => s.type === "nodoc")
                                    .map((sale) => (
                                        <TableRow key={sale.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800">
                                            <TableCell className="pl-6 font-bold text-gray-900 dark:text-gray-100 italic">{sale.folio}</TableCell>
                                            <TableCell className="font-semibold">{sale.client}</TableCell>
                                            <TableCell className="font-black text-primary italic">{formatCLP(sale.total)}</TableCell>
                                            <TableCell className="text-gray-500 font-medium text-xs">{sale.date}</TableCell>
                                            <TableCell className="pr-6 text-center">
                                                <Badge className="rounded-full px-3 py-0.5 text-[9px] font-black tracking-widest border-none bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    🕒 PENDIENTE
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}

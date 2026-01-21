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
import { Plus, Upload, FileText, Receipt, Search } from "lucide-react";

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
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
                    <p className="text-gray-500">Registra y gestiona tus ventas</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Venta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Registrar Nueva Venta</DialogTitle>
                            <DialogDescription>
                                Selecciona el tipo de documento para registrar la venta
                            </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="invoice" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="invoice">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Factura
                                </TabsTrigger>
                                <TabsTrigger value="receipt">
                                    <Receipt className="w-4 h-4 mr-2" />
                                    Boleta
                                </TabsTrigger>
                                <TabsTrigger value="nodoc">Sin Documento</TabsTrigger>
                            </TabsList>
                            <TabsContent value="invoice" className="space-y-4 mt-4">
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-4" />
                                    <p className="text-sm text-gray-500 mb-2">
                                        Arrastra tu PDF de factura aquí o
                                    </p>
                                    <Button variant="outline" size="sm">
                                        Seleccionar archivo
                                    </Button>
                                </div>
                                <Input placeholder="Número de Factura" />
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Cliente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Tech Solutions S.A.</SelectItem>
                                        <SelectItem value="2">Global Corp</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TabsContent>
                            <TabsContent value="receipt" className="space-y-4 mt-4">
                                <Input placeholder="Número de Boleta" />
                                <Input placeholder="Nombre del Cliente (opcional)" />
                                <Input type="number" placeholder="Monto Total" />
                                <Input type="date" />
                            </TabsContent>
                            <TabsContent value="nodoc" className="space-y-4 mt-4">
                                <Input placeholder="Descripción de la Venta" />
                                <Input type="number" placeholder="Monto Total" />
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Método de Pago" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Efectivo</SelectItem>
                                        <SelectItem value="transfer">Transferencia</SelectItem>
                                        <SelectItem value="card">Tarjeta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TabsContent>
                        </Tabs>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Guardar Venta
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Ventas del Mes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCLP(totalSales)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Facturas Emitidas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Boletas Emitidas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs & Table */}
            <Card>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="p-4 border-b flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="invoice">Facturas</TabsTrigger>
                            <TabsTrigger value="receipt">Boletas</TabsTrigger>
                            <TabsTrigger value="nodoc">Sin Documento</TabsTrigger>
                        </TabsList>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input placeholder="Buscar..." className="pl-10 w-64" />
                        </div>
                    </div>

                    <TabsContent value="invoice" className="m-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>FOLIO</TableHead>
                                    <TableHead>CLIENTE</TableHead>
                                    <TableHead>TOTAL</TableHead>
                                    <TableHead>FECHA</TableHead>
                                    <TableHead>ESTADO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockSales
                                    .filter((s) => s.type === "invoice")
                                    .map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell className="font-medium">{sale.folio}</TableCell>
                                            <TableCell>{sale.client}</TableCell>
                                            <TableCell>{formatCLP(sale.total)}</TableCell>
                                            <TableCell>{sale.date}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={sale.status === "paid" ? "default" : "secondary"}
                                                    className={
                                                        sale.status === "paid"
                                                            ? "bg-green-100 text-green-700"
                                                            : ""
                                                    }
                                                >
                                                    {sale.status === "paid" ? "Pagada" : "Pendiente"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="receipt" className="m-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>FOLIO</TableHead>
                                    <TableHead>CLIENTE</TableHead>
                                    <TableHead>TOTAL</TableHead>
                                    <TableHead>FECHA</TableHead>
                                    <TableHead>ESTADO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockSales
                                    .filter((s) => s.type === "receipt")
                                    .map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell className="font-medium">{sale.folio}</TableCell>
                                            <TableCell>{sale.client}</TableCell>
                                            <TableCell>{formatCLP(sale.total)}</TableCell>
                                            <TableCell>{sale.date}</TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-100 text-green-700">
                                                    Pagada
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="nodoc" className="m-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>DESCRIPCIÓN</TableHead>
                                    <TableHead>TOTAL</TableHead>
                                    <TableHead>FECHA</TableHead>
                                    <TableHead>ESTADO</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockSales
                                    .filter((s) => s.type === "nodoc")
                                    .map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell className="font-medium">{sale.folio}</TableCell>
                                            <TableCell>{sale.client}</TableCell>
                                            <TableCell>{formatCLP(sale.total)}</TableCell>
                                            <TableCell>{sale.date}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">Pendiente</Badge>
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

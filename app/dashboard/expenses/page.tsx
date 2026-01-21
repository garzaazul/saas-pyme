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
import { Plus, Search, Receipt, RefreshCw } from "lucide-react";

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
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gastos</h1>
                    <p className="text-gray-500">Controla los gastos de tu negocio</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Gasto
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <Input placeholder="Descripción del gasto" />
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rent">Arriendo</SelectItem>
                                    <SelectItem value="services">Servicios</SelectItem>
                                    <SelectItem value="supplies">Insumos</SelectItem>
                                    <SelectItem value="providers">Proveedores</SelectItem>
                                    <SelectItem value="salaries">Sueldos</SelectItem>
                                    <SelectItem value="other">Otros</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* UF Toggle */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Ingresar en UF</span>
                                </div>
                                <Switch checked={isUF} onCheckedChange={setIsUF} />
                            </div>

                            {isUF ? (
                                <div className="space-y-2">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Monto en UF"
                                        value={ufAmount}
                                        onChange={(e) => setUfAmount(e.target.value)}
                                    />
                                    {ufAmount && (
                                        <p className="text-sm text-gray-500">
                                            Equivalente: {formatCLP(clpEquivalent)} (UF a{" "}
                                            {formatCLP(UF_VALUE)})
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <Input type="number" placeholder="Monto en CLP" />
                            )}

                            <Input type="date" />

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium">Gasto Recurrente</span>
                                </div>
                                <Switch />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Gastos del Mes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {formatCLP(totalExpenses)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Gastos Fijos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCLP(recurringExpenses)}
                        </div>
                        <p className="text-xs text-gray-500">
                            {formatUF(recurringExpenses / UF_VALUE)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Valor UF Actual
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCLP(UF_VALUE)}</div>
                        <p className="text-xs text-gray-500">Actualizado hoy</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar gastos..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="rent">Arriendo</SelectItem>
                        <SelectItem value="services">Servicios</SelectItem>
                        <SelectItem value="supplies">Insumos</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>DESCRIPCIÓN</TableHead>
                            <TableHead>CATEGORÍA</TableHead>
                            <TableHead>MONTO</TableHead>
                            <TableHead>FECHA</TableHead>
                            <TableHead>TIPO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockExpenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="font-medium">
                                    {expense.description}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{expense.category}</Badge>
                                </TableCell>
                                <TableCell className="text-red-600">
                                    {formatCLP(expense.amount)}
                                </TableCell>
                                <TableCell className="text-gray-500">{expense.date}</TableCell>
                                <TableCell>
                                    {expense.isRecurring ? (
                                        <Badge className="bg-purple-100 text-purple-700">
                                            <RefreshCw className="w-3 h-3 mr-1" />
                                            Recurrente
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">Único</Badge>
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

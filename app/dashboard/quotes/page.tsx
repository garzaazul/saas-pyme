"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    FileText,
    Send,
} from "lucide-react";

// Tipos para cotizaciones
type QuoteStatus = "DRAFT" | "SENT" | "ACCEPTED" | "INVOICED" | "REJECTED";

interface Quote {
    id: string;
    folio: string;
    clientName: string;
    clientInitials: string;
    total: number;
    validUntil: string;
    status: QuoteStatus;
}

// Datos de ejemplo
const mockQuotes: Quote[] = [
    {
        id: "1",
        folio: "COT-2024-001",
        clientName: "Tech Solutions S.A.",
        clientInitials: "TS",
        total: 12500000,
        validUntil: "12 Oct 2024",
        status: "ACCEPTED",
    },
    {
        id: "2",
        folio: "COT-2024-002",
        clientName: "Global Corp",
        clientInitials: "GC",
        total: 4200000,
        validUntil: "15 Oct 2024",
        status: "SENT",
    },
    {
        id: "3",
        folio: "COT-2024-003",
        clientName: "Acme Inc.",
        clientInitials: "AI",
        total: 8900000,
        validUntil: "01 Oct 2024",
        status: "INVOICED",
    },
    {
        id: "4",
        folio: "COT-2024-004",
        clientName: "Nexus Logistics",
        clientInitials: "NL",
        total: 1500000,
        validUntil: "20 Oct 2024",
        status: "DRAFT",
    },
    {
        id: "5",
        folio: "COT-2024-005",
        clientName: "Delta Media",
        clientInitials: "DM",
        total: 15750000,
        validUntil: "30 Sep 2024",
        status: "REJECTED",
    },
];

const statusConfig: Record<
    QuoteStatus,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
    DRAFT: { label: "BORRADOR", variant: "secondary" },
    SENT: { label: "ENVIADA", variant: "default" },
    ACCEPTED: { label: "ACEPTADA", variant: "default" },
    INVOICED: { label: "FACTURADA", variant: "outline" },
    REJECTED: { label: "RECHAZADA", variant: "destructive" },
};

function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function QuotesPage() {
    const [filter, setFilter] = useState<string>("all");

    const pendingTotal = mockQuotes
        .filter((q) => q.status === "SENT" || q.status === "DRAFT")
        .reduce((acc, q) => acc + q.total, 0);

    const acceptedTotal = mockQuotes
        .filter((q) => q.status === "ACCEPTED" || q.status === "INVOICED")
        .reduce((acc, q) => acc + q.total, 0);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cotizaciones</h1>
                    <p className="text-gray-500">
                        Gestiona tus cotizaciones y seguimiento comercial
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Cotización
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            COTIZACIONES PENDIENTES
                        </CardTitle>
                        <FileText className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCLP(pendingTotal)}</div>
                        <p className="text-xs text-green-600">+5.2% vs mes anterior</p>
                    </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            TOTAL ACEPTADO
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCLP(acceptedTotal)}</div>
                        <p className="text-xs text-red-600">-2.1% vs mes anterior</p>
                    </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            TASA DE CONVERSIÓN
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">68%</div>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: "68%" }}
                            ></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    {["all", "pending", "ready", "expired"].map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(f)}
                            className={filter === f ? "bg-blue-600" : ""}
                        >
                            {f === "all" && "Todas"}
                            {f === "pending" && "Pendientes"}
                            {f === "ready" && "Listas para Convertir"}
                            {f === "expired" && "Vencidas"}
                        </Button>
                    ))}
                </div>
                <div className="flex-1" />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar Folio o Cliente..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                </Button>
            </div>

            {/* Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>FOLIO</TableHead>
                            <TableHead>CLIENTE</TableHead>
                            <TableHead>TOTAL</TableHead>
                            <TableHead>VALIDEZ</TableHead>
                            <TableHead>ESTADO</TableHead>
                            <TableHead>ACCIONES</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockQuotes.map((quote) => (
                            <TableRow key={quote.id}>
                                <TableCell className="font-medium text-blue-600">
                                    {quote.folio}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                                            {quote.clientInitials}
                                        </div>
                                        <span>{quote.clientName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{formatCLP(quote.total)}</TableCell>
                                <TableCell className="text-gray-500">{quote.validUntil}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={statusConfig[quote.status].variant}
                                        className={
                                            quote.status === "ACCEPTED"
                                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                : quote.status === "SENT"
                                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                                    : ""
                                        }
                                    >
                                        {statusConfig[quote.status].label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {quote.status === "ACCEPTED" && (
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                Convertir a Venta
                                            </Button>
                                        )}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Ver Detalle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Enviar por Email
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Mostrando 1-5 de 48 cotizaciones</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm">
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}

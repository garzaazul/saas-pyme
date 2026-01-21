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
    Sparkles,
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
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Cotizaciones
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Gestiona tus propuestas comerciales y seguimiento de ventas.
                    </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="font-bold">Nueva Cotización</span>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Pendientes
                        </CardTitle>
                        <FileText className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight">{formatCLP(pendingTotal)}</div>
                        <p className="text-xs font-bold text-green-600 mt-1 italic">+5.2% vs mes anterior</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-green-600 text-white overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-green-100">
                            Total Aceptado
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-200" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight">{formatCLP(acceptedTotal)}</div>
                        <p className="text-xs font-bold text-green-200 mt-1 italic">Tasa de éxito creciente</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Conversión
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight text-primary">68%</div>
                        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
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

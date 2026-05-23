"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    Edit,
    Copy,
    Trash2,
    RotateCcw,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    Send,
    MessageCircle,
    Download,
    Search,
    Loader2
} from "lucide-react";
import { Quote, QuoteStatus } from "@/types/quotes";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface QuoteTableProps {
    quotes: any[];
    activeTab: string;
    onEdit: (quote: Quote) => void;
    onDuplicate: (id: string) => void;
    onDelete: (id: string) => void;
    onReactivate: (id: string) => void;
    onStatusChange: (id: string, status: QuoteStatus) => void;
    onDownloadPDF: (id: string) => void;
    onWhatsApp: (quote: any) => void;
}

const statusConfig = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    aprobada: { label: 'Aprobada', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
    facturada: { label: 'Facturada', color: 'bg-[#091226]/10 text-[#091226] dark:bg-white/10 dark:text-[#091226]/70', icon: FileText },
    rechazada: { label: 'Rechazada', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
    vencida: { label: 'Vencida', color: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-400', icon: Clock },
};

function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function QuoteTable({
    quotes,
    activeTab,
    onEdit,
    onDuplicate,
    onDelete,
    onReactivate,
    onStatusChange,
    onDownloadPDF,
    onWhatsApp
}: QuoteTableProps) {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    if (quotes.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 font-medium">
                <div className="bg-gray-50 dark:bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 opacity-20" />
                </div>
                {activeTab === "active" ? "No se encontraron cotizaciones activas." : "Papelera de cotizaciones vacía."}
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                    <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400">FOLIO</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CLIENTE</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">ESTADO</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">TOTAL</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">FECHA</TableHead>
                    <TableHead className="pr-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">ACCIONES</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quotes.map((quote) => {
                    const StatusIcon = statusConfig[quote.status as QuoteStatus].icon;
                    return (
                        <TableRow key={quote.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800 transition-colors">
                            <TableCell className="pl-6 py-4">
                                <span className="font-bold text-gray-900 dark:text-white tracking-tight">#{quote.folio}</span>
                                {quote.version > 1 && (
                                    <Badge variant="outline" className="ml-2 text-[9px] font-black border-[#091226]/20 text-[#091226] px-1 py-0 h-4">
                                        V{quote.version}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-gray-700 dark:text-slate-300">{quote.clients?.business_name || 'Particular'}</span>
                                    <span className="text-[10px] text-gray-400 font-bold italic tracking-tight">
                                        Vence: {quote.valid_until ? format(new Date(quote.valid_until), "dd MMM", { locale: es }) : 'N/A'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight",
                                    statusConfig[quote.status as QuoteStatus].color
                                )}>
                                    <StatusIcon className="w-3 h-3" />
                                    {statusConfig[quote.status as QuoteStatus].label.toUpperCase()}
                                </div>
                            </TableCell>
                            <TableCell className="font-black text-primary italic">
                                {formatCLP(quote.total_amount)}
                            </TableCell>
                            <TableCell className="text-xs text-gray-500 font-medium">
                                {format(new Date(quote.created_at), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                                {actionLoading === quote.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400 ml-auto" />
                                ) : (
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/10 text-green-600 rounded-full"
                                            onClick={() => onWhatsApp(quote)}
                                            title="Enviar por WhatsApp"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                        </Button>

                                        {quote.status === 'pendiente' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-2 text-[10px] font-black uppercase tracking-tight text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg gap-1.5"
                                                onClick={() => onStatusChange(quote.id, 'aprobada')}
                                                title="Aprobar Cotización"
                                            >
                                                <CheckCircle2 className="h-3 w-3" />
                                                APROBAR
                                            </Button>
                                        )}

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-slate-800 rounded-full">
                                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl border-none premium-shadow bg-white dark:bg-slate-900 p-2">
                                                <DropdownMenuItem onClick={() => onDownloadPDF(quote.id)} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-primary bg-primary/5 mb-1 gap-2">
                                                    <Download className="w-3.5 h-3.5" />
                                                    Descargar PDF
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gray-50 dark:bg-slate-800" />
                                                <DropdownMenuItem onClick={() => onEdit(quote)} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer gap-2">
                                                    <Edit className="w-3.5 h-3.5 text-[#091226]" />
                                                    Editar Cotización
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDuplicate(quote.id)} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer gap-2">
                                                    <Copy className="w-3.5 h-3.5 text-purple-500" />
                                                    Duplicar (Versión)
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gray-50 dark:bg-slate-800" />
                                                {quote.status === 'pendiente' && (
                                                    <DropdownMenuItem onClick={() => onStatusChange(quote.id, 'aprobada')} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer gap-2">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                        Marcar como Aprobada
                                                    </DropdownMenuItem>
                                                )}
                                                {(quote.status === 'pendiente' || quote.status === 'aprobada') && (
                                                    <DropdownMenuItem onClick={() => onStatusChange(quote.id, 'rechazada')} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer gap-2">
                                                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                                                        Marcar como Rechazada
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator className="bg-gray-50 dark:bg-slate-800" />
                                                {quote.is_active ? (
                                                    <DropdownMenuItem
                                                        onClick={() => onDelete(quote.id)}
                                                        className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10 gap-2"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Mover a Papelera
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() => onReactivate(quote.id)}
                                                        className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-900/10 gap-2"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        Reactivar Cotización
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

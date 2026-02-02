"use client";

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
    MoreHorizontal,
    Eye,
    Edit,
    Copy,
    Trash,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    Send
} from "lucide-react";
import { Quote, QuoteStatus } from "@/types/quotes";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface QuoteTableProps {
    quotes: any[];
    onEdit: (quote: Quote) => void;
    onDuplicate: (id: string) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: QuoteStatus) => void;
}

const statusConfig = {
    borrador: { label: 'Borrador', color: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-400', icon: Clock },
    enviada: { label: 'Enviada', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Send },
    aceptada: { label: 'Aceptada', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
    facturada: { label: 'Facturada', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: FileText },
    rechazada: { label: 'Rechazada', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function QuoteTable({ quotes, onEdit, onDuplicate, onDelete, onStatusChange }: QuoteTableProps) {
    return (
        <div className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
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
                                    <span className="font-black text-gray-900 dark:text-white tracking-tight">#{quote.folio}</span>
                                    {quote.version > 1 && (
                                        <Badge variant="outline" className="ml-2 text-[9px] font-bold border-blue-200 text-blue-600 px-1 py-0 h-4">
                                            v{quote.version}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-700 dark:text-slate-300">{quote.clients?.business_name}</span>
                                        <span className="text-[10px] text-gray-400 font-medium lowercase tracking-tight">
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
                                <TableCell className="font-black text-primary">
                                    {formatCLP(quote.total_amount)}
                                </TableCell>
                                <TableCell className="text-xs text-gray-500 font-medium">
                                    {format(new Date(quote.created_at), "dd/MM/yyyy")}
                                </TableCell>
                                <TableCell className="pr-6 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-slate-800 rounded-full">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-52 rounded-xl border-none premium-shadow bg-white dark:bg-slate-900 p-2">
                                            <DropdownMenuItem onClick={() => onEdit(quote)} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer">
                                                <Edit className="w-3.5 h-3.5 mr-2 text-blue-500" />
                                                Editar Cotización
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDuplicate(quote.id)} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer">
                                                <Copy className="w-3.5 h-3.5 mr-2 text-purple-500" />
                                                Duplicar (Versión)
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-gray-50 dark:bg-slate-800" />
                                            <DropdownMenuItem onClick={() => onStatusChange(quote.id, 'enviada')} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer">
                                                <Send className="w-3.5 h-3.5 mr-2 text-blue-400" />
                                                Marcar como Enviada
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onStatusChange(quote.id, 'aceptada')} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer">
                                                <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-green-500" />
                                                Marcar como Aceptada
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-gray-50 dark:bg-slate-800" />
                                            <DropdownMenuItem onClick={() => onDelete(quote.id)} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10">
                                                <Trash className="w-3.5 h-3.5 mr-2" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {quotes.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">No hay cotizaciones</h3>
                    <p className="text-sm text-gray-500 max-w-[250px] mt-1 italic">Comienza creando tu primera propuesta comercial.</p>
                </div>
            )}
        </div>
    );
}

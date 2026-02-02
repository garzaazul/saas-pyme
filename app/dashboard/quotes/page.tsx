"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    FileText,
    TrendingUp,
    CheckCircle2,
    Clock,
    Filter
} from "lucide-react";
import { QuoteTable } from "@/components/dashboard/quotes/quote-table";
import { QuoteForm } from "@/components/dashboard/quotes/quote-form";
import { getQuotes, duplicateQuote, deleteQuote, updateQuoteStatus } from "@/app/actions/quotes";
import { Quote, QuoteStatus } from "@/types/quotes";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<Quote | undefined>();
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getQuotes();
            setQuotes(data);
        } catch (error) {
            toast.error("Error al cargar cotizaciones");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDuplicate = async (id: string) => {
        const res = await duplicateQuote(id);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Cotización duplicada (Nueva versión)");
            fetchData();
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta cotización?")) return;
        const res = await deleteQuote(id);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Eliminada correctamente");
            fetchData();
        }
    };

    const handleStatusChange = async (id: string, status: QuoteStatus) => {
        const res = await updateQuoteStatus(id, status);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success(`Estado actualizado a ${status}`);
            fetchData();
        }
    };

    const filteredQuotes = quotes.filter(q =>
        q.folio.toString().includes(searchQuery) ||
        q.clients?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const kpis = {
        total: quotes.length,
        accepted: quotes.filter(q => q.status === 'aceptada').length,
        pendingValue: quotes.filter(q => q.status === 'enviada' || q.status === 'borrador')
            .reduce((acc, q) => acc + Number(q.total_amount), 0)
    };

    return (
        <div className="p-6 md:p-10 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-white italic">
                        COTIZACIONES
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] pl-1">
                        Pipeline de Ventas • Gestión Comercial
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setSelectedQuote(undefined);
                        setIsFormOpen(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 rounded-2xl font-black px-8 h-12 transition-all hover:scale-[1.02] active:scale-95 italic"
                >
                    <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
                    NUEVA PROPUESTA
                </Button>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none premium-shadow bg-blue-600 text-white overflow-hidden rounded-[2rem]">
                    <CardContent className="p-8 relative">
                        <TrendingUp className="absolute right-6 top-6 w-12 h-12 text-white/10" />
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Pipeline Pendiente</p>
                            <h3 className="text-3xl font-black italic tracking-tight">
                                ${kpis.pendingValue.toLocaleString("es-CL")}
                            </h3>
                            <p className="text-[9px] font-bold opacity-60">MONTO TOTAL POR CERRAR</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden rounded-[2rem]">
                    <CardContent className="p-8 relative">
                        <CheckCircle2 className="absolute right-6 top-6 w-12 h-12 text-green-500/10" />
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tasa de Aceptación</p>
                            <h3 className="text-3xl font-black italic tracking-tight text-gray-900 dark:text-white">
                                {kpis.total > 0 ? Math.round((kpis.accepted / kpis.total) * 100) : 0}%
                            </h3>
                            <p className="text-[9px] font-bold text-green-500 uppercase">{kpis.accepted} COTIZACIONES GANADAS</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden rounded-[2rem]">
                    <CardContent className="p-8 relative">
                        <Clock className="absolute right-6 top-6 w-12 h-12 text-orange-500/10" />
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Actividad Total</p>
                            <h3 className="text-3xl font-black italic tracking-tight text-gray-900 dark:text-white">
                                {kpis.total}
                            </h3>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">DOCUMENTOS GENERADOS</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-primary" />
                        <Input
                            placeholder="Buscar por folio o cliente..."
                            className="pl-11 h-12 rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900 font-bold focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="ghost" className="rounded-xl font-bold text-gray-400 gap-2">
                        <Filter className="w-4 h-4" />
                        Filtros Avanzados
                    </Button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </div>
                ) : (
                    <QuoteTable
                        quotes={filteredQuotes}
                        onEdit={(q) => {
                            setSelectedQuote(q);
                            setIsFormOpen(true);
                        }}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                    />
                )}
            </div>

            <QuoteForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                quote={selectedQuote}
                onSuccess={fetchData}
            />
        </div>
    );
}

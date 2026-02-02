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
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Gestión de Cotizaciones
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Controla tu pipeline comercial y propuestas de venta.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setSelectedQuote(undefined);
                        setIsFormOpen(true);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-11 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    <span className="font-bold">Nueva Propuesta</span>
                </Button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Pipeline Pendiente
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none text-gray-900 dark:text-white">
                            ${kpis.pendingValue.toLocaleString("es-CL")}
                        </div>
                        <p className="text-xs font-bold text-blue-600 mt-2 italic shadow-sm bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-0.5 rounded-full">Monto por cerrar</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Tasa de Aceptación
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none text-gray-900 dark:text-white">
                            {kpis.total > 0 ? Math.round((kpis.accepted / kpis.total) * 100) : 0}%
                        </div>
                        <p className="text-xs font-bold text-green-600 mt-2 italic shadow-sm bg-green-50 dark:bg-green-900/20 inline-block px-2 py-0.5 rounded-full">{kpis.accepted} Ganadas</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Actividad Total
                        </CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none text-gray-900 dark:text-white">
                            {kpis.total}
                        </div>
                        <p className="text-xs font-bold text-orange-600 mt-2 italic shadow-sm bg-orange-50 dark:bg-orange-900/20 inline-block px-2 py-0.5 rounded-full">Items generados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por folio o cliente..."
                            className="pl-10 rounded-xl bg-white dark:bg-slate-900 border-none premium-shadow h-11"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
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

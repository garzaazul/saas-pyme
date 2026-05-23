"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Plus,
    FileText,
    TrendingUp,
    CheckCircle2,
    Clock,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteTable } from "@/components/dashboard/quotes/quote-table";
import { QuoteForm } from "@/components/dashboard/quotes/quote-form";
import {
    getQuotes,
    duplicateQuote,
    softDeleteQuote,
    reactivateQuote,
    updateQuoteStatus,
    getQuote,
    getFolioPreview
} from "@/app/actions/quotes";
import { Quote, QuoteStatus } from "@/types/quotes";
import { Product } from "@/types/products";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { generateQuotePDF, exportToExcel, exportToPDF } from "@/lib/export-utils";
import { toast } from "sonner";
import { getMyOrganization, OrganizationWithActivity } from "@/app/actions/organizations";
import { getClients, Client } from "@/app/actions/clients";
import { getProducts } from "@/app/actions/products";

// ---------------------------------------------------------------------------
// Props — datos pre-cargados por el Server Component padre
// ---------------------------------------------------------------------------
interface QuotesClientProps {
    initialQuotes: any[];
    initialOrganization: OrganizationWithActivity | null;
    initialClients: Client[];
    initialProducts: any[];
    initialNextFolio: number | null;
}

export function QuotesClient({
    initialQuotes,
    initialOrganization,
    initialClients,
    initialProducts,
    initialNextFolio,
}: QuotesClientProps) {
    // Estado inicializado con datos del servidor — sin spinner en primera carga
    const [quotes, setQuotes] = useState<any[]>(initialQuotes);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<Quote | undefined>();
    const [searchTerm, setSearchTerm] = useState("");

    const [activeTab, setActiveTab] = useState("active");
    const [itemsPerPage, setItemsPerPage] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);

    const [organization, setOrganization] = useState<OrganizationWithActivity | null>(initialOrganization);
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [nextFolio, setNextFolio] = useState<number | null>(initialNextFolio);

    // fetchData solo se llama DESPUÉS de mutaciones para refrescar
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [quotesData, orgData, clientsData, productsData, folioData] = await Promise.all([
                getQuotes(),
                getMyOrganization(),
                getClients(),
                getProducts(),
                getFolioPreview()
            ]);
            setQuotes(quotesData);
            setOrganization(orgData);
            setClients(clientsData);
            setProducts(productsData);
            setNextFolio(folioData);
        } catch (error) {
            console.error("Error refreshing quotes data:", error);
            toast.error("Error al refrescar los datos");
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset page when filtering or changing tabs
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab, itemsPerPage]);

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
        if (!confirm("¿Está seguro de mover esta cotización a la papelera?")) return;
        const res = await softDeleteQuote(id);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Movida a la papelera correctamente");
            fetchData();
        }
    };

    const handleReactivate = async (id: string) => {
        const res = await reactivateQuote(id);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Cotización reactivada");
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

    const handleDownloadPDF = async (id: string) => {
        toast.info("Generando PDF...");
        try {
            const quoteData = await getQuote(id);
            if (quoteData) {
                generateQuotePDF(quoteData);
                toast.success("PDF descargado");
            }
        } catch (error) {
            toast.error("Error al generar PDF");
        }
    };

    const handleWhatsApp = (quote: any) => {
        const phone = quote.client?.phone || quote.clients?.phone || "";
        if (!phone) {
            toast.error("El cliente no tiene un teléfono registrado");
            return;
        }
        const businessName = quote.clients?.business_name || quote.client?.business_name || "cliente";
        const message = `Hola ${businessName}, adjunto la cotización #${quote.folio} solicitada. Quedo atento a sus comentarios.`;
        const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    const handleExportExcel = () => {
        const columnMapping = {
            folio: "Folio",
            client_name: "Cliente",
            total_amount: "Total",
            status: "Estado",
            created_at: "Fecha"
        };
        const dataToExport = filteredBySearch.map(q => ({
            ...q,
            client_name: q.clients?.business_name || "Particular",
            total_amount: q.total_amount,
            status: q.status.toUpperCase(),
            created_at: new Date(q.created_at).toLocaleDateString()
        }));
        exportToExcel(dataToExport, `Cotizaciones_${activeTab === "active" ? "Activas" : "Papelera"}`, columnMapping);
        toast.success("Excel generado correctamente");
    };

    const handleExportPDF = () => {
        const columns = [
            { header: "Folio", dataKey: "folio" },
            { header: "Cliente", dataKey: "client" },
            { header: "Total", dataKey: "total" },
            { header: "Estado", dataKey: "status" }
        ];
        const dataToExport = filteredBySearch.map(q => ({
            folio: `#${q.folio}`,
            client: q.clients?.business_name || "Particular",
            total: new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(q.total_amount),
            status: q.status.toUpperCase()
        }));
        exportToPDF(
            `Reporte de Cotizaciones - ${activeTab === "active" ? "Activas" : "Papelera"}`,
            dataToExport,
            columns
        );
        toast.success("PDF generado correctamente");
    };

    // Filtering
    const activeQuotes = useMemo(() => quotes.filter(q => q.is_active), [quotes]);
    const trashQuotes = useMemo(() => quotes.filter(q => !q.is_active), [quotes]);
    const filteredByTab = activeTab === "active" ? activeQuotes : trashQuotes;
    const filteredBySearch = useMemo(() => {
        return filteredByTab.filter(q =>
            q.folio.toString().includes(searchTerm) ||
            q.clients?.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [filteredByTab, searchTerm]);

    const totalPages = Math.ceil(filteredBySearch.length / Number(itemsPerPage));
    const pagedQuotes = filteredBySearch.slice(
        (currentPage - 1) * Number(itemsPerPage),
        currentPage * Number(itemsPerPage)
    );

    const kpis = {
        total: activeQuotes.length,
        accepted: activeQuotes.filter(q => q.status === "aprobada" || q.status === "facturada").length,
        pendingValue: activeQuotes.filter(q => q.status === "pendiente")
            .reduce((acc, q) => acc + Number(q.total_amount), 0),
        opportunities: activeQuotes.filter(q => q.status === "pendiente").length
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
            </div>

            {/* KPI Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Pipeline Pendiente
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-[#091226]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none text-gray-900 dark:text-white">
                            ${kpis.pendingValue.toLocaleString("es-CL")}
                        </div>
                        <p className="text-xs font-bold text-[#091226] mt-2 italic shadow-sm bg-[#091226]/5 dark:bg-white/10 inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter">Monto por cerrar</p>
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
                        <p className="text-xs font-bold text-green-600 mt-2 italic shadow-sm bg-green-50 dark:bg-green-900/20 inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter">{kpis.accepted} Ganadas</p>
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
                        <p className="text-xs font-bold text-orange-600 mt-2 italic shadow-sm bg-orange-50 dark:bg-orange-900/20 inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter">{kpis.opportunities} Oportunidades Pendientes</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <Card className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden">
                <TableToolbar
                    searchQuery={searchTerm}
                    onSearchChange={setSearchTerm}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabOptions={[
                        { key: "active", label: "Activas", count: activeQuotes.length },
                        { key: "trash", label: "Papelera", count: trashQuotes.length }
                    ]}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    onExportExcel={handleExportExcel}
                    onExportPDF={handleExportPDF}
                    placeholder="Buscar por folio o cliente..."
                >
                    <Button
                        onClick={() => {
                            setSelectedQuote(undefined);
                            setIsFormOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        <span className="font-bold text-xs">Nueva Propuesta</span>
                    </Button>
                </TableToolbar>

                <div className="relative overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500 font-medium">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 opacity-20" />
                            Sincronizando pipeline...
                        </div>
                    ) : (
                        <QuoteTable
                            quotes={pagedQuotes}
                            activeTab={activeTab}
                            onEdit={(q) => {
                                setSelectedQuote(q);
                                setIsFormOpen(true);
                            }}
                            onDuplicate={handleDuplicate}
                            onDelete={handleDelete}
                            onReactivate={handleReactivate}
                            onStatusChange={handleStatusChange}
                            onDownloadPDF={handleDownloadPDF}
                            onWhatsApp={handleWhatsApp}
                        />
                    )}
                </div>

                {/* Pagination Footer */}
                {!loading && filteredBySearch.length > 0 && (
                    <div className="p-4 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Mostrando {pagedQuotes.length} de {filteredBySearch.length} cotizaciones
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-500">
                                Página {currentPage} de {totalPages || 1}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            <QuoteForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                quote={selectedQuote}
                onSuccess={fetchData}
                initialOrganization={organization}
                initialClients={clients}
                initialProducts={products}
                initialNextFolio={nextFolio}
            />
        </div>
    );
}

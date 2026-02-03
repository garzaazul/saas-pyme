"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Package, TrendingUp, AlertCircle, Search, ChevronLeft, ChevronRight, Loader2, DollarSign, ExternalLink } from "lucide-react";
import { ProductTable } from "@/components/dashboard/products/product-table";
import { ProductForm } from "@/components/dashboard/products/product-form";
import { getProducts } from "@/app/actions/products";
import { getMyOrganization } from "@/app/actions/organizations";
import { Product } from "@/types/products";
import { Skeleton } from "@/components/ui/skeleton";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { toast } from "sonner";
import { format } from "date-fns";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function ProductsPage() {
    const [products, setProducts] = useState<(Product & { categories: { name: string } | null })[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
    const [searchTerm, setSearchTerm] = useState("");
    const [orgSlug, setOrgSlug] = useState<string | null>(null);

    // Navigation & Table Controls
    const [activeTab, setActiveTab] = useState("active");
    const [itemsPerPage, setItemsPerPage] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
            toast.error("Error al cargar los productos.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        // Fetch org slug for catalog link
        getMyOrganization().then(org => setOrgSlug(org.web_slug)).catch(() => { });
    }, [fetchProducts]);

    // Reset page when filtering or changing tabs
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab, itemsPerPage]);

    const handleFormSuccess = () => {
        setDialogOpen(false);
        setSelectedProduct(undefined);
        fetchProducts();
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    // Export Logic
    const handleExportExcel = () => {
        const columnMapping = {
            name: 'Nombre',
            category_name: 'Categoría',
            type: 'Tipo',
            base_price: 'Precio Base',
            current_stock: 'Stock',
            is_active: 'Estado'
        };

        const dataToExport = filteredBySearch.map(p => ({
            ...p,
            category_name: p.categories?.name || 'S/C',
            is_active: p.is_active ? 'Activo' : 'Inactivo',
            type: p.type === 'product' ? 'Producto' : 'Servicio'
        }));

        exportToExcel(dataToExport, `Productos_${activeTab === 'active' ? 'Activos' : 'Papelera'}`, columnMapping);
        toast.success("Excel generado correctamente");
    };

    const handleExportPDF = () => {
        const columns = [
            { header: 'Nombre', dataKey: 'name' },
            { header: 'Categoría', dataKey: 'category' },
            { header: 'Tipo', dataKey: 'type' },
            { header: 'Precio', dataKey: 'price' },
            { header: 'Stock', dataKey: 'stock' }
        ];

        const dataToExport = filteredBySearch.map(p => ({
            name: p.name,
            category: p.categories?.name || 'S/C',
            type: p.type === 'product' ? 'Prod' : 'Serv',
            price: new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(p.base_price),
            stock: p.current_stock
        }));

        exportToPDF(
            `Reporte de Catálogo - ${activeTab === 'active' ? 'Activos' : 'Papelera'}`,
            dataToExport,
            columns
        );
        toast.success("PDF generado correctamente");
    };

    // Filtering Logic
    const activeProducts = products.filter(p => p.is_active);
    const trashProducts = products.filter(p => !p.is_active);

    const filteredByTab = activeTab === "active" ? activeProducts : trashProducts;

    const filteredBySearch = filteredByTab.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBySearch.length / Number(itemsPerPage));
    const pagedProducts = filteredBySearch.slice(
        (currentPage - 1) * Number(itemsPerPage),
        currentPage * Number(itemsPerPage)
    );

    const kpis = {
        totalItems: activeProducts.length,
        lowStock: activeProducts.filter(p => p.type === 'product' && p.current_stock <= p.min_stock_alert).length,
        inventoryValue: activeProducts.reduce((acc, p) => acc + (p.base_price * p.current_stock), 0)
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Catálogo de Productos
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Gestione su inventario de productos y servicios con control de stock y alertas.
                    </p>
                </div>
                {orgSlug && (
                    <Button
                        variant="outline"
                        onClick={() => window.open(`/catalogo/${orgSlug}`, "_blank")}
                        className="rounded-xl font-bold gap-2 border-primary/20 text-primary hover:bg-primary/5 hidden md:flex"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Ver Catálogo Público
                    </Button>
                )}
            </div>

            {/* KPI Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Items Activos
                        </CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none text-gray-900 dark:text-white">
                            {loading ? <Skeleton className="h-7 w-12" /> : kpis.totalItems}
                        </div>
                        <p className="text-xs font-bold text-blue-600 mt-2 italic shadow-sm bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter">En catálogo</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Valorización Inventario
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none text-gray-900 dark:text-white">
                            {loading ? <Skeleton className="h-7 w-32" /> : `$${kpis.inventoryValue.toLocaleString("es-CL")}`}
                        </div>
                        <p className="text-xs font-bold text-emerald-600 mt-2 italic shadow-sm bg-emerald-50 dark:bg-emerald-900/20 inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter">Costo Reposición</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Bajo Stock Critico
                        </CardTitle>
                        <AlertCircle className={`h-4 w-4 ${kpis.lowStock > 0 ? "text-red-500 animate-pulse" : "text-gray-300"}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-black tracking-tight leading-none ${kpis.lowStock > 0 ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
                            {loading ? <Skeleton className="h-7 w-12" /> : kpis.lowStock}
                        </div>
                        <p className={`text-xs font-bold mt-2 italic shadow-sm inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter ${kpis.lowStock > 0 ? "text-red-600 bg-red-50 dark:bg-red-900/20" : "text-gray-400 bg-gray-50 dark:bg-slate-800"}`}>
                            {kpis.lowStock > 0 ? "Requiere Atención" : "Niveles Saludables"}
                        </p>
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
                        { key: "active", label: "Activos", count: activeProducts.length },
                        { key: "trash", label: "Papelera", count: trashProducts.length }
                    ]}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    onExportExcel={handleExportExcel}
                    onExportPDF={handleExportPDF}
                    placeholder="Buscar productos o servicios..."
                >
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => setSelectedProduct(undefined)}
                                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="font-bold text-xs">Nuevo Item</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold tracking-tight">
                                    {selectedProduct ? "Editar Item" : "Crear Nuevo Item en Catálogo"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                                <ProductForm
                                    open={dialogOpen}
                                    onOpenChange={setDialogOpen}
                                    product={selectedProduct}
                                    onSuccess={handleFormSuccess}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </TableToolbar>

                <div className="relative overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500 font-medium">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 opacity-20" />
                            Sincronizando catálogo...
                        </div>
                    ) : (
                        <ProductTable
                            products={pagedProducts}
                            activeTab={activeTab}
                            onEdit={handleEdit}
                            onRefresh={fetchProducts}
                        />
                    )}
                </div>

                {/* Pagination Footer */}
                {!loading && filteredBySearch.length > 0 && (
                    <div className="p-4 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Mostrando {pagedProducts.length} de {filteredBySearch.length} items
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

            <ProductForm
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={selectedProduct}
                onSuccess={fetchProducts}
            />
        </div>
    );
}

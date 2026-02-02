"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Tag, Search, TrendingUp, Package, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryTable } from "@/components/dashboard/categories/category-table";
import { CategoryForm } from "@/components/dashboard/categories/category-form";
import { Category } from "@/types/categories";
import { getCategories } from "@/app/actions/categories";
import { Skeleton } from "@/components/ui/skeleton";
import { TableToolbar } from "@/components/dashboard/TableToolbar";
import { toast } from "sonner";
import { format } from "date-fns";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
    const [searchTerm, setSearchTerm] = useState("");

    // Navigation & Table Controls
    const [activeTab, setActiveTab] = useState("active");
    const [itemsPerPage, setItemsPerPage] = useState("10");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error loading categories:", error);
            toast.error("Error al cargar las categorías.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Reset page when filtering or changing tabs
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab, itemsPerPage]);

    const handleFormSuccess = () => {
        setDialogOpen(false);
        setSelectedCategory(undefined);
        fetchCategories();
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedCategory(undefined);
        setDialogOpen(true);
    };

    // Export Logic
    const handleExportExcel = () => {
        const columnMapping = {
            name: 'Nombre',
            description: 'Descripción',
            target_type: 'Tipo',
            is_active: 'Estado',
            created_at: 'Fecha Creación'
        };

        const dataToExport = filteredBySearch.map(cat => ({
            ...cat,
            is_active: cat.is_active ? 'Activo' : 'Inactivo',
            created_at: format(new Date(cat.created_at), 'dd/MM/yyyy HH:mm'),
            target_type: cat.target_type === 'ambos' ? 'Ambos' : (cat.target_type === 'producto' ? 'Producto' : 'Servicio')
        }));

        exportToExcel(dataToExport, `Categorias_${activeTab === 'active' ? 'Activas' : 'Papelera'}`, columnMapping);
        toast.success("Excel generado correctamente");
    };

    const handleExportPDF = () => {
        const columns = [
            { header: 'Nombre', dataKey: 'name' },
            { header: 'Tipo', dataKey: 'target_type' },
            { header: 'Estado', dataKey: 'status' },
            { header: 'Creado', dataKey: 'date' }
        ];

        const dataToExport = filteredBySearch.map(cat => ({
            name: cat.name,
            target_type: cat.target_type,
            status: cat.is_active ? 'Activo' : 'Inactivo',
            date: format(new Date(cat.created_at), 'dd/MM/yyyy')
        }));

        exportToPDF(
            `Reporte de Categorías - ${activeTab === 'active' ? 'Activas' : 'Papelera'}`,
            dataToExport,
            columns
        );
        toast.success("PDF generado correctamente");
    };

    // Data Filtering & Logic
    const activeCategoriesCount = categories.filter(c => c.is_active).length;
    const trashCategoriesCount = categories.filter(c => !c.is_active).length;

    const filteredByTab = categories.filter(cat =>
        activeTab === "active" ? cat.is_active : !cat.is_active
    );

    const filteredBySearch = filteredByTab.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBySearch.length / Number(itemsPerPage));
    const pagedCategories = filteredBySearch.slice(
        (currentPage - 1) * Number(itemsPerPage),
        currentPage * Number(itemsPerPage)
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Categorías
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Administre las categorías para organizar sus productos, servicios y reportes financieros.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Total Categorías
                        </CardTitle>
                        <Tag className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none">
                            {categories.length}
                        </div>
                        <p className="text-xs font-bold text-blue-600 mt-2 italic shadow-sm bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter">Listado maestro</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Categorías Activas
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none text-green-600">
                            {activeCategoriesCount}
                        </div>
                        <p className="text-xs font-bold text-green-600 mt-2 italic shadow-sm bg-green-50 dark:bg-green-900/20 inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter">En uso</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Table */}
            <Card className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden">
                <TableToolbar
                    searchQuery={searchTerm}
                    onSearchChange={setSearchTerm}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabOptions={[
                        { key: "active", label: "Activas", count: activeCategoriesCount },
                        { key: "trash", label: "Papelera", count: trashCategoriesCount }
                    ]}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    onExportExcel={handleExportExcel}
                    onExportPDF={handleExportPDF}
                    placeholder="Buscar categorías..."
                >
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2">
                                <Plus className="w-4 h-4" />
                                <span className="font-bold">Nueva Categoría</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold tracking-tight">
                                    {selectedCategory ? "Editar Categoría" : "Agregar Nueva Categoría"}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="mt-6">
                                <CategoryForm
                                    open={dialogOpen}
                                    onOpenChange={setDialogOpen}
                                    category={selectedCategory}
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
                            Cargando categorías...
                        </div>
                    ) : (
                        <CategoryTable
                            categories={pagedCategories}
                            totalCount={filteredBySearch.length}
                            activeTab={activeTab}
                            onEdit={handleEdit}
                            onRefresh={fetchCategories}
                        />
                    )}
                </div>

                {/* Pagination Footer */}
                {!loading && filteredBySearch.length > 0 && (
                    <div className="p-4 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Mostrando {pagedCategories.length} de {filteredBySearch.length} categorías
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
        </div>
    );
}

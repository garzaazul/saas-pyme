"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Package, Wrench, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { ProductTable } from "@/components/dashboard/products/product-table";
import { ProductForm } from "@/components/dashboard/products/product-form";
import { getProducts } from "@/app/actions/products";
import { Product } from "@/types/products";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
    const [search, setSearch] = useState("");

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(undefined);
        setDialogOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.categories?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const kpis = {
        totalProducts: products.filter(p => p.type === 'product').length,
        totalServices: products.filter(p => p.type === 'service').length,
        noStock: products.filter(p => p.type === 'product' && p.stock_quantity <= 0).length
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Catálogo de Soluciones
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Gestiona tus productos y servicios con inteligencia.
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-11 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-bold">Nuevo Item</span>
                </Button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Total Productos
                        </CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none">
                            {loading ? <Skeleton className="h-7 w-12" /> : kpis.totalProducts}
                        </div>
                        <p className="text-xs font-bold text-blue-600 mt-2 italic shadow-sm bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-0.5 rounded-full">Activos en inventario</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Total Servicios
                        </CardTitle>
                        <Wrench className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none">
                            {loading ? <Skeleton className="h-7 w-12" /> : kpis.totalServices}
                        </div>
                        <p className="text-xs font-bold text-purple-600 mt-2 italic shadow-sm bg-purple-50 dark:bg-purple-900/20 inline-block px-2 py-0.5 rounded-full">Soluciones integrales</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Sin Stock (Crítico)
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={cn(
                            "text-2xl font-black tracking-tight leading-none",
                            kpis.noStock > 0 ? "text-red-600" : "text-gray-900"
                        )}>
                            {loading ? <Skeleton className="h-7 w-12" /> : kpis.noStock}
                        </div>
                        <p className="text-xs font-bold text-red-600 mt-2 italic shadow-sm bg-red-50 dark:bg-red-900/20 inline-block px-2 py-0.5 rounded-full">Requiere atención</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar en catálogo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 rounded-xl bg-white dark:bg-slate-900 border-none premium-shadow h-11"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full rounded-xl" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                    </div>
                ) : (
                    <ProductTable
                        products={filteredProducts}
                        onEdit={handleEdit}
                        onRefresh={fetchProducts}
                    />
                )}
            </div>

            <ProductForm
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={selectedProduct}
                onSuccess={fetchProducts}
            />
        </div>
    );
}

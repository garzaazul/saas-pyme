"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryTable } from "@/components/dashboard/categories/category-table";
import { CategoryForm } from "@/components/dashboard/categories/category-form";
import { Category } from "@/types/categories";
import { getCategories } from "@/app/actions/categories";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error loading categories:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setFormOpen(true);
    };

    const handleCreate = () => {
        setSelectedCategory(undefined);
        setFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
                    <p className="text-muted-foreground">
                        Administre las categorías para organizar sus productos, servicios y reportes financieros.
                    </p>
                </div>
                <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 gap-2 h-11 px-6 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                    <Plus className="w-5 h-5" />
                    Nueva Categoría
                </Button>
            </div>

            <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Tag className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Gestión de Inventario</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">Listado Maestro</CardTitle>
                    <CardDescription>
                        Todas las categorías registradas para su organización.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-20 w-full rounded-lg" />
                            <Skeleton className="h-20 w-full rounded-lg" />
                        </div>
                    ) : (
                        <CategoryTable
                            categories={categories}
                            onEdit={handleEdit}
                            onRefresh={fetchCategories}
                        />
                    )}
                </CardContent>
            </Card>

            <CategoryForm
                open={formOpen}
                onOpenChange={setFormOpen}
                category={selectedCategory}
                onSuccess={fetchCategories}
            />
        </div>
    );
}

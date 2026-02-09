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
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ExternalLink, Trash2, RotateCcw, Package, Wrench, Search, Image as ImageIcon, Loader2 } from "lucide-react";
import { Product } from "@/types/products";
import { softDeleteProduct, reactivateProduct } from "@/app/actions/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductTableProps {
    products: (Product & { categories: { name: string } | null })[];
    activeTab: string;
    onEdit: (product: Product) => void;
    onRefresh: () => void;
}

function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function ProductTable({ products, activeTab, onEdit, onRefresh }: ProductTableProps) {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleSoftDelete = async (id: string) => {
        if (!confirm("¿Está seguro de desactivar este item del catálogo?")) return;

        setActionLoading(id);
        try {
            const res = await softDeleteProduct(id);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Item movido a la papelera");
                onRefresh();
            }
        } catch (error) {
            toast.error("Error al desactivar");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReactivate = async (id: string) => {
        setActionLoading(id);
        try {
            const res = await reactivateProduct(id);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Item reactivado");
                onRefresh();
            }
        } catch (error) {
            toast.error("Error al reactivar");
        } finally {
            setActionLoading(null);
        }
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 font-medium">
                <div className="bg-gray-50 dark:bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 opacity-20" />
                </div>
                {activeTab === "active" ? "No se encontraron productos activos." : "Papelera de productos vacía."}
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                    <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400">ITEM</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CATEGORÍA</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">PRECIO</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">STOCK / TIPO</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">ESTADO</TableHead>
                    <TableHead className="pr-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">ACCIONES</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800 transition-colors">
                        <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                                    {product.image_urls?.[0] ? (
                                        <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-4 h-4 text-gray-300" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                        {product.name}
                                    </span>
                                    {product.image_urls.length > 1 && (
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">
                                            +{product.image_urls.length - 1} fotos
                                        </span>
                                    )}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {(product as any).product_categories?.length > 0 ? (
                                    (product as any).product_categories.map((pc: any, idx: number) => (
                                        <Badge
                                            key={idx}
                                            variant="outline"
                                            className="text-[9px] font-bold uppercase tracking-tight bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-500 py-0 px-1.5"
                                        >
                                            {pc.categories?.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-gray-400 font-bold text-[10px] italic">Sin categorías</span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell className="font-black text-primary italic">
                            {formatCLP(product.base_price)}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight w-fit",
                                    product.type === "service"
                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                )}>
                                    {product.type === "service" ? <Wrench className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                                    {product.type.toUpperCase()}
                                </div>
                                {product.type === "product" && (
                                    <span className={cn(
                                        "text-[10px] font-bold italic pl-1",
                                        product.current_stock <= 0 ? "text-red-500" : "text-gray-400"
                                    )}>
                                        Stock: {product.current_stock}
                                    </span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                                className={cn(
                                    "rounded-full px-3 py-0.5 text-[9px] font-black tracking-widest border-none items-center flex w-fit",
                                    product.is_active
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-400"
                                )}
                            >
                                <div className={cn("w-1 h-1 rounded-full mr-1.5", product.is_active ? "bg-green-500" : "bg-gray-400")} />
                                {product.is_active ? "ACTIVO" : "INACTIVO"}
                            </Badge>
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                            {actionLoading === product.id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400 ml-auto" />
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl premium-shadow border-none overflow-hidden p-1 min-w-[160px]">
                                        <DropdownMenuItem
                                            onSelect={() => onEdit(product)}
                                            className="rounded-lg font-bold text-xs py-2 focus:bg-primary/5 focus:text-primary cursor-pointer gap-2"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Editar
                                        </DropdownMenuItem>
                                        <div className="h-px bg-gray-100 dark:bg-slate-800 my-1" />
                                        {product.is_active ? (
                                            <DropdownMenuItem
                                                onSelect={() => handleSoftDelete(product.id)}
                                                className="rounded-lg font-bold text-xs py-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer gap-2"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Mover a Papelera
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onSelect={() => handleReactivate(product.id)}
                                                className="rounded-lg font-bold text-xs py-2 text-green-600 focus:bg-green-50 focus:text-green-700 cursor-pointer gap-2"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                Reactivar Item
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

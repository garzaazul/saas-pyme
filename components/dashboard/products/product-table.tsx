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
import { MoreVertical, Pencil, Trash, Package, Wrench, ImageIcon } from "lucide-react";
import { Product } from "@/types/products";
import { deleteProduct } from "@/app/actions/products";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductTableProps {
    products: (Product & { categories: { name: string } | null })[];
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

export function ProductTable({ products, onEdit, onRefresh }: ProductTableProps) {
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este item permanentemente?")) return;
        setDeleting(id);
        try {
            const res = await deleteProduct(id);
            if (res.error) toast.error(res.error);
            else {
                toast.success("Item eliminado");
                onRefresh();
            }
        } catch (error) {
            toast.error("Error al eliminar");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
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
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-gray-400 font-medium italic">
                                No se encontraron productos o servicios
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800 transition-colors">
                                <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                                            {product.image_urls?.[0] ? (
                                                <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-4 h-4 text-gray-300" />
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
                                    <span className="text-gray-500 font-bold text-xs">
                                        {product.categories?.name || "Sin categoría"}
                                    </span>
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl premium-shadow border-none overflow-hidden p-1 min-w-[120px]">
                                            <DropdownMenuItem
                                                onClick={() => onEdit(product)}
                                                className="rounded-lg font-bold text-xs py-2 focus:bg-primary/5 focus:text-primary cursor-pointer gap-2"
                                            >
                                                <Pencil className="w-3 h-3" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deleting === product.id}
                                                className="rounded-lg font-bold text-xs py-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer gap-2"
                                            >
                                                <Trash className="w-3 h-3" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

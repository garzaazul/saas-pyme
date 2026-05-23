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
import { MoreVertical, ExternalLink, Trash2, RotateCcw, Search, Loader2 } from "lucide-react";
import { Category } from "@/types/categories";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { softDeleteCategory, reactivateCategory } from "@/app/actions/categories";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface CategoryTableProps {
    categories: Category[];
    totalCount: number;
    activeTab: string;
    onEdit: (category: Category) => void;
    onRefresh: () => void;
}

export function CategoryTable({ categories, totalCount, activeTab, onEdit, onRefresh }: CategoryTableProps) {
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSoftDelete = async () => {
        if (!pendingDeleteId) return;
        setIsDeleting(true);
        try {
            const res = await softDeleteCategory(pendingDeleteId);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Categoría desactivada");
                onRefresh();
            }
        } catch {
            toast.error("Error al desactivar");
        } finally {
            setIsDeleting(false);
            setConfirmOpen(false);
            setPendingDeleteId(null);
        }
    };

    const requestDelete = (id: string) => {
        setPendingDeleteId(id);
        setConfirmOpen(true);
    };

    const handleReactivate = async (id: string) => {
        setActionLoading(id);
        try {
            const res = await reactivateCategory(id);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Categoría reactivada");
                onRefresh();
            }
        } catch (error) {
            toast.error("Error al reactivar");
        } finally {
            setActionLoading(null);
        }
    };

    if (categories.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 font-medium">
                <div className="bg-gray-50 dark:bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 opacity-20" />
                </div>
                {activeTab === "active" ? "No se encontraron categorías activas." : "Papelera vacía."}
            </div>
        );
    }

    return (
        <>
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                    <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400">NOMBRE</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">APLICA A</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">ESTADO</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CREADO EL</TableHead>
                    <TableHead className="pr-6"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800">
                        <TableCell className="pl-6 py-4">
                            <div>
                                <p className="font-black text-gray-900 dark:text-gray-100 leading-tight">
                                    {category.name}
                                </p>
                                {category.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 truncate max-w-[300px]">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="capitalize text-xs font-bold bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400 inline-block">
                                {category.target_type === 'ambos' ? 'Productos y Servicios' : category.target_type + 's'}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant="secondary"
                                className={category.is_active
                                    ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-none font-bold text-[10px] py-0.5 rounded-full uppercase italic"
                                    : "bg-gray-50 dark:bg-slate-800 text-gray-500 border-none font-bold text-[10px] py-0.5 rounded-full uppercase italic"
                                }
                            >
                                {category.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {format(new Date(category.created_at), "d 'de' MMM, yyyy", { locale: es })}
                        </TableCell>
                        <TableCell className="pr-6 text-right">
                            {actionLoading === category.id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400 ml-auto" />
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl premium-shadow border-none overflow-hidden p-1 w-48">
                                        <DropdownMenuItem
                                            onSelect={() => onEdit(category)}
                                            className="rounded-lg font-bold text-xs py-2 text-gray-600 dark:text-gray-300 focus:bg-gray-50 dark:focus:bg-slate-800 cursor-pointer gap-2"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Editar Categoría
                                        </DropdownMenuItem>
                                        <div className="h-px bg-gray-100 dark:bg-slate-800 my-1" />
                                        {category.is_active ? (
                                            <DropdownMenuItem
                                                onSelect={() => requestDelete(category.id)}
                                                className="rounded-lg font-bold text-xs py-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer gap-2"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Desactivar
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                                onSelect={() => handleReactivate(category.id)}
                                                className="rounded-lg font-bold text-xs py-2 text-green-600 focus:bg-green-50 focus:text-green-700 cursor-pointer gap-2"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                Reactivar
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

        <ConfirmDialog
            open={confirmOpen}
            onOpenChange={(open) => {
                setConfirmOpen(open);
                if (!open) setPendingDeleteId(null);
            }}
            title="¿Desactivar categoría?"
            description="Esta categoría quedará inactiva. Los productos que la usan no se verán afectados, pero no podrás asignarla a nuevos items."
            confirmLabel="Desactivar"
            onConfirm={handleSoftDelete}
            isLoading={isDeleting}
        />
        </>
    );
}

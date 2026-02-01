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
import { MoreHorizontal, Pencil, Trash, FileSpreadsheet, FileText } from "lucide-react";
import { Category } from "@/types/categories";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { deleteCategory } from "@/app/actions/categories";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onRefresh: () => void;
}

export function CategoryTable({ categories, onEdit, onRefresh }: CategoryTableProps) {
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar esta categoría?")) return;

        setDeleting(id);
        try {
            const res = await deleteCategory(id);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Categoría eliminada");
                onRefresh();
            }
        } catch (error) {
            toast.error("Error al eliminar");
        } finally {
            setDeleting(null);
        }
    };

    const handleExportExcel = () => {
        const columnMapping = {
            name: 'Nombre',
            description: 'Descripción',
            target_type: 'Tipo',
            is_active: 'Estado',
            created_at: 'Fecha Creación'
        };

        const dataToExport = categories.map(cat => ({
            ...cat,
            is_active: cat.is_active ? 'Activo' : 'Inactivo',
            created_at: format(new Date(cat.created_at), 'dd/MM/yyyy HH:mm'),
            target_type: cat.target_type === 'ambos' ? 'Ambos' : (cat.target_type === 'producto' ? 'Producto' : 'Servicio')
        }));

        exportToExcel(dataToExport, 'categorías-sistema', columnMapping);
    };

    const handleExportPDF = () => {
        const columns = [
            { header: 'Nombre', dataKey: 'name' },
            { header: 'Tipo', dataKey: 'target_type' },
            { header: 'Estado', dataKey: 'status' },
            { header: 'Creado', dataKey: 'date' }
        ];

        const dataToExport = categories.map(cat => ({
            name: cat.name,
            target_type: cat.target_type,
            status: cat.is_active ? 'Activo' : 'Inactivo',
            date: format(new Date(cat.created_at), 'dd/MM/yyyy')
        }));

        exportToPDF('Listado de Categorías', dataToExport, columns, 'SaaS Pyme Operativo');
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-9 gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Excel
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportPDF} className="h-9 gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    PDF
                </Button>
            </div>

            <div className="border rounded-xl bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-bold">Nombre</TableHead>
                            <TableHead className="font-bold">Aplica a</TableHead>
                            <TableHead className="font-bold">Estado</TableHead>
                            <TableHead className="font-bold">Creado el</TableHead>
                            <TableHead className="w-[100px] text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No se encontraron categorías
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">
                                        <div>
                                            {category.name}
                                            {category.description && (
                                                <p className="text-xs text-muted-foreground font-normal mt-0.5">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="capitalize text-xs">
                                            {category.target_type === 'ambos' ? 'Productos y Servicios' : category.target_type + 's'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={category.is_active
                                                ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200"
                                            }
                                        >
                                            {category.is_active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(category.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px] rounded-lg">
                                                <DropdownMenuItem onClick={() => onEdit(category)} className="gap-2 cursor-pointer">
                                                    <Pencil className="w-4 h-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(category.id)}
                                                    className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                                    disabled={deleting === category.id}
                                                >
                                                    <Trash className="w-4 h-4" />
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
        </div>
    );
}

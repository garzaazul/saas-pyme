"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Package, Wrench, MoreVertical, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(amount);
}

type ProductType = "product" | "service";

interface Product {
    id: string;
    name: string;
    type: ProductType;
    price: number;
    stock?: number;
    category: string;
    active: boolean;
}

const mockProducts: Product[] = [
    {
        id: "1",
        name: "Consultoría Estratégica",
        type: "service",
        price: 500000,
        category: "Servicios Profesionales",
        active: true,
    },
    {
        id: "2",
        name: "Laptop Dell XPS 15",
        type: "product",
        price: 1800000,
        stock: 5,
        category: "Equipos",
        active: true,
    },
    {
        id: "3",
        name: "Soporte Técnico Mensual",
        type: "service",
        price: 150000,
        category: "Soporte",
        active: true,
    },
    {
        id: "4",
        name: "Monitor 27 pulgadas",
        type: "product",
        price: 350000,
        stock: 12,
        category: "Equipos",
        active: true,
    },
    {
        id: "5",
        name: "Licencia Software Anual",
        type: "product",
        price: 250000,
        stock: 0,
        category: "Software",
        active: false,
    },
];

export default function ProductsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [productType, setProductType] = useState<ProductType>("product");
    const [filter, setFilter] = useState<"all" | "product" | "service">("all");

    const filteredProducts =
        filter === "all"
            ? mockProducts
            : mockProducts.filter((p) => p.type === filter);

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Productos y Servicios
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Gestiona tu inventario y catálogo de soluciones.
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2">
                            <Plus className="w-4 h-4" />
                            <span className="font-bold">Nuevo Item</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight">Agregar Nuevo Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-6">
                            {/* Type Toggle */}
                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                                <Button
                                    variant="ghost"
                                    onClick={() => setProductType("product")}
                                    className={cn(
                                        "rounded-lg font-bold transition-all h-10",
                                        productType === "product" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-gray-500"
                                    )}
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    Producto
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setProductType("service")}
                                    className={cn(
                                        "rounded-lg font-bold transition-all h-10",
                                        productType === "service" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-gray-500"
                                    )}
                                >
                                    <Wrench className="w-4 h-4 mr-2" />
                                    Servicio
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Nombre</label>
                                <Input placeholder="Ej: Laptop Dell XPS 15" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Categoría</label>
                                <Select>
                                    <SelectTrigger className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11">
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="equipment">Equipos</SelectItem>
                                        <SelectItem value="software">Software</SelectItem>
                                        <SelectItem value="services">Servicios Profesionales</SelectItem>
                                        <SelectItem value="support">Soporte</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Precio CLP</label>
                                    <Input type="number" placeholder="0" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11 font-black" />
                                </div>
                                {productType === "product" && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Stock Inicial</label>
                                        <Input type="number" placeholder="0" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11 font-black" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <span className="text-sm font-bold uppercase tracking-wide">Visibilidad en Catálogo</span>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <Button variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl font-bold">
                                    Cancelar
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold px-8">
                                    Guardar Item
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
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
                            {mockProducts.filter((p) => p.type === "product").length}
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
                            {mockProducts.filter((p) => p.type === "service").length}
                        </div>
                        <p className="text-xs font-bold text-purple-600 mt-2 italic shadow-sm bg-purple-50 dark:bg-purple-900/20 inline-block px-2 py-0.5 rounded-full">Soluciones intangibles</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Sin Stock (Critico)
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight text-red-600 leading-none">
                            {mockProducts.filter((p) => p.type === "product" && p.stock === 0).length}
                        </div>
                        <p className="text-xs font-bold text-red-600 mt-2 italic shadow-sm bg-red-50 dark:bg-red-900/20 inline-block px-2 py-0.5 rounded-full">Requiere reposición</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Table */}
            <Card className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden">
                <div className="p-6 pb-2 border-b border-gray-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl w-fit">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilter("all")}
                            className={cn(
                                "rounded-lg font-bold text-xs h-8 px-4",
                                filter === "all" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-gray-500"
                            )}
                        >
                            Todos
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilter("product")}
                            className={cn(
                                "rounded-lg font-bold text-xs h-8 px-4",
                                filter === "product" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-gray-500"
                            )}
                        >
                            <Package className="w-3 h-3 mr-1" />
                            Productos
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilter("service")}
                            className={cn(
                                "rounded-lg font-bold text-xs h-8 px-4",
                                filter === "service" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-gray-500"
                            )}
                        >
                            <Wrench className="w-3 h-3 mr-1" />
                            Servicios
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Filtrar catálogo..." className="pl-10 rounded-xl bg-gray-50 dark:bg-slate-800 border-none w-full md:w-80" />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                            <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400">NOMBRE</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">TIPO</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CATEGORÍA</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">PRECIO</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">STOCK</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">ESTADO</TableHead>
                            <TableHead className="pr-6"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800">
                                <TableCell className="pl-6 font-bold text-gray-900 dark:text-gray-100">
                                    {product.name}
                                </TableCell>
                                <TableCell>
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight",
                                        product.type === "service"
                                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    )}>
                                        {product.type === "service" ? <Wrench className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                                        {product.type.toUpperCase()}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-500 font-medium text-xs">{product.category}</TableCell>
                                <TableCell className="font-black text-primary italic">{formatCLP(product.price)}</TableCell>
                                <TableCell>
                                    {product.type === "product" ? (
                                        product.stock === 0 ? (
                                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 border-none font-black text-[9px] px-2 py-0">SIN STOCK</Badge>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 italic">{product.stock} un.</span>
                                        )
                                    ) : (
                                        <span className="text-xs text-gray-300 font-black tracking-widest">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={cn(
                                            "rounded-full px-3 py-0.5 text-[9px] font-black tracking-widest border-none",
                                            product.active
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-400"
                                        )}
                                    >
                                        {product.active ? "✓ ACTIVO" : "○ INACTIVO"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="pr-6 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl premium-shadow border-none overflow-hidden p-1">
                                            <DropdownMenuItem className="rounded-lg font-bold text-xs py-2 focus:bg-primary/5 focus:text-primary cursor-pointer">Editar</DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-lg font-bold text-xs py-2 focus:bg-primary/5 focus:text-primary cursor-pointer">Duplicar</DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-lg font-bold text-xs py-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer">
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

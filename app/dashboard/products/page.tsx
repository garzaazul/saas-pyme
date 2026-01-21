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
import { Plus, Search, Package, Wrench, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                    <p className="text-gray-500">
                        Catálogo de productos y servicios
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Producto
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Agregar Producto o Servicio</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            {/* Type Toggle */}
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={productType === "product" ? "default" : "outline"}
                                    onClick={() => setProductType("product")}
                                    className={productType === "product" ? "bg-blue-600" : ""}
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    Producto
                                </Button>
                                <Button
                                    variant={productType === "service" ? "default" : "outline"}
                                    onClick={() => setProductType("service")}
                                    className={productType === "service" ? "bg-blue-600" : ""}
                                >
                                    <Wrench className="w-4 h-4 mr-2" />
                                    Servicio
                                </Button>
                            </div>

                            <Input placeholder="Nombre del producto" />
                            <Input placeholder="Descripción (opcional)" />

                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="equipment">Equipos</SelectItem>
                                    <SelectItem value="software">Software</SelectItem>
                                    <SelectItem value="services">Servicios Profesionales</SelectItem>
                                    <SelectItem value="support">Soporte</SelectItem>
                                    <SelectItem value="other">Otros</SelectItem>
                                </SelectContent>
                            </Select>

                            <Input type="number" placeholder="Precio (CLP)" />

                            {productType === "product" && (
                                <Input type="number" placeholder="Stock inicial" />
                            )}

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium">Activo</span>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Total Productos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockProducts.filter((p) => p.type === "product").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Total Servicios
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {mockProducts.filter((p) => p.type === "service").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Sin Stock
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {mockProducts.filter((p) => p.type === "product" && p.stock === 0).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("all")}
                        className={filter === "all" ? "bg-blue-600" : ""}
                    >
                        Todos
                    </Button>
                    <Button
                        variant={filter === "product" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("product")}
                        className={filter === "product" ? "bg-blue-600" : ""}
                    >
                        <Package className="w-4 h-4 mr-1" />
                        Productos
                    </Button>
                    <Button
                        variant={filter === "service" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("service")}
                        className={filter === "service" ? "bg-blue-600" : ""}
                    >
                        <Wrench className="w-4 h-4 mr-1" />
                        Servicios
                    </Button>
                </div>
                <div className="flex-1" />
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar productos..." className="pl-10 w-64" />
                </div>
            </div>

            {/* Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>NOMBRE</TableHead>
                            <TableHead>TIPO</TableHead>
                            <TableHead>CATEGORÍA</TableHead>
                            <TableHead>PRECIO</TableHead>
                            <TableHead>STOCK</TableHead>
                            <TableHead>ESTADO</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            product.type === "service"
                                                ? "border-purple-200 text-purple-700"
                                                : "border-blue-200 text-blue-700"
                                        }
                                    >
                                        {product.type === "service" ? (
                                            <>
                                                <Wrench className="w-3 h-3 mr-1" />
                                                Servicio
                                            </>
                                        ) : (
                                            <>
                                                <Package className="w-3 h-3 mr-1" />
                                                Producto
                                            </>
                                        )}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-500">{product.category}</TableCell>
                                <TableCell>{formatCLP(product.price)}</TableCell>
                                <TableCell>
                                    {product.type === "product" ? (
                                        product.stock === 0 ? (
                                            <Badge variant="destructive">Sin stock</Badge>
                                        ) : (
                                            <span>{product.stock} unidades</span>
                                        )
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={product.active ? "default" : "secondary"}
                                        className={product.active ? "bg-green-100 text-green-700" : ""}
                                    >
                                        {product.active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Editar</DropdownMenuItem>
                                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
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

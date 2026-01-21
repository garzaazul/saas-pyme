"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Mail, Phone, Building2, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Client {
    id: string;
    name: string;
    rut: string;
    email: string;
    phone: string;
    address: string;
    initials: string;
}

const mockClients: Client[] = [
    {
        id: "1",
        name: "Tech Solutions S.A.",
        rut: "76.123.456-7",
        email: "contacto@techsolutions.cl",
        phone: "+56 9 1234 5678",
        address: "Av. Providencia 1234, Santiago",
        initials: "TS",
    },
    {
        id: "2",
        name: "Global Corp",
        rut: "76.234.567-8",
        email: "info@globalcorp.cl",
        phone: "+56 9 2345 6789",
        address: "Las Condes 5678, Santiago",
        initials: "GC",
    },
    {
        id: "3",
        name: "Acme Inc.",
        rut: "76.345.678-9",
        email: "ventas@acme.cl",
        phone: "+56 9 3456 7890",
        address: "Vitacura 9012, Santiago",
        initials: "AI",
    },
    {
        id: "4",
        name: "Nexus Logistics",
        rut: "76.456.789-0",
        email: "operaciones@nexus.cl",
        phone: "+56 9 4567 8901",
        address: "Quilicura 3456, Santiago",
        initials: "NL",
    },
];

export default function ClientsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
                    <p className="text-gray-500">Gestiona tu cartera de clientes</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Cliente
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Agregar Cliente</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <Input placeholder="Razón Social / Nombre" />
                            <Input placeholder="RUT" />
                            <Input type="email" placeholder="Email" />
                            <Input placeholder="Teléfono" />
                            <Input placeholder="Dirección" />
                            <Input placeholder="Giro (opcional)" />
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
                            Total Clientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockClients.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Clientes Activos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {mockClients.length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Nuevos este Mes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="Buscar por nombre o RUT..." className="pl-10" />
                </div>
            </div>

            {/* Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>CLIENTE</TableHead>
                            <TableHead>RUT</TableHead>
                            <TableHead>CONTACTO</TableHead>
                            <TableHead>DIRECCIÓN</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockClients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9">
                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                                {client.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{client.name}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-500">{client.rut}</TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Mail className="w-3 h-3" />
                                            {client.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Phone className="w-3 h-3" />
                                            {client.phone}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Building2 className="w-3 h-3" />
                                        {client.address}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Ver Detalle</DropdownMenuItem>
                                            <DropdownMenuItem>Editar</DropdownMenuItem>
                                            <DropdownMenuItem>Ver Cotizaciones</DropdownMenuItem>
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

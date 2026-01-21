"use client";

import { useState, useEffect } from "react";
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
import { Plus, Search, Mail, Phone, Building2, MoreVertical, TrendingUp, Users, ExternalLink, FileText } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getClients, getClientsCount, getNewClientsThisMonth, type Client } from "@/app/actions/clients";

export default function ClientsPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [totalClients, setTotalClients] = useState(0);
    const [newClientsThisMonth, setNewClientsThisMonth] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [data, count, newCount] = await Promise.all([
                    getClients(),
                    getClientsCount(),
                    getNewClientsThisMonth()
                ]);
                setClients(data);
                setTotalClients(count);
                setNewClientsThisMonth(newCount);
            } catch (error) {
                console.error("Error loading clients data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredClients = clients.filter(client =>
        client.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                        Clientes
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Gestiona tu cartera de clientes y relaciones comerciales.
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-10 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 gap-2">
                            <Plus className="w-4 h-4" />
                            <span className="font-bold">Nuevo Cliente</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight">Agregar Nuevo Cliente</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Razón Social</label>
                                <Input placeholder="Ej: Tech Solutions S.A." className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">RUT Empresa</label>
                                <Input placeholder="76.000.000-0" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11 font-mono" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Email</label>
                                    <Input type="email" placeholder="contacto@empresa.cl" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Teléfono</label>
                                    <Input placeholder="+56 9 ..." className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Dirección</label>
                                <Input placeholder="Calle, Número, Comuna" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11" />
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <Button variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl font-bold">
                                    Cancelar
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold px-8">
                                    Guardar Cliente
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Total Clientes
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none">
                            {totalClients}
                        </div>
                        <p className="text-xs font-bold text-blue-600 mt-2 italic shadow-sm bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter">Cartera activa</p>
                    </CardContent>
                </Card>

                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Nuevos este Mes
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black tracking-tight leading-none text-green-600">
                            {newClientsThisMonth}
                        </div>
                        <p className="text-xs font-bold text-green-600 mt-2 italic shadow-sm bg-green-50 dark:bg-green-900/20 inline-block px-2 py-0.5 rounded-full uppercase tracking-tighter">Crecimiento reciente</p>
                    </CardContent>
                </Card>

                {/* Third card hidden for MVP as per requirements */}
            </div>

            {/* Main Content Table */}
            <Card className="border-none premium-shadow bg-white dark:bg-slate-900 overflow-hidden">
                <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por Razón Social, RUT o Email..."
                            className="pl-10 rounded-xl bg-gray-50 dark:bg-slate-800 border-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="relative overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                                <TableHead className="pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400">RAZÓN SOCIAL</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">RUT</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">CONTACTO</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">DIRECCIÓN</TableHead>
                                <TableHead className="pr-6"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-500 font-medium">
                                        Cargando clientes...
                                    </TableCell>
                                </TableRow>
                            ) : filteredClients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-gray-500 font-medium">
                                        No se encontraron clientes.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClients.map((client) => (
                                    <TableRow key={client.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800">
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <Avatar className="w-11 h-11 border-2 border-white dark:border-slate-900 shadow-sm transition-transform group-hover:scale-110">
                                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-primary text-white font-black text-sm">
                                                            {getInitials(client.razon_social)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 dark:text-gray-100 leading-tight">{client.razon_social}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-[11px] font-bold bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-400">
                                                {client.rut}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    <div className="w-5 h-5 rounded flex items-center justify-center bg-gray-50 dark:bg-slate-800">
                                                        <Mail className="w-3 h-3" />
                                                    </div>
                                                    {client.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    <div className="w-5 h-5 rounded flex items-center justify-center bg-gray-50 dark:bg-slate-800">
                                                        <Phone className="w-3 h-3" />
                                                    </div>
                                                    {client.telefono}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                                                <div className="w-5 h-5 rounded flex items-center justify-center bg-gray-50 dark:bg-slate-800">
                                                    <Building2 className="w-3 h-3" />
                                                </div>
                                                {client.direccion}
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl premium-shadow border-none overflow-hidden p-1 w-56">
                                                    <DropdownMenuItem className="rounded-lg font-bold text-xs py-2 focus:bg-primary/5 focus:text-primary cursor-pointer gap-2">
                                                        <FileText className="w-3.5 h-3.5" />
                                                        Nueva Cotización
                                                    </DropdownMenuItem>
                                                    <div className="h-px bg-gray-100 dark:bg-slate-800 my-1" />
                                                    <DropdownMenuItem className="rounded-lg font-bold text-xs py-2 focus:bg-primary/5 focus:text-primary cursor-pointer gap-2">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        Ver Detalle / Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-lg font-bold text-xs py-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer gap-2">
                                                        Eliminar Cliente
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
            </Card>
        </div>
    );
}

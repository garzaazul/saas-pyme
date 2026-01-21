"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { updateTheme } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, Users, Bell, CreditCard, Shield, Palette, Save, Sparkles, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evitar errores de hidratación
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = async (checked: boolean) => {
        const newTheme = checked ? "dark" : "light";
        setTheme(newTheme);
        await updateTheme(newTheme);
    };

    if (!mounted) {
        return (
            <div className="space-y-8 pb-10 max-w-5xl opacity-0">
                <h1 className="text-3xl font-extrabold tracking-tight">Configuración</h1>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10 max-w-5xl">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
                        Configuración
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Personaliza y administra las preferencias de tu ecosistema SaaS.
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Organization Settings */}
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden">
                    <CardHeader className="border-b border-gray-50 dark:border-slate-800 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black tracking-tight">Perfil de Organización</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-70">Datos maestros de la empresa</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Nombre Comercial</label>
                                <Input defaultValue="Mi Empresa SpA" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">RUT Corporativo</label>
                                <Input defaultValue="76.123.456-7" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11 font-mono" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Email de Contacto</label>
                                <Input type="email" defaultValue="contacto@miempresa.cl" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Teléfono Principal</label>
                                <Input defaultValue="+56 2 1234 5678" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Dirección Matriz</label>
                            <Input defaultValue="Av. Providencia 1234, Santiago" className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11" />
                        </div>
                        <div className="flex justify-end">
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold px-8 h-11 transition-all hover:scale-105 active:scale-95 gap-2">
                                <Save className="w-4 h-4" />
                                Guardar Preferencias
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Appearance */}
                    <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                    <Palette className="w-4 h-4" />
                                </div>
                                <CardTitle className="text-lg font-black tracking-tight">Estética</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800/50">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold">Modo Oscuro</p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-tight">Interfaz de alto contraste</p>
                                </div>
                                <Switch
                                    checked={theme === "dark"}
                                    onCheckedChange={toggleTheme}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <CardTitle className="text-lg font-black tracking-tight">Notificaciones</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Cotizaciones aceptadas</span>
                                <Switch defaultChecked />
                            </div>
                            <Separator className="opacity-50" />
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Alertas de Stock</span>
                                <Switch defaultChecked />
                            </div>
                            <Separator className="opacity-50" />
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Resumen semanal AI</span>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Billing */}
                <Card className="premium-shadow border-none bg-indigo-600 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard className="w-32 h-32 rotate-12" />
                    </div>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-yellow-300" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black tracking-tight">Suscripción Premium</CardTitle>
                                <CardDescription className="text-indigo-100 font-bold opacity-80">Administra tu plan actual</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <div className="space-y-1">
                                <p className="text-sm font-black uppercase tracking-widest text-indigo-100">Plan Enterprise</p>
                                <p className="text-2xl font-black leading-none">$149.990 <span className="text-xs opacity-60">/mes</span></p>
                                <p className="text-[10px] font-bold text-indigo-200 mt-2 uppercase tracking-tighter italic">Próxima renovación: 15 de Noviembre, 2024</p>
                            </div>
                            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl px-8 h-11 shadow-xl">
                                Gestionar Facturación
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="premium-shadow border-none bg-white dark:bg-slate-900 overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                                <Shield className="w-4 h-4" />
                            </div>
                            <CardTitle className="text-lg font-black tracking-tight">Seguridad y Acceso</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                                        <Lock className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black">2FA</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Doble factor</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-xs font-black text-primary p-0 h-auto hover:bg-transparent">Configurar</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                                        <User className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black">Contraseña</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Último cambio: 2 meses</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-xs font-black text-primary p-0 h-auto hover:bg-transparent">Actualizar</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

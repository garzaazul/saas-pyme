"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, Users, Bell, CreditCard, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                <p className="text-gray-500">
                    Administra la configuración de tu organización
                </p>
            </div>

            {/* Organization Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <CardTitle>Organización</CardTitle>
                    </div>
                    <CardDescription>
                        Información básica de tu empresa
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre de la Empresa</label>
                            <Input defaultValue="Mi Empresa SpA" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">RUT</label>
                            <Input defaultValue="76.123.456-7" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" defaultValue="contacto@miempresa.cl" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Teléfono</label>
                            <Input defaultValue="+56 2 1234 5678" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dirección</label>
                        <Input defaultValue="Av. Providencia 1234, Santiago" />
                    </div>
                    <div className="flex justify-end">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Guardar Cambios
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Team Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <CardTitle>Equipo</CardTitle>
                    </div>
                    <CardDescription>
                        Gestiona los usuarios de tu organización
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>La gestión de usuarios estará disponible próximamente</p>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <CardTitle>Notificaciones</CardTitle>
                    </div>
                    <CardDescription>
                        Configura las alertas y notificaciones
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Cotización Aceptada</p>
                            <p className="text-sm text-gray-500">
                                Recibe un email cuando un cliente acepte una cotización
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Cotización por Vencer</p>
                            <p className="text-sm text-gray-500">
                                Alerta 3 días antes de que venza una cotización
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Stock Bajo</p>
                            <p className="text-sm text-gray-500">
                                Notificación cuando un producto tenga stock bajo
                            </p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            {/* Billing */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <CardTitle>Facturación</CardTitle>
                    </div>
                    <CardDescription>
                        Administra tu suscripción y método de pago
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                            <p className="font-medium text-blue-900">Plan Pro</p>
                            <p className="text-sm text-blue-700">Próximo cobro: 15 Nov 2024</p>
                        </div>
                        <Button variant="outline">Administrar Plan</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-blue-600" />
                        <CardTitle>Apariencia</CardTitle>
                    </div>
                    <CardDescription>
                        Personaliza la apariencia de tu dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Modo Oscuro</p>
                            <p className="text-sm text-gray-500">
                                Activa el tema oscuro para reducir fatiga visual
                            </p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <CardTitle>Seguridad</CardTitle>
                    </div>
                    <CardDescription>
                        Configuraciones de seguridad de tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Autenticación de Dos Factores</p>
                            <p className="text-sm text-gray-500">
                                Añade una capa extra de seguridad a tu cuenta
                            </p>
                        </div>
                        <Button variant="outline">Configurar</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Cambiar Contraseña</p>
                            <p className="text-sm text-gray-500">
                                Actualiza tu contraseña periódicamente
                            </p>
                        </div>
                        <Button variant="outline">Cambiar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

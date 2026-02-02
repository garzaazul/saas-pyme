"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Organization } from "@/types/organizations";
import { organizationSchema, OrganizationFormValues } from "@/lib/validations/organization";
import { updateMyOrganization } from "@/app/actions/organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Globe, Instagram, Facebook, MessageCircle, Mail, Music2, Upload, X } from "lucide-react";
import { normalizePhone } from "@/lib/chile-formatters";

interface OrganizationFormProps {
    organization: Organization;
}

export function OrganizationForm({ organization }: OrganizationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoGenerateSlug, setAutoGenerateSlug] = useState(!organization.web_slug);

    const form = useForm<OrganizationFormValues>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: organization.name || "",
            description: organization.description || "",
            rut: organization.rut || "",
            web_slug: organization.web_slug || "",
            whatsapp: organization.whatsapp || "",
            email: organization.email || "",
            instagram_url: organization.instagram_url || "",
            facebook_url: organization.facebook_url || "",
            tiktok_url: organization.tiktok_url || "",
            transfer_details: organization.transfer_details || "",
        },
    });

    const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
    const nameValue = watch("name");

    // Real-time slug generation logic
    useEffect(() => {
        if (autoGenerateSlug && nameValue) {
            const slug = nameValue
                .toLowerCase()
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remove accents
                .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
                .replace(/[\s-]+/g, "-") // Replace spaces/dashes with single dash
                .replace(/^-+|-+$/g, ""); // Trim dashes from starts/ends

            setValue("web_slug", slug, { shouldValidate: true });
        }
    }, [nameValue, autoGenerateSlug, setValue]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("logo_url", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    async function onSubmit(values: OrganizationFormValues) {
        setIsSubmitting(true);
        try {
            // Normalizar WhatsApp antes de enviar
            if (values.whatsapp) {
                values.whatsapp = normalizePhone(values.whatsapp);
            }

            const result = await updateMyOrganization(values);
            if (result.success) {
                toast.success("Información de la empresa actualizada correctamente");
            } else {
                toast.error(result.error || "Error al actualizar la información");
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Identidad Visual */}
                <Card className="rounded-xl overflow-hidden premium-shadow border-none">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <CardTitle className="text-xl font-black tracking-tight">Identidad Visual</CardTitle>
                        <CardDescription className="font-medium">Configura el nombre y la presencia web de tu empresa.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex flex-col items-center gap-4 py-4">
                            <Label className="text-center font-bold text-gray-400 uppercase text-[10px] tracking-widest">Logo de la Empresa</Label>
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors group-hover:border-primary/50">
                                    {watch("logo_url") ? (
                                        <>
                                            <img src={watch("logo_url") as string} alt="Logo preview" className="w-full h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => setValue("logo_url", null)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <Upload className="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors" />
                                    )}
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="logo-upload"
                                    onChange={handleLogoChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 text-[10px] font-black uppercase tracking-wider"
                                    onClick={() => document.getElementById("logo-upload")?.click()}
                                >
                                    {watch("logo_url") ? "Cambiar Logo" : "Subir Logo"}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-bold text-sm">Nombre de la Empresa</Label>
                            <Input
                                id="name"
                                placeholder="Ej: Mi Empresa SpA"
                                className="rounded-xl h-11 border-gray-100 dark:border-slate-800 focus:ring-primary/20"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-xs font-bold text-red-500 mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center mb-1">
                                <Label htmlFor="web_slug" className="font-bold text-sm">Web Slug (URL Catálogo)</Label>
                                <button
                                    type="button"
                                    onClick={() => setAutoGenerateSlug(!autoGenerateSlug)}
                                    className="text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-colors"
                                >
                                    {autoGenerateSlug ? "[ Manual ]" : "[ Automático ]"}
                                </button>
                            </div>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="web_slug"
                                    className="pl-10 rounded-xl h-11 border-gray-100 dark:border-slate-800"
                                    placeholder="ej-pyme"
                                    readOnly={autoGenerateSlug}
                                    {...register("web_slug")}
                                />
                            </div>
                            <div className="bg-primary/5 px-3 py-2 rounded-lg border border-primary/10">
                                <p className="text-[10px] text-primary font-bold tracking-tight">
                                    PUBLIC URL:
                                    <span className="ml-1 opacity-70 italic">financier.cl/c/{watch("web_slug") || "tu-slug"}</span>
                                </p>
                            </div>
                            {errors.web_slug && <p className="text-xs font-bold text-red-500 mt-1">{errors.web_slug.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="font-bold text-sm">Descripción o Eslogan</Label>
                            <Textarea
                                id="description"
                                placeholder="Breve descripción de lo que hace tu empresa"
                                className="resize-none rounded-xl border-gray-100 dark:border-slate-800 min-h-[80px]"
                                {...register("description")}
                            />
                            {errors.description && <p className="text-xs font-bold text-red-500 mt-1">{errors.description.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Contacto y Redes */}
                <Card className="rounded-xl overflow-hidden premium-shadow border-none">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <CardTitle className="text-xl font-black tracking-tight">Contacto y Redes</CardTitle>
                        <CardDescription className="font-medium">Cómo pueden contactarte tus clientes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="font-bold text-sm">WhatsApp Business</Label>
                            <div className="relative">
                                <MessageCircle className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="whatsapp"
                                    className="pl-10 rounded-xl h-11 border-gray-100 dark:border-slate-800"
                                    placeholder="+56912345678"
                                    {...register("whatsapp")}
                                />
                            </div>
                            {errors.whatsapp && <p className="text-xs font-bold text-red-500 mt-1">{errors.whatsapp.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-bold text-sm">Email Corporativo</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    className="pl-10 rounded-xl h-11 border-gray-100 dark:border-slate-800"
                                    placeholder="contacto@miempresa.cl"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="instagram_url" className="font-bold text-sm">Instagram</Label>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="https://instagram.com/usuario"
                                        className="pl-10 rounded-xl h-11 border-gray-100 dark:border-slate-800"
                                        {...register("instagram_url")}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebook_url" className="font-bold text-sm">Facebook</Label>
                                <div className="relative">
                                    <Facebook className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="https://facebook.com/pagina"
                                        className="pl-10 rounded-xl h-11 border-gray-100 dark:border-slate-800"
                                        {...register("facebook_url")}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tiktok_url" className="font-bold text-sm">TikTok</Label>
                                <div className="relative">
                                    <Music2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="https://tiktok.com/@usuario"
                                        className="pl-10 rounded-xl h-11 border-gray-100 dark:border-slate-800"
                                        {...register("tiktok_url")}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Datos de Transferencia */}
                <Card className="rounded-xl overflow-hidden premium-shadow border-none md:col-span-2">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
                        <CardTitle className="text-xl font-black tracking-tight">Datos de Transferencia</CardTitle>
                        <CardDescription className="font-medium">Esta información aparecerá en tus cotizaciones y comprobantes de venta.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="transfer_details" className="font-bold text-sm">Instrucciones de Pago (Textarea)</Label>
                            <Textarea
                                id="transfer_details"
                                placeholder="Banco: Banco Estado&#10;Tipo: Cuenta Corriente&#10;Número: 123456789&#10;RUT: 12.345.678-9&#10;Email: pagos@miempresa.cl"
                                className="min-h-[120px] rounded-xl border-gray-100 dark:border-slate-800"
                                {...register("transfer_details")}
                            />
                            {errors.transfer_details && <p className="text-xs font-bold text-red-500 mt-1">{errors.transfer_details.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t border-gray-50 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/20 p-6">
                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto rounded-xl h-11 px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 font-bold">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    );
}

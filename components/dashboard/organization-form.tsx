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
import { Loader2, Globe, Instagram, Facebook, MessageCircle, Mail } from "lucide-react";

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

    async function onSubmit(values: OrganizationFormValues) {
        setIsSubmitting(true);
        try {
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
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Identidad Visual</CardTitle>
                        <CardDescription>Configura el nombre y la presencia web de tu empresa.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre de la Empresa</Label>
                            <Input
                                id="name"
                                placeholder="Ej: Mi Empresa SpA"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="web_slug">Web Slug (URL Personalizada)</Label>
                                <button
                                    type="button"
                                    onClick={() => setAutoGenerateSlug(!autoGenerateSlug)}
                                    className="text-xs text-primary hover:underline"
                                >
                                    {autoGenerateSlug ? "Editar manualmente" : "Auto-generar"}
                                </button>
                            </div>
                            <div className="relative">
                                <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="web_slug"
                                    className="pl-9"
                                    placeholder="ej-pyme"
                                    readOnly={autoGenerateSlug}
                                    {...register("web_slug")}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Tu catálogo será visible en: /c/{watch("web_slug") || "tu-slug"}</p>
                            {errors.web_slug && <p className="text-sm text-red-500">{errors.web_slug.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción / Eslogan</Label>
                            <Textarea
                                id="description"
                                placeholder="Breve descripción de lo que hace tu empresa"
                                className="resize-none"
                                {...register("description")}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Contacto y Redes */}
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Contacto y Redes Sociales</CardTitle>
                        <CardDescription>Cómo pueden contactarte tus clientes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp Business</Label>
                            <div className="relative">
                                <MessageCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="whatsapp"
                                    className="pl-9"
                                    placeholder="+56912345678"
                                    {...register("whatsapp")}
                                />
                            </div>
                            {errors.whatsapp && <p className="text-sm text-red-500">{errors.whatsapp.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Corporativo</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    className="pl-9"
                                    placeholder="contacto@miempresa.cl"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="instagram_url">Instagram</Label>
                                <Input placeholder="@usuario" {...register("instagram_url")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebook_url">Facebook</Label>
                                <Input placeholder="facebook.com/pagina" {...register("facebook_url")} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Datos de Transferencia */}
                <Card className="rounded-xl md:col-span-2">
                    <CardHeader>
                        <CardTitle>Datos de Transferencia (Instrucciones de Pago)</CardTitle>
                        <CardDescription>Esta información aparecerá en tus cotizaciones y comprobantes de venta.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="transfer_details">Instrucciones de Pago</Label>
                            <Textarea
                                id="transfer_details"
                                placeholder="Banco: Banco Estado&#10;Tipo: Cuenta Corriente&#10;Número: 123456789&#10;RUT: 12.345.678-9&#10;Email: pagos@miempresa.cl"
                                className="min-h-[120px]"
                                {...register("transfer_details")}
                            />
                            {errors.transfer_details && <p className="text-sm text-red-500">{errors.transfer_details.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t p-6">
                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    );
}

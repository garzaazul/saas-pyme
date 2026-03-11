"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClientAction, updateClientAction, type Client } from "@/app/actions/clients";
import { formatRut, validateRut, normalizePhone, isValidChileanMobile } from "@/lib/chile-formatters";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ClientFormProps {
    client?: Client;
    onSuccess: (client: Client) => void;
    onCancel: () => void;
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        razon_social: client?.razon_social || "",
        rut: client?.rut || "",
        email: client?.email || "",
        telefono: client?.telefono || "",
        direccion: client?.direccion || ""
    });

    const [errors, setErrors] = useState({
        rut: false,
        telefono: false
    });

    useEffect(() => {
        if (client) {
            setFormData({
                razon_social: client.razon_social,
                rut: client.rut,
                email: client.email || "",
                telefono: client.telefono || "",
                direccion: client.direccion || ""
            });
        }
    }, [client]);

    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formatted = formatRut(rawValue);
        setFormData(prev => ({ ...prev, rut: formatted }));

        if (formatted.length > 2) {
            setErrors(prev => ({ ...prev, rut: !validateRut(formatted) }));
        } else {
            setErrors(prev => ({ ...prev, rut: false }));
        }
    };

    const handlePhoneBlur = () => {
        const normalized = normalizePhone(formData.telefono);
        setFormData(prev => ({ ...prev, telefono: normalized }));
        setErrors(prev => ({ ...prev, telefono: !isValidChileanMobile(normalized) && normalized !== "" }));
    };

    const isFormInvalid = errors.rut || !validateRut(formData.rut) || (formData.telefono !== "" && !isValidChileanMobile(formData.telefono)) || formData.razon_social === "";

    const handleSaveClient = async () => {
        if (isFormInvalid) return;

        setIsSaving(true);
        try {
            let result;
            if (client) {
                result = await updateClientAction(client.id, formData);
            } else {
                result = await createClientAction(formData);
            }

            if (result.error) {
                toast.error(`Error: ${result.error}`);
            } else if (result.data) {
                onSuccess(result.data as Client);
            } else {
                // If it's update, result might not have 'data' but success
                onSuccess(client || {} as Client);
            }
        } catch (error) {
            console.error("Error saving client:", error);
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Razón Social</label>
                <Input
                    placeholder="Ej: Tech Solutions S.A."
                    className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11"
                    value={formData.razon_social}
                    onChange={(e) => setFormData(prev => ({ ...prev, razon_social: e.target.value }))}
                />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">
                        {formData.rut === "1-1" ? "Identificador Genérico" : "RUT Empresa"}
                    </label>
                    {errors.rut && <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">RUT Inválido</span>}
                    {formData.rut === "1-1" && <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Inscripción Rápida</span>}
                </div>
                <Input
                    placeholder="76.000.000-0 o 1-1"
                    className={cn(
                        "rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11 font-mono transition-all",
                        errors.rut && "ring-2 ring-red-500/50 bg-red-50 dark:bg-red-900/10",
                        formData.rut === "1-1" && "ring-2 ring-blue-500/50 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400"
                    )}
                    value={formData.rut}
                    onChange={handleRutChange}
                />
                {formData.rut === "1-1" && (
                    <p className="text-[10px] text-blue-500 font-medium pl-1 mt-1">
                        * Solo el nombre o razón social es obligatorio para clientes genéricos.
                    </p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Email</label>
                    <Input
                        type="email"
                        placeholder="contacto@empresa.cl"
                        className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Teléfono</label>
                        {errors.telefono && <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Formato: +569...</span>}
                    </div>
                    <Input
                        placeholder="+56 9 ..."
                        className={cn(
                            "rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11 transition-all",
                            errors.telefono && "ring-2 ring-red-500/50 bg-red-50 dark:bg-red-900/10"
                        )}
                        value={formData.telefono}
                        onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                        onBlur={handlePhoneBlur}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-1">Dirección</label>
                <Input
                    placeholder="Calle, Número, Comuna"
                    className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11"
                    value={formData.direccion}
                    onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                />
            </div>

            <div className="flex justify-end gap-3 mt-8">
                <Button type="button" variant="ghost" onClick={onCancel} className="rounded-xl font-bold">
                    Cancelar
                </Button>
                <Button
                    disabled={isFormInvalid || isSaving}
                    onClick={handleSaveClient}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold px-8 transition-all disabled:opacity-50 disabled:grayscale min-w-[140px]"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Guardando...
                        </>
                    ) : (
                        "Guardar Cliente"
                    )}
                </Button>
            </div>
        </div>
    );
}

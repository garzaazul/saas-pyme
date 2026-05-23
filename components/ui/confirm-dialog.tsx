"use client";

import { AlertTriangle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Título principal del modal */
    title?: string;
    /** Descripción/mensaje de advertencia */
    description: string;
    /** Texto del botón de confirmación (default: "Confirmar") */
    confirmLabel?: string;
    /** Texto del botón de cancelar (default: "Cancelar") */
    cancelLabel?: string;
    /** Se ejecuta al confirmar */
    onConfirm: () => void;
    /** Muestra spinner y deshabilita botones mientras se procesa */
    isLoading?: boolean;
}

/**
 * Modal de confirmación reutilizable — reemplaza window.confirm().
 * Mismo estilo que el usado en el módulo de Clientes.
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title = "¿Estás seguro?",
    description,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    onConfirm,
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold tracking-tight">{title}</DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl font-bold"
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-none rounded-xl font-bold px-6 min-w-[120px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Procesando...
                            </>
                        ) : (
                            confirmLabel
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

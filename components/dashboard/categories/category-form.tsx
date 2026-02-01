"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Category, CategoryTargetType, CreateCategoryInput } from "@/types/categories";
import { createCategory, updateCategory } from "@/app/actions/categories";

interface CategoryFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category;
    onSuccess: () => void;
}

export function CategoryForm({ open, onOpenChange, category, onSuccess }: CategoryFormProps) {
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateCategoryInput>({
        defaultValues: {
            name: category?.name || "",
            description: category?.description || "",
            target_type: category?.target_type || "ambos",
            is_active: category?.is_active ?? true,
        }
    });

    const targetType = watch("target_type");

    const onSubmit = async (data: CreateCategoryInput) => {
        setLoading(true);
        try {
            const res = category
                ? await updateCategory({ ...data, id: category.id })
                : await createCategory(data);

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(category ? "Categoría actualizada" : "Categoría creada");
                onSuccess();
                onOpenChange(false);
                reset();
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-xl">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl font-bold">
                        {category ? "Editar Categoría" : "Nueva Categoría"}
                    </DialogTitle>
                    <DialogDescription>
                        Complete los datos de la categoría para organizar sus productos y servicios.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Nombre</label>
                            <Input
                                {...register("name", { required: "El nombre es obligatorio" })}
                                placeholder="Ej: Electrónica, Consultoría"
                                className="rounded-lg"
                            />
                            {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Descripción</label>
                            <Input
                                {...register("description")}
                                placeholder="Breve descripción opcional"
                                className="rounded-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Aplica a</label>
                            <Select
                                value={targetType}
                                onValueChange={(val) => setValue("target_type", val as CategoryTargetType)}
                            >
                                <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Seleccione aplicación" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="producto">Sólo Productos</SelectItem>
                                    <SelectItem value="servicio">Sólo Servicios</SelectItem>
                                    <SelectItem value="ambos">Ambos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="rounded-lg"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 rounded-lg min-w-[100px]"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { processImage } from "@/lib/image-processing";
import { toast } from "sonner";
import { Product, CreateProductInput, ProductType } from "@/types/products";
import { Category } from "@/types/categories";
import { getCategories } from "@/app/actions/categories";
import { createProduct, updateProduct } from "@/app/actions/products";
import { Package, Wrench, Image as ImageIcon, X, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product;
    onSuccess: () => void;
}

export function ProductForm({ open, onOpenChange, product, onSuccess }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>(product?.image_urls || []);
    const [productType, setProductType] = useState<ProductType>(product?.type || "product");

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateProductInput>({
        defaultValues: {
            name: product?.name || "",
            description: product?.description || "",
            base_price: product?.base_price || 0,
            current_stock: product?.current_stock || 0,
            min_stock_alert: product?.min_stock_alert || 5,
            unit: product?.unit || "un",
            is_stock_product: product?.is_stock_product ?? true,
            type: product?.type || "product",
            category_ids: product?.category_ids || [],
            is_active: product?.is_active ?? true,
            image_urls: product?.image_urls || [],
        }
    });

    const selectedCategoryIds = watch("category_ids") || [];

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            // Filter categories for products or both
            setCategories(data.filter(c => c.target_type === 'producto' || c.target_type === 'ambos'));
        };
        fetchCategories();
    }, []);

    const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        if (imageUrls.length + files.length > 3) {
            toast.error("Máximo 3 imágenes permitidas");
            return;
        }

        setUploading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get profile to get organization_id
        const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", user.id)
            .single();

        if (!profile) return;

        const newUrls = [...imageUrls];

        for (const file of Array.from(files)) {
            try {
                const processedFile = await processImage(file);
                const fileName = `${Date.now()}-${file.name}`;
                const filePath = `${profile.organization_id}/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from("products")
                    .upload(filePath, processedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from("products")
                    .getPublicUrl(filePath);

                newUrls.push(publicUrl);
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error(`Error al subir ${file.name}`);
            }
        }

        setImageUrls(newUrls);
        setValue("image_urls", newUrls);
        setUploading(false);
    };

    const removeImage = (index: number) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls);
        setValue("image_urls", newUrls);
    };

    const onSubmit = async (data: CreateProductInput) => {
        setLoading(true);
        try {
            const res = product
                ? await updateProduct({ ...data, id: product.id, type: productType, image_urls: imageUrls })
                : await createProduct({ ...data, type: productType, image_urls: imageUrls });

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(product ? "Item actualizado" : "Item creado");
                onSuccess();
                onOpenChange(false);
                reset();
            }
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {product ? "Editar Item" : "Agregar Nuevo Item"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    {/* Type Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setProductType("product")}
                            className={cn(
                                "rounded-lg font-bold transition-all h-10",
                                productType === "product" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-gray-500"
                            )}
                        >
                            <Package className="w-4 h-4 mr-2" />
                            Producto
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setProductType("service")}
                            className={cn(
                                "rounded-lg font-bold transition-all h-10",
                                productType === "service" ? "bg-white dark:bg-slate-900 shadow-sm text-primary" : "text-gray-500"
                            )}
                        >
                            <Wrench className="w-4 h-4 mr-2" />
                            Servicio
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Nombre</label>
                            <Input
                                {...register("name", { required: "El nombre es obligatorio" })}
                                placeholder="Ej: Laptop Dell XPS 15"
                                className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1 flex justify-between items-center">
                                Categorías
                                {categories.length === 0 && (
                                    <Link href="/dashboard/categories" className="text-primary hover:underline lowercase normal-case">
                                        crear categoría
                                    </Link>
                                )}
                            </label>

                            {/* Multi-select badging area */}
                            <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-transparent focus-within:border-primary/20 transition-all">
                                {selectedCategoryIds.length > 0 ? (
                                    selectedCategoryIds.map(id => {
                                        const cat = categories.find(c => c.id === id);
                                        return (
                                            <Badge
                                                key={id}
                                                variant="secondary"
                                                className="bg-primary/10 text-primary border-primary/10 pl-2 pr-1 py-1 rounded-lg flex items-center gap-1 group"
                                            >
                                                <span className="text-xs font-bold leading-none">{cat?.name || "Cargando..."}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newVal = selectedCategoryIds.filter(cid => cid !== id);
                                                        setValue("category_ids", newVal);
                                                    }}
                                                    className="p-0.5 hover:bg-primary/20 rounded-md transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        );
                                    })
                                ) : (
                                    <span className="text-xs text-gray-400 font-medium italic pl-1 flex items-center">Ninguna seleccionada</span>
                                )}
                            </div>

                            <Select
                                value=""
                                onValueChange={(val) => {
                                    if (val && !selectedCategoryIds.includes(val)) {
                                        setValue("category_ids", [...selectedCategoryIds, val]);
                                    }
                                }}
                            >
                                <SelectTrigger className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11">
                                    <SelectValue placeholder={selectedCategoryIds.length > 0 ? "+ Añadir otra..." : "Añadir categoría..."} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {categories
                                        .filter(cat => !selectedCategoryIds.includes(cat.id))
                                        .map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Precio Base CLP</label>
                                <Input
                                    {...register("base_price", { valueAsNumber: true, required: "Precio es requerido" })}
                                    type="number"
                                    placeholder="0"
                                    className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11 font-black"
                                />
                            </div>
                            {productType === "product" && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Stock Actual</label>
                                    <Input
                                        {...register("current_stock", { valueAsNumber: true })}
                                        type="number"
                                        placeholder="0"
                                        className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 h-11 font-black"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Image Upload Area */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Imágenes</label>
                                <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-tight bg-[#091226]/5 text-[#091226] border-[#091226]/10">
                                    Máximo 3 imágenes
                                </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 dark:border-slate-800 bg-gray-50">
                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {imageUrls.length < 3 && (
                                    <label className={cn(
                                        "aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all gap-1",
                                        uploading && "pointer-events-none opacity-50"
                                    )}>
                                        {uploading ? (
                                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                        ) : (
                                            <>
                                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Subir</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={onImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Descripción</label>
                            <Textarea
                                {...register("description")}
                                placeholder="Breve descripción del item..."
                                className="rounded-xl border-none bg-gray-50 dark:bg-slate-800 min-h-[80px]"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                            <span className="text-sm font-bold uppercase tracking-wide">Público en Catálogo</span>
                            <Switch
                                checked={watch("is_active")}
                                onCheckedChange={(val) => setValue("is_active", val)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-3 mt-8">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || uploading}
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold px-8 h-11"
                        >
                            {loading ? "Guardando..." : "Guardar Item"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

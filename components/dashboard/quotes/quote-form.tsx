"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { toast } from "sonner";
import { Quote, CreateQuoteInput, QuoteStatus, CreateQuoteItemInput } from "@/types/quotes";
import { Client, getClients } from "@/app/actions/clients";
import { Product } from "@/types/products";
import { getProducts } from "@/app/actions/products";
import { createQuote, updateQuoteStatus } from "@/app/actions/quotes";
import {
    Plus,
    Trash,
    Calendar,
    User,
    Package,
    FileText,
    Trophy,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuoteFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quote?: Quote;
    onSuccess: () => void;
}

export function QuoteForm({ open, onOpenChange, quote, onSuccess }: QuoteFormProps) {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const { register, control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CreateQuoteInput>({
        defaultValues: {
            client_id: quote?.client_id || "",
            status: quote?.status || "borrador",
            observations: quote?.observations || "",
            valid_until: quote?.valid_until || "",
            priority: quote?.priority || "media",
            probability: quote?.probability || 50,
            estimated_close_date: quote?.estimated_close_date || "",
            items: quote?.items?.map(i => ({
                product_id: i.product_id,
                description: i.description,
                quantity: i.quantity,
                unit_price: i.unit_price
            })) || [
                    { description: "", quantity: 1, unit_price: 0 }
                ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const watchedItems = watch("items");

    const fetchInitialData = useCallback(async () => {
        try {
            const [clientsData, productsData] = await Promise.all([
                getClients(),
                getProducts()
            ]);
            setClients(clientsData);
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    }, []);

    useEffect(() => {
        if (open) {
            fetchInitialData();
            if (!quote) {
                reset({
                    client_id: "",
                    status: "borrador",
                    items: [{ description: "", quantity: 1, unit_price: 0 }]
                });
            }
        }
    }, [open, quote, reset, fetchInitialData]);

    const calculateTotal = () => {
        return watchedItems.reduce((acc, item) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unit_price) || 0;
            return acc + (qty * price);
        }, 0);
    };

    const handleProductSelect = (index: number, productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setValue(`items.${index}.description`, product.name);
            setValue(`items.${index}.unit_price`, product.base_price);
        }
    };

    const onSubmit = async (data: CreateQuoteInput) => {
        setLoading(true);
        try {
            // Validation: at least one item with description
            if (data.items.some(item => !item.description)) {
                toast.error("Todos los ítems deben tener una descripción");
                setLoading(false);
                return;
            }

            const res = await createQuote(data);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Cotización guardada exitosamente");
                onSuccess();
                onOpenChange(false);
            }
        } catch (error) {
            toast.error("Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[750px] rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900 max-h-[95vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {quote ? `Refinar Cotización #${quote.folio}` : "Nueva Cotización"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
                    {/* Header Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-1.5">
                                    <User className="w-3 h-3" /> Cliente
                                </label>
                                <Select
                                    value={watch("client_id")}
                                    onValueChange={(val) => setValue("client_id", val)}
                                >
                                    <SelectTrigger className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 shadow-sm">
                                        <SelectValue placeholder="Seleccionar cliente" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {clients.map(client => (
                                            <SelectItem key={client.id} value={client.id}>{client.razon_social}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" /> Validez
                                    </label>
                                    <Input
                                        type="date"
                                        {...register("valid_until")}
                                        className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-1.5">
                                        <TrendingUp className="w-3 h-3" /> Prioridad
                                    </label>
                                    <Select
                                        value={watch("priority")}
                                        onValueChange={(val) => setValue("priority", val)}
                                    >
                                        <SelectTrigger className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="baja">Baja</SelectItem>
                                            <SelectItem value="media">Media</SelectItem>
                                            <SelectItem value="alta">Alta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-1.5">
                                    <Trophy className="w-3 h-3" /> Probabilidad (%)
                                </label>
                                <Input
                                    type="number"
                                    {...register("probability", { min: 0, max: 100, valueAsNumber: true })}
                                    className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 shadow-sm font-black text-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" /> Cierre Estimado
                                </label>
                                <Input
                                    type="date"
                                    {...register("estimated_close_date")}
                                    className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pl-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Detalle de Propuesta
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ description: "", quantity: 1, unit_price: 0 })}
                                className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold text-xs"
                            >
                                <Plus className="w-3 h-3 mr-1" /> Nuevo Ítem
                            </Button>
                        </div>

                        <div className="border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50/50 dark:bg-slate-800/30">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[30%] text-[10px] font-black uppercase tracking-widest text-gray-400 py-3">Producto/Catálogo</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-3">Descripción</TableHead>
                                        <TableHead className="w-[12%] text-[10px] font-black uppercase tracking-widest text-gray-400 py-3">Cant.</TableHead>
                                        <TableHead className="w-[18%] text-[10px] font-black uppercase tracking-widest text-gray-400 py-3 text-right">Precio</TableHead>
                                        <TableHead className="w-[5%]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="hover:bg-transparent border-gray-50 dark:border-slate-800">
                                            <TableCell className="py-4">
                                                <Select
                                                    onValueChange={(val) => handleProductSelect(index, val)}
                                                >
                                                    <SelectTrigger className="border-none bg-gray-50 dark:bg-slate-800 h-9 text-xs rounded-lg">
                                                        <SelectValue placeholder="Catálogo..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {products.map(p => (
                                                            <SelectItem key={p.id} value={p.id} className="text-xs">
                                                                <span className="font-bold">{p.name}</span>
                                                                <span className="ml-2 text-gray-400 opacity-60">
                                                                    ${p.base_price.toLocaleString()}
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    {...register(`items.${index}.description` as const)}
                                                    placeholder="Escribe descripción..."
                                                    className="border-none bg-transparent h-9 text-sm focus-visible:ring-0 px-0 font-medium"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                                                    className="border-none bg-gray-50 dark:bg-slate-800 h-9 text-xs rounded-lg font-bold"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    {...register(`items.${index}.unit_price` as const, { valueAsNumber: true })}
                                                    className="border-none bg-gray-50 dark:bg-slate-800 h-9 text-xs rounded-lg font-black text-right text-primary"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Footer Area */}
                    <div className="flex flex-col md:flex-row gap-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Observaciones / Notas al cliente</label>
                            <Textarea
                                {...register("observations")}
                                placeholder="Términos comerciales, tiempos de entrega..."
                                className="rounded-2xl border-none bg-gray-50 dark:bg-slate-800 min-h-[100px] text-sm italic"
                            />
                        </div>
                        <div className="w-full md:w-[250px] p-6 rounded-3xl bg-primary text-white flex flex-col justify-between shadow-xl shadow-primary/20">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Cotización</span>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black italic tracking-tighter">
                                    ${calculateTotal().toLocaleString("es-CL")}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 mt-1">
                                    CLP • Impuestos incluidos
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-3 pb-2 mt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl font-bold"
                        >
                            Descartar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl font-bold px-10 h-11"
                        >
                            {loading ? "Procesando..." : "Generar Propuesta"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

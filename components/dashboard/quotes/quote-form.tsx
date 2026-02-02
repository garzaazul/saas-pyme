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
import { Quote, CreateQuoteInput, QuoteStatus } from "@/types/quotes";
import { Client, getClients } from "@/app/actions/clients";
import { Product } from "@/types/products";
import { getProducts } from "@/app/actions/products";
import { createQuote } from "@/app/actions/quotes";
import { getMyOrganization } from "@/app/actions/organizations";
import { format, addDays } from "date-fns";
import { Organization } from "@/types/organizations";
import {
    Plus,
    Trash,
    Calendar,
    User,
    Package,
    FileText,
    Pencil,
    Calculator,
    UserPlus,
    ShoppingCart
} from "lucide-react";
import { ClientForm } from "../clients/client-form";

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
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [isClientFormOpen, setIsClientFormOpen] = useState(false);

    // Selector de items local
    const [isManualMode, setIsManualMode] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [manualDescription, setManualDescription] = useState("");
    const [itemQuantity, setItemQuantity] = useState(1);
    const [itemPrice, setItemPrice] = useState(0);

    const { register, control, handleSubmit, reset, watch, setValue } = useForm<CreateQuoteInput>({
        defaultValues: {
            client_id: quote?.client_id || "",
            status: quote?.status || "borrador",
            observations: quote?.observations || "",
            valid_until: quote?.valid_until || format(addDays(new Date(), 15), "yyyy-MM-dd"),
            items: quote?.items?.map(i => ({
                product_id: i.product_id,
                description: i.description,
                quantity: i.quantity,
                unit_price: i.unit_price
            })) || []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    const watchedItems = watch("items");

    const fetchInitialData = useCallback(async () => {
        try {
            const [clientsData, productsData, orgData] = await Promise.all([
                getClients(),
                getProducts(),
                getMyOrganization()
            ]);
            setClients(clientsData);
            setProducts(productsData);
            setOrganization(orgData);
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
                    observations: "",
                    valid_until: format(addDays(new Date(), 15), "yyyy-MM-dd"),
                    items: []
                });
            }
        }
    }, [open, quote, reset, fetchInitialData]);

    const calculateTotal = () => {
        return (watchedItems || []).reduce((acc, item) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.unit_price) || 0;
            return acc + (qty * price);
        }, 0);
    };

    const handleProductSelect = (productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setSelectedProductId(productId);
            setManualDescription(product.name);
            setItemPrice(product.base_price);
        }
    };

    const handleAddItem = () => {
        const description = isManualMode ? manualDescription : products.find(p => p.id === selectedProductId)?.name || manualDescription;

        if (!description) {
            toast.error("Debe ingresar una descripción o seleccionar un producto");
            return;
        }

        append({
            product_id: isManualMode ? null : selectedProductId || null,
            description,
            quantity: itemQuantity,
            unit_price: itemPrice
        });

        // Reset selector
        setSelectedProductId("");
        setManualDescription("");
        setItemQuantity(1);
        setItemPrice(0);
    };

    const onSubmit = async (data: CreateQuoteInput) => {
        if (!data.client_id) {
            toast.error("Debe seleccionar un cliente");
            return;
        }

        if (data.items.length === 0) {
            toast.error("Debe agregar al menos un ítem a la cotización");
            return;
        }

        setLoading(true);
        try {
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
            <DialogContent className="sm:max-w-[850px] rounded-2xl border-none premium-shadow bg-white dark:bg-slate-900 max-h-[95vh] overflow-y-auto custom-scrollbar p-0">
                <div className="p-8">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-3xl font-black tracking-tighter flex items-center gap-3">
                            <span className="bg-primary/10 text-primary p-2 rounded-xl">
                                <FileText className="w-6 h-6" />
                            </span>
                            {quote ? `Refinar Cotización #${quote.folio}` : "Nueva Cotización"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* 1. Header Details */}
                        <div className="p-6 rounded-3xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center justify-between">
                                        <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Cliente</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsClientFormOpen(true)}
                                            className="h-6 px-2 text-[9px] font-black text-primary hover:bg-primary/10 rounded-full gap-1 uppercase"
                                        >
                                            <UserPlus className="w-2.5 h-2.5" /> Nuevo Cliente
                                        </Button>
                                    </label>
                                    <Select
                                        value={watch("client_id")}
                                        onValueChange={(val) => setValue("client_id", val)}
                                    >
                                        <SelectTrigger className="rounded-xl border-none bg-white dark:bg-slate-900 h-12 shadow-sm font-medium">
                                            <SelectValue placeholder="Seleccionar cliente..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-none premium-shadow">
                                            {clients.map(client => (
                                                <SelectItem key={client.id} value={client.id}>{client.razon_social}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1 flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" /> Validez (15 días por defecto)
                                    </label>
                                    <Input
                                        type="date"
                                        {...register("valid_until")}
                                        className="rounded-xl border-none bg-white dark:bg-slate-900 h-12 shadow-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Hybrid Item Selector */}
                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4" /> Agregar Ítem a Propuesta
                                </h3>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsManualMode(!isManualMode)}
                                    className="h-8 rounded-full text-[10px] font-black uppercase tracking-tight gap-2 bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 px-4"
                                >
                                    {isManualMode ? (
                                        <>
                                            <Package className="w-3 h-3 text-blue-500" /> Usar Catálogo
                                        </>
                                    ) : (
                                        <>
                                            <Pencil className="w-3 h-3 text-orange-500" /> Modo Manual
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                <div className="md:col-span-5 space-y-1.5">
                                    <label className="text-[9px] font-bold uppercase text-gray-400 ml-1">Descripción / Producto</label>
                                    {isManualMode ? (
                                        <Input
                                            placeholder="Ingrese descripción del servicio o producto..."
                                            value={manualDescription}
                                            onChange={(e) => setManualDescription(e.target.value)}
                                            className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 shadow-sm font-medium"
                                        />
                                    ) : (
                                        <Select value={selectedProductId} onValueChange={handleProductSelect}>
                                            <SelectTrigger className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 shadow-sm text-left font-medium">
                                                <SelectValue placeholder="Buscar en catálogo..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-none premium-shadow">
                                                {products.map(p => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        <span className="font-bold">{p.name}</span>
                                                        <span className="ml-2 text-[10px] text-gray-400 font-normal italic">${p.base_price.toLocaleString()}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[9px] font-bold uppercase text-gray-400 ml-1">Cant.</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={itemQuantity}
                                        onChange={(e) => setItemQuantity(Number(e.target.value))}
                                        className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 shadow-sm font-black text-center"
                                    />
                                </div>
                                <div className="md:col-span-3 space-y-1.5">
                                    <label className="text-[9px] font-bold uppercase text-gray-400 ml-1">Unitario (Neto)</label>
                                    <Input
                                        type="number"
                                        value={itemPrice}
                                        onChange={(e) => setItemPrice(Number(e.target.value))}
                                        className="rounded-xl border-none bg-white dark:bg-slate-900 h-11 shadow-sm font-black text-right text-primary italic"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 font-bold gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Agregar
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 3. Items Table */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pl-1">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" /> Detalle de la Propuesta
                                </h3>
                                <span className="text-[10px] font-bold text-gray-400 italic bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    {fields.length} {fields.length === 1 ? 'ítem agregado' : 'ítems agregados'}
                                </span>
                            </div>

                            <div className="border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                                <Table>
                                    <TableHeader className="bg-gray-50/50 dark:bg-slate-800/30">
                                        <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 py-4 pl-6">Descripción / Servicio</TableHead>
                                            <TableHead className="w-[12%] text-[10px] font-black uppercase tracking-widest text-gray-400 py-4 text-center">Cant.</TableHead>
                                            <TableHead className="w-[18%] text-[10px] font-black uppercase tracking-widest text-gray-400 py-4 text-right">Unitario (N)</TableHead>
                                            <TableHead className="w-[18%] text-[10px] font-black uppercase tracking-widest text-gray-400 py-4 text-right font-black text-primary pr-6">Subtotal</TableHead>
                                            <TableHead className="w-[8%] pr-6"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fields.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-20 text-center">
                                                    <div className="flex flex-col items-center gap-2 opacity-20">
                                                        <Plus className="w-8 h-8" />
                                                        <span className="text-xs font-black uppercase tracking-widest">No hay ítems registrados</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            fields.map((field, index) => {
                                                const qty = Number(watchedItems[index]?.quantity) || 0;
                                                const price = Number(watchedItems[index]?.unit_price) || 0;
                                                return (
                                                    <TableRow key={field.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-gray-50 dark:border-slate-800 transition-colors group">
                                                        <TableCell className="py-4 pl-6">
                                                            <Input
                                                                {...register(`items.${index}.description` as const)}
                                                                className="border-none bg-transparent h-8 text-sm focus-visible:ring-0 px-0 font-medium"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                                                                className="border-none bg-transparent h-8 text-xs rounded-lg font-bold text-center focus:bg-white dark:focus:bg-slate-900 shadow-none focus:shadow-sm"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                {...register(`items.${index}.unit_price` as const, { valueAsNumber: true })}
                                                                className="border-none bg-transparent h-8 text-xs rounded-lg font-bold text-right focus:bg-white dark:focus:bg-slate-900 shadow-none focus:shadow-sm"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-right font-black text-gray-900 dark:text-white text-sm italic pr-6">
                                                            ${(qty * price).toLocaleString("es-CL")}
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => remove(index)}
                                                                className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all rounded-full"
                                                            >
                                                                <Trash className="w-4 h-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* 4. Footer: Obs & Financials */}
                        <div className="flex flex-col md:flex-row gap-8 pt-8 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex-1 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Notas al cliente / Condiciones Comerciales</label>
                                <Textarea
                                    {...register("observations")}
                                    placeholder="Indique términos de pago, tiempo de entrega o validez especial de esta propuesta..."
                                    className="rounded-[2rem] border-none bg-gray-50/50 dark:bg-slate-800/50 min-h-[160px] text-sm italic p-6 focus:bg-white dark:focus:bg-slate-900 shadow-inner"
                                />
                            </div>

                            <div className="w-full md:w-[350px] space-y-6">
                                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Neto</span>
                                        <span className="font-bold text-gray-600">${calculateTotal().toLocaleString("es-CL")}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-primary/80">
                                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <Calculator className="w-3 h-3" /> IVA (19%)
                                        </span>
                                        <span className="font-bold">${Math.round(calculateTotal() * 0.19).toLocaleString("es-CL")}</span>
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-slate-800 my-4" />
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Total Final</span>
                                            <span className="text-[9px] font-bold text-gray-400">CLP • IMPUESTOS INCL.</span>
                                        </div>
                                        <span className="text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">
                                            ${Math.round(calculateTotal() * 1.19).toLocaleString("es-CL")}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => onOpenChange(false)}
                                        className="flex-1 rounded-2xl font-bold h-14 hover:bg-gray-100"
                                    >
                                        Descartar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 rounded-2xl font-black h-14 gap-2 text-base"
                                    >
                                        {loading ? (
                                            "Generando..."
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5" /> Crear Cotización
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 5. Read-only Transfer Details (As requested by user) */}
                        {organization?.transfer_details && (
                            <div className="p-6 rounded-3xl bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3 flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" /> Datos de Transferencia (Cierre de Venta)
                                </h4>
                                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line font-medium leading-relaxed italic">
                                    {organization.transfer_details}
                                </div>
                                <p className="mt-3 text-[9px] font-bold text-gray-400 uppercase italic">
                                    * Estos datos se incluirán automáticamente en el PDF final.
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Sub-Dialog for quick client creation */}
                <Dialog open={isClientFormOpen} onOpenChange={setIsClientFormOpen}>
                    <DialogContent className="sm:max-w-[600px] rounded-3xl border-none premium-shadow bg-white dark:bg-slate-900 p-0 overflow-hidden">
                        <div className="p-8">
                            <DialogHeader className="mb-6">
                                <DialogTitle className="text-2xl font-black tracking-tight">Registro Rápido de Cliente</DialogTitle>
                            </DialogHeader>
                            <ClientForm
                                onSuccess={async (newClient) => {
                                    const updatedClients = await getClients();
                                    setClients(updatedClients);
                                    setValue("client_id", newClient.id);
                                    setIsClientFormOpen(false);
                                    toast.success("Cliente creado y seleccionado");
                                }}
                                onCancel={() => setIsClientFormOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    );
}

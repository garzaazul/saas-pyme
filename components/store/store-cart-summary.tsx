"use client";

import { formatCLP } from "@/lib/currency";
import { Product } from "@/types/products";
import { Organization } from "@/types/organizations";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Send, Plus, Minus, CreditCard, MessageCircle } from "lucide-react";
import Image from "next/image";

interface CartItem {
    product: Product;
    quantity: number;
}

interface StoreCartSummaryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organization: Organization;
    cartItems: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onClearCart: () => void;
    showIva?: boolean;
}

export function StoreCartSummary({
    open,
    onOpenChange,
    organization,
    cartItems,
    onUpdateQuantity,
    onClearCart,
    showIva = false
}: StoreCartSummaryProps) {
    const total = cartItems.reduce((acc, item) => {
        const price = showIva ? Math.round(item.product.base_price * 1.19) : item.product.base_price;
        return acc + (price * item.quantity);
    }, 0);

    const isEmpty = cartItems.length === 0;
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleWhatsAppSend = () => {
        const taxStatus = showIva ? "(Precios incluyen IVA)" : "(Precios Netos)";
        const productList = cartItems
            .map(item => {
                const price = showIva ? Math.round(item.product.base_price * 1.19) : item.product.base_price;
                return `${item.quantity}x ${item.product.name} (${formatCLP(price * item.quantity)})`;
            })
            .join("\n");

        const message = encodeURIComponent(
            `Hola ${organization.name}, me interesa cotizar los siguientes productos ${taxStatus}:\n\n${productList}\n\n*Total estimado: ${formatCLP(total)}*`
        );

        const phone = organization.whatsapp?.replace(/\D/g, '') || '';
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md bg-white dark:bg-slate-900 border-none p-0 flex flex-col h-full rounded-l-[2rem]">
                <SheetHeader className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <SheetTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 p-2.5 rounded-xl">
                                    <ShoppingBag className="w-5 h-5" />
                                </span>
                                Mi Pedido
                            </SheetTitle>
                            {!isEmpty && (
                                <p className="text-sm text-gray-400 mt-1 pl-[52px]">
                                    {totalItems} {totalItems === 1 ? "producto" : "productos"}
                                </p>
                            )}
                        </div>
                        {!isEmpty && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearCart}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-xs"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Vaciar
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                <div className="flex-1 px-6 overflow-y-auto">
                    {isEmpty ? (
                        <div className="py-20 flex flex-col items-center justify-center opacity-20 text-center">
                            <ShoppingBag className="w-16 h-16 mb-4" />
                            <p className="text-lg font-black uppercase tracking-widest leading-tight">
                                Tu carro está<br />vacío
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 py-6">
                            {cartItems.map((item) => {
                                const unitPrice = showIva ? Math.round(item.product.base_price * 1.19) : item.product.base_price;
                                return (
                                    <div key={item.product.id} className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0">
                                            {item.product.image_urls?.[0] ? (
                                                <Image
                                                    src={item.product.image_urls[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                                    <ShoppingBag className="w-7 h-7" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 leading-tight mb-0.5">
                                                    {item.product.name}
                                                </h4>
                                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                    {formatCLP(unitPrice)} {showIva ? "c/u (IVA incl.)" : "c/u (Neto)"}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg p-0.5 shadow-sm border border-gray-100 dark:border-slate-700">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-900 transition-colors"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-7 text-center text-sm font-black text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-900 transition-colors"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <span className="font-black text-gray-900 dark:text-white text-sm">
                                                    {formatCLP(unitPrice * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <SheetFooter className="p-6 bg-gray-50/80 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800 mt-auto">
                    <div className="w-full space-y-5">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Total Estimado
                                </span>
                                {cartItems.length > 1 && (
                                    <span className="text-xs text-gray-400">
                                        {totalItems} productos · {showIva ? "IVA incluido" : "valores netos"}
                                    </span>
                                )}
                                {cartItems.length === 1 && (
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                                        CLP · {showIva ? "IVA INCLUIDO" : "NETO (+ IVA)"}
                                    </span>
                                )}
                            </div>
                            <span className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                                {formatCLP(total)}
                            </span>
                        </div>

                        <Button
                            disabled={isEmpty}
                            onClick={handleWhatsAppSend}
                            className="w-full h-14 bg-[#25D366] hover:bg-[#20b858] text-white shadow-lg shadow-green-200/60 dark:shadow-none rounded-2xl font-black gap-3 text-base transition-all active:scale-95 flex items-center justify-center"
                        >
                            {/* WhatsApp SVG icon */}
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Cotizar por WhatsApp
                        </Button>

                        <p className="text-[10px] text-center text-gray-400 px-4 leading-relaxed">
                            Se abrirá WhatsApp para confirmar los detalles con la empresa.
                        </p>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

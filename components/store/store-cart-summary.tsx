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
import { ShoppingBag, Trash2, Send, Plus, Minus, CreditCard } from "lucide-react";
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
}

export function StoreCartSummary({
    open,
    onOpenChange,
    organization,
    cartItems,
    onUpdateQuantity,
    onClearCart
}: StoreCartSummaryProps) {
    const total = cartItems.reduce((acc, item) => acc + (item.product.base_price * item.quantity), 0);
    const isEmpty = cartItems.length === 0;

    const handleWhatsAppSend = () => {
        const productList = cartItems
            .map(item => `${item.quantity}x ${item.product.name} (${formatCLP(item.product.base_price * item.quantity)})`)
            .join("\n");

        const message = encodeURIComponent(
            `Hola ${organization.name}, me interesa cotizar los siguientes productos:\n\n${productList}\n\n*Total estimado: ${formatCLP(total)}*`
        );

        const phone = organization.whatsapp?.replace(/\D/g, '') || '';
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md bg-white dark:bg-slate-900 border-none p-0 flex flex-col h-full rounded-l-[3rem]">
                <SheetHeader className="p-8 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                            <span className="bg-primary/10 text-primary p-2.5 rounded-2xl">
                                <ShoppingBag className="w-6 h-6" />
                            </span>
                            Mi Pedido
                        </SheetTitle>
                        {!isEmpty && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearCart}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Borrar todo
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                <div className="flex-1 px-8 overflow-y-auto">
                    {isEmpty ? (
                        <div className="py-20 flex flex-col items-center justify-center opacity-20 text-center">
                            <ShoppingBag className="w-20 h-20 mb-4" />
                            <p className="text-xl font-black uppercase tracking-widest leading-tight">
                                Tu carro está<br />vacío
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6 py-8">
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="group flex gap-4 bg-gray-50/50 dark:bg-slate-800/30 p-4 rounded-3xl transition-all hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 flex-shrink-0">
                                        {item.product.image_urls?.[0] ? (
                                            <Image
                                                src={item.product.image_urls[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20 bg-gray-100">
                                                <ShoppingBag className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-black text-sm text-gray-900 dark:text-white line-clamp-1 leading-tight mb-0.5">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-xs font-bold text-primary italic">
                                                {formatCLP(item.product.base_price)} c/u
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-slate-800">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-black text-gray-900 dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <span className="font-black text-gray-900 dark:text-white italic">
                                                {formatCLP(item.product.base_price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <SheetFooter className="p-8 bg-gray-50/50 dark:bg-slate-800/20 border-t border-gray-100 dark:border-slate-800 rounded-tl-[3rem] mt-auto">
                    <div className="w-full space-y-6">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Estimado</span>
                                <span className="text-[9px] font-bold text-gray-400">CLP • IMPUESTOS INCL.</span>
                            </div>
                            <span className="text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">
                                {formatCLP(total)}
                            </span>
                        </div>

                        <Button
                            disabled={isEmpty}
                            onClick={handleWhatsAppSend}
                            className="w-full h-16 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 rounded-[1.5rem] font-black gap-3 text-lg transition-transform active:scale-95 flex items-center justify-center"
                        >
                            <Send className="w-6 h-6" />
                            Enviar a WhatsApp
                        </Button>

                        <p className="text-[10px] text-center font-bold text-gray-400 uppercase italic px-4">
                            * Al enviar, se abrirá tu WhatsApp para confirmar los detalles de la cotización con la empresa.
                        </p>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

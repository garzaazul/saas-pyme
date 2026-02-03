"use client";

import { Product } from "@/types/products";
import { formatCLP } from "@/lib/currency";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StoreProductCardProps {
    product: Product & { categories: { name: string } | null };
    quantity: number;
    onUpdateQuantity: (id: string, delta: number) => void;
    showIva?: boolean;
}

export function StoreProductCard({ product, quantity, onUpdateQuantity, showIva = false }: StoreProductCardProps) {
    const hasImage = product.image_urls && product.image_urls.length > 0;
    const displayedPrice = showIva ? Math.round(product.base_price * 1.19) : product.base_price;

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-4 transition-all hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none flex flex-col h-full">
            {/* Image Section */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800 mb-4">
                {hasImage ? (
                    <Image
                        src={product.image_urls[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                        <ShoppingBag className="w-12 h-12 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Sin imagen</span>
                    </div>
                )}

                {product.categories?.name && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-sm">
                        {product.categories.name}
                    </span>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
                <h3 className="text-base font-black tracking-tight text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                    {product.name}
                </h3>
                {product.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed italic">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                            {showIva ? "IVA incluido" : "Precio Neto"}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black italic tracking-tighter text-primary leading-none">
                                {formatCLP(displayedPrice)}
                            </span>
                            {!showIva && (
                                <span className="text-[10px] font-bold text-gray-400 italic font-sans">+ IVA</span>
                            )}
                        </div>
                    </div>

                    {quantity > 0 ? (
                        <div className="flex items-center gap-2 bg-primary/5 rounded-xl p-1.5 border border-primary/10">
                            <button
                                onClick={() => onUpdateQuantity(product.id, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-primary shadow-sm hover:bg-primary hover:text-white transition-all scale-animation"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center text-sm font-black text-primary">
                                {quantity}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(product.id, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-primary shadow-sm hover:bg-primary hover:text-white transition-all scale-animation"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

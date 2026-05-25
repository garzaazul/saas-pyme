"use client";

import { Product } from "@/types/products";
import { formatCLP } from "@/lib/currency";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StoreProductCardProps {
    product: Product & { product_categories?: any[] };
    quantity: number;
    onUpdateQuantity: (id: string, delta: number) => void;
    showIva?: boolean;
}

export function StoreProductCard({ product, quantity, onUpdateQuantity, showIva = false }: StoreProductCardProps) {
    const hasImage = product.image_urls && product.image_urls.length > 0;
    const displayedPrice = showIva ? Math.round(product.base_price * 1.19) : product.base_price;

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-2xl shadow-md hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-none transition-all duration-300 flex flex-col h-full overflow-hidden">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-slate-800">
                {hasImage ? (
                    <Image
                        src={product.image_urls[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                        <ShoppingBag className="w-12 h-12 mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sin imagen</span>
                    </div>
                )}

                {product.product_categories?.[0]?.categories?.name && (
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[9px] font-semibold uppercase tracking-wider">
                        {product.product_categories[0].categories.name}
                        {product.product_categories.length > 1 && ` +${product.product_categories.length - 1}`}
                    </span>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-4">
                <h3 className="text-base font-bold tracking-tight text-gray-900 dark:text-white mb-1 line-clamp-2 leading-snug">
                    {product.name}
                </h3>
                {product.description && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mb-4 leading-relaxed italic">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto pt-4 flex items-end justify-between gap-3">
                    {/* Price */}
                    <div className="flex flex-col gap-1">
                        <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide w-fit",
                            showIva
                                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        )}>
                            {showIva ? "IVA incluido" : "Precio Neto"}
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                                {formatCLP(displayedPrice)}
                            </span>
                            {!showIva && (
                                <span className="text-[10px] font-semibold text-gray-400">+ IVA</span>
                            )}
                        </div>
                    </div>

                    {/* Cart Control */}
                    {quantity > 0 ? (
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-slate-800 rounded-xl p-1 border border-gray-100 dark:border-slate-700">
                            <button
                                onClick={() => onUpdateQuantity(product.id, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 dark:bg-slate-700 text-white hover:bg-gray-700 transition-colors"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-black text-gray-900 dark:text-white">
                                {quantity}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(product.id, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 dark:bg-slate-700 text-white hover:bg-gray-700 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-200 dark:shadow-none hover:shadow-lg hover:shadow-blue-300/40 transition-all active:scale-95"
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

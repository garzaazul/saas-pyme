"use client";

import { useState, useMemo } from "react";
import { Organization } from "@/types/organizations";
import { Product } from "@/types/products";
import { Category } from "@/types/categories";
import { StoreHeader } from "@/components/store/store-header";
import { StoreProductCard } from "@/components/store/store-product-card";
import { StoreCartSummary } from "@/components/store/store-cart-summary";
import { StoreFooter } from "@/components/store/store-footer";
import { ShoppingBag, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StoreViewProps {
    organization: Organization;
    products: (Product & { categories: { name: string } | null })[];
    categories: Category[];
}

export function StoreView({ organization, products, categories }: StoreViewProps) {
    const [cart, setCart] = useState<{ [id: string]: number }>({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => {
            const current = prev[id] || 0;
            const next = current + delta;
            if (next <= 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: next };
        });
    };

    const clearCart = () => setCart({});

    const cartItems = useMemo(() => {
        return Object.entries(cart).map(([id, quantity]) => {
            const product = products.find(p => p.id === id);
            return { product: product!, quantity };
        });
    }, [cart, products]);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.base_price * item.quantity), 0);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || p.category_id === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-slate-950 flex flex-col font-sans">
            <StoreHeader
                organization={organization}
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
            />

            <main className="flex-1">
                {/* Hero / Banner - Compacted */}
                <section className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 md:py-10">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-tight mb-2">
                                Explora nuestro catálogo digital
                            </h2>
                            <p className="text-sm md:text-base text-muted-foreground font-medium italic">
                                {organization.description || "Encuentra lo que necesitas y cotiza directamente por WhatsApp."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters & Search */}
                <section className="sticky top-20 z-40 bg-neutral-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="¿Qué estás buscando?..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 h-12 rounded-xl border-gray-200 bg-white dark:bg-slate-800 focus:ring-primary/20 shadow-sm"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                <Button
                                    variant={selectedCategory === null ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(null)}
                                    className="rounded-xl h-12 px-6 font-bold"
                                >
                                    Todos
                                </Button>
                                {categories.map(cat => (
                                    <Button
                                        key={cat.id}
                                        variant={selectedCategory === cat.id ? "default" : "outline"}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className="rounded-xl h-12 px-6 font-bold whitespace-nowrap"
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid */}
                <section className="py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8">
                        {filteredProducts.length === 0 ? (
                            <div className="py-24 flex flex-col items-center justify-center opacity-20 text-center">
                                <ShoppingBag className="w-16 h-16 mb-4" />
                                <p className="text-lg font-black uppercase tracking-widest">No hay productos que coincidan</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map(product => (
                                    <StoreProductCard
                                        key={product.id}
                                        product={product}
                                        quantity={cart[product.id] || 0}
                                        onUpdateQuantity={updateQuantity}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <StoreFooter organization={organization} />

            {/* Cart Sheet */}
            <StoreCartSummary
                open={isCartOpen}
                onOpenChange={setIsCartOpen}
                organization={organization}
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onClearCart={clearCart}
            />

            {/* Sticky Floating Total (Mobile/Desktop) */}
            {cartCount > 0 && !isCartOpen && (
                <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none flex justify-center">
                    <div className="max-w-7xl w-full px-4 sm:px-8 flex justify-center md:justify-end">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="bg-primary text-white px-8 py-5 rounded-full shadow-2xl shadow-primary/40 flex items-center gap-4 transition-transform active:scale-95 group pointer-events-auto"
                        >
                            <div className="relative">
                                <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" />
                                <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            </div>
                            <div className="h-6 w-px bg-white/20" />
                            <div className="flex flex-col items-start leading-none gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Ver pedido</span>
                                <span className="text-xl font-black italic tracking-tighter">
                                    ${cartTotal.toLocaleString("es-CL")}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

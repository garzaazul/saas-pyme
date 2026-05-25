"use client";

import { useState, useMemo } from "react";
import { Organization } from "@/types/organizations";
import { Product } from "@/types/products";
import { Category } from "@/types/categories";
import { StoreHeader } from "@/components/store/store-header";
import { StoreProductCard } from "@/components/store/store-product-card";
import { StoreCartSummary } from "@/components/store/store-cart-summary";
import { StoreFooter } from "@/components/store/store-footer";
import { ShoppingBag, Search, Filter, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StoreViewProps {
    organization: Organization;
    products: (Product & { product_categories: any[] })[];
    categories: Category[];
}

export function StoreView({ organization, products, categories }: StoreViewProps) {
    const [cart, setCart] = useState<{ [id: string]: number }>({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const showIva = organization.show_tax_in_catalog;

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
    const cartTotal = cartItems.reduce((acc, item) => {
        const price = showIva ? Math.round(item.product.base_price * 1.19) : item.product.base_price;
        return acc + (price * item.quantity);
    }, 0);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Requisito: "Todos" solo muestra productos con al menos una categoría
            // Filtro específico verifica si el ID está incluido en el array de categorías del producto
            const hasCategories = (p.category_ids || []).length > 0;
            const matchesCategory = selectedCategory
                ? p.category_ids?.includes(selectedCategory)
                : hasCategories;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col font-sans">
            <StoreHeader
                organization={organization}
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
            />

            <main className="flex-1">
                {/* Hero / Banner */}
                <section
                    className="border-b border-gray-100 dark:border-slate-800"
                    style={{
                        backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                        backgroundColor: "#ffffff",
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-14">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-tight mb-3">
                                Explora nuestro{" "}
                                <span className="text-blue-600">catálogo</span>{" "}
                                digital
                            </h2>
                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                                {organization.description || "Encuentra lo que necesitas y cotiza directamente por WhatsApp."}
                            </p>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {filteredProducts.length} {filteredProducts.length === 1 ? "producto disponible" : "productos disponibles"}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters & Search */}
                <section className="sticky top-16 md:top-20 z-40 bg-white dark:bg-slate-950 py-3 border-b border-gray-100 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                    placeholder="¿Qué estás buscando?..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 h-11 rounded-full border-gray-300 bg-white dark:bg-slate-800 focus:border-blue-400 focus:ring-blue-100 shadow-none"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`h-11 px-5 rounded-full font-bold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                                        selectedCategory === null
                                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    Todos
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`h-11 px-5 rounded-full font-bold text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                                            selectedCategory === cat.id
                                                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid */}
                <section className="py-8 md:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8">
                        {filteredProducts.length === 0 ? (
                            <div className="py-24 flex flex-col items-center justify-center opacity-20 text-center">
                                <ShoppingBag className="w-16 h-16 mb-4" />
                                <p className="text-lg font-black uppercase tracking-widest">No hay productos que coincidan</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? "resultado" : "resultados"}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {filteredProducts.map(product => (
                                        <StoreProductCard
                                            key={product.id}
                                            product={product}
                                            quantity={cart[product.id] || 0}
                                            onUpdateQuantity={updateQuantity}
                                            showIva={showIva}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>

            <StoreFooter organization={organization} />

            {/* Floating WhatsApp Contact Button (Direct Chat) */}
            <a
                href={`https://wa.me/${organization.whatsapp?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 shadow-green-500/20 flex items-center justify-center group"
                title="Contactar por WhatsApp"
            >
                <MessageCircle className="w-7 h-7" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm px-0 group-hover:pl-3">
                    ¿Te ayudo?
                </span>
            </a>

            {/* Cart Sheet */}
            <StoreCartSummary
                open={isCartOpen}
                onOpenChange={setIsCartOpen}
                organization={organization}
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onClearCart={clearCart}
                showIva={showIva}
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
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                    Ver pedido {showIva ? "(con IVA)" : "(Neto)"}
                                </span>
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

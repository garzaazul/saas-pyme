import Link from "next/link";
import { Organization } from "@/types/organizations";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface StoreHeaderProps {
    organization: Organization;
    cartCount: number;
    onCartClick: () => void;
}

export function StoreHeader({ organization, cartCount, onCartClick }: StoreHeaderProps) {
    const hasLogo = !!organization.logo_url;

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-100/80 dark:border-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 md:h-20 flex items-center justify-between">
                <Link href="#" className="flex items-center gap-4 group">
                    {hasLogo ? (
                        <div className="relative h-10 w-auto min-w-[50px] flex items-center">
                            <img
                                src={organization.logo_url!}
                                alt={organization.name}
                                className="h-full max-h-[42px] w-auto object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xl rounded-xl shadow-md shadow-blue-200 dark:shadow-none">
                                {organization.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                                    {organization.name}
                                </h1>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                                    Catálogo Digital
                                </p>
                            </div>
                        </div>
                    )}
                </Link>

                <button
                    onClick={onCartClick}
                    className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-full border font-bold text-sm transition-all
                        ${cartCount > 0
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700"
                            : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:border-gray-400"
                        }`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 ? (
                        <span className="font-black">{cartCount}</span>
                    ) : (
                        <span className="hidden sm:inline">Pedido</span>
                    )}
                </button>
            </div>
        </header>
    );
}

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
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="#" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-primary/5 p-1 transition-transform group-hover:scale-105">
                        {organization.logo_url ? (
                            <Image
                                src={organization.logo_url}
                                alt={organization.name}
                                fill
                                className="object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white font-black text-xl rounded-lg">
                                {organization.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tighter text-gray-900 dark:text-white leading-none">
                            {organization.name}
                        </h1>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">
                            Catálogo Digital
                        </p>
                    </div>
                </Link>

                <button
                    onClick={onCartClick}
                    className="relative p-3 rounded-2xl bg-gray-50 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition-all group"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-primary/30 animate-in zoom-in">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
}

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function MobileMenu() {
    const [open, setOpen] = useState(false);

    const handleNavClick = () => setOpen(false);

    return (
        <div className="md:hidden">
            <button
                onClick={() => setOpen(!open)}
                aria-label="Menú"
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
            >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {open && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl z-50 px-5 py-5 flex flex-col">
                    <a
                        href="#funciones"
                        onClick={handleNavClick}
                        className="py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b border-gray-50 transition-colors"
                    >
                        Funciones
                    </a>
                    <a
                        href="#precio"
                        onClick={handleNavClick}
                        className="py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b border-gray-50 transition-colors"
                    >
                        Precio
                    </a>
                    <a
                        href="#contacto"
                        onClick={handleNavClick}
                        className="py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b border-gray-50 transition-colors"
                    >
                        Contacto
                    </a>
                    <div className="mt-4">
                        <Link
                            href="/login"
                            onClick={handleNavClick}
                            className="block w-full text-center py-3 px-5 text-sm font-bold text-[#091226] border border-[#091226]/20 rounded-full hover:bg-[#091226]/5 transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

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
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {open && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50 px-4 py-4 flex flex-col gap-1">
                    <a
                        href="#funciones"
                        onClick={handleNavClick}
                        className="px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        Funciones
                    </a>
                    <a
                        href="#precio"
                        onClick={handleNavClick}
                        className="px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        Precio
                    </a>
                    <a
                        href="#contacto"
                        onClick={handleNavClick}
                        className="px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        Contacto
                    </a>
                    <div className="h-px bg-gray-100 my-2" />
                    <Link
                        href="/login"
                        onClick={handleNavClick}
                        className="px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-center"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            )}
        </div>
    );
}

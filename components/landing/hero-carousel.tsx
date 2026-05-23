"use client";

import { useState, useEffect, useCallback } from "react";

const SLIDES = [
    { src: "/brand/fluxu-dashboard.png",     label: "Dashboard" },
    { src: "/brand/fluxu-cotizaciones.png",  label: "Cotizaciones" },
    { src: "/brand/fluxu-catalogo.png",      label: "Catálogo Público" },
    { src: "/brand/fluxu-productos.png",     label: "Productos" },
    { src: "/brand/fluxu-clientes.png",      label: "Clientes" },
    { src: "/brand/fluxu-empresa.png",       label: "Mi Empresa" },
];

const INTERVAL_MS = 3500;

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    const goTo = useCallback((index: number) => {
        if (transitioning) return;
        setTransitioning(true);
        setTimeout(() => {
            setCurrent(index);
            setTransitioning(false);
        }, 280);
    }, [transitioning]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => {
                const next = (prev + 1) % SLIDES.length;
                setTransitioning(true);
                setTimeout(() => setTransitioning(false), 280);
                return next;
            });
        }, INTERVAL_MS);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full rounded-2xl bg-white border border-gray-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
            {/* Header bar simulado */}
            <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-1.5 flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                <span className="ml-auto text-[10px] font-semibold text-gray-400 uppercase tracking-widest pr-1">
                    {SLIDES[current].label}
                </span>
            </div>

            {/* Imagen — ancho completo, alto automático */}
            <div
                className="w-full transition-opacity duration-[280ms]"
                style={{ opacity: transitioning ? 0 : 1 }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={SLIDES[current].src}
                    alt={`FLUXU — ${SLIDES[current].label}`}
                    className="w-full h-auto block"
                    draggable={false}
                />
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-1.5">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Ver ${SLIDES[i].label}`}
                        className={`rounded-full transition-all duration-300 ${
                            i === current
                                ? "w-5 h-1.5 bg-[#091226]"
                                : "w-1.5 h-1.5 bg-[#091226]/25 hover:bg-[#091226]/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

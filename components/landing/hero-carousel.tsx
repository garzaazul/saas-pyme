"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const SLIDES = [
    { src: "/brand/fluxu-dashboard.png",     alt: "Dashboard FLUXU — resumen y KPIs" },
    { src: "/brand/fluxu-cotizaciones.png",  alt: "Módulo de cotizaciones FLUXU" },
    { src: "/brand/fluxu-catalogo.png",      alt: "Catálogo público FLUXU" },
    { src: "/brand/fluxu-empresa.png",       alt: "Configuración de empresa FLUXU" },
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
        }, 300);
    }, [transitioning]);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            goTo((current + 1) % SLIDES.length);
        }, INTERVAL_MS);
        return () => clearInterval(timer);
    }, [current, goTo]);

    return (
        <div className="relative aspect-[4/3] w-full rounded-2xl bg-white border border-gray-200 shadow-2xl shadow-slate-200/60 overflow-hidden">
            {/* Header bar simulado */}
            <div className="absolute top-0 left-0 right-0 z-10 h-8 bg-gray-50/90 backdrop-blur-sm border-b border-gray-100 flex items-center px-4 gap-1.5 flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                {/* Label slide actual */}
                <span className="ml-auto text-[10px] font-semibold text-gray-400 uppercase tracking-widest pr-1">
                    {SLIDES[current].alt.split("—")[0].trim().replace("FLUXU", "").trim()}
                </span>
            </div>

            {/* Imagen */}
            <div
                className="absolute inset-0 pt-8 transition-opacity duration-300"
                style={{ opacity: transitioning ? 0 : 1 }}
            >
                <Image
                    key={current}
                    src={SLIDES[current].src}
                    alt={SLIDES[current].alt}
                    fill
                    className="object-cover object-top"
                    priority={current === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-1.5">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Ver ${SLIDES[i].alt}`}
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

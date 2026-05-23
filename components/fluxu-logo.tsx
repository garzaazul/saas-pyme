import Image from "next/image";

interface FluxuLogoProps {
    /** "dark" = logo oscuro (para fondos claros) · "white" = logo blanco (para fondos oscuros) */
    variant?: "dark" | "white";
    /** Altura en px — el ancho se ajusta automáticamente con aspect ratio */
    height?: number;
    className?: string;
}

/**
 * Logo oficial de FLUXU.
 * Archivos requeridos en /public:
 *   - logo-dark.png  → logo con texto oscuro (#091226), fondo transparente
 *   - logo-white.png → logo con texto blanco, fondo transparente
 */
export function FluxuLogo({ variant = "dark", height = 34, className = "" }: FluxuLogoProps) {
    const src = variant === "white" ? "/logo-white.png" : "/logo-dark.png";
    const alt = "FLUXU";

    return (
        <Image
            src={src}
            alt={alt}
            width={120}
            height={height}
            className={`h-8 w-auto object-contain ${className}`}
            priority
        />
    );
}

import Image from "next/image";

interface FluxuLogoProps {
    /** "dark" = logo claro (blanco) para fondos oscuros/azules
     *  "light" = logo oscuro (navy #091226) para fondos claros/blancos */
    variant?: "dark" | "light";
    /** Altura en px */
    height?: number;
    className?: string;
}

/**
 * Logo FLUXU — PNG estático servido desde /public/brand/.
 * Archivos:
 *   public/brand/logo-fluxu-bg-dark.png  → logo blanco, para fondos oscuros/navy
 *   public/brand/logo-fluxu-bg-ligth.png → logo navy,   para fondos claros/blancos
 *
 * Aspect ratio original ≈ 4.12 : 1 (3398×825 px)
 */
export function FluxuLogo({ variant = "light", height = 34, className = "" }: FluxuLogoProps) {
    // Aspect ratio del PNG original ≈ 4.12 : 1
    const width = Math.round(height * 4.12);
    const src = variant === "dark"
        ? "/brand/logo-fluxu-bg-dark.png"
        : "/brand/logo-fluxu-bg-ligth.png";

    return (
        <Image
            src={src}
            alt="FLUXU"
            width={width}
            height={height}
            priority
            className={`flex-shrink-0 ${className}`}
        />
    );
}

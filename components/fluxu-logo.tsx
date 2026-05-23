interface FluxuLogoProps {
    /** "dark" = logo oscuro (#091226) para fondos claros
     *  "white" = logo blanco para fondos oscuros */
    variant?: "dark" | "white";
    /** Altura en px */
    height?: number;
    className?: string;
}

/**
 * Logo FLUXU — SVG inline.
 * No requiere archivos en /public.
 * Para reemplazar con el PNG oficial:
 *   1. Coloca logo-dark.png y logo-white.png en /public
 *   2. Sustituye el return por: <Image src={`/logo-${variant}.png`} ... />
 */
export function FluxuLogo({ variant = "dark", height = 34, className = "" }: FluxuLogoProps) {
    const fill = variant === "white" ? "#ffffff" : "#091226";
    const h = height;
    // Aspect ratio del wordmark ≈ 4.2 : 1
    const w = Math.round(h * 4.2);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 420 100"
            width={w}
            height={h}
            className={`flex-shrink-0 ${className}`}
            aria-label="FLUXU"
            role="img"
        >
            {/* ── Ícono "F" estilizado ── */}
            <g fill={fill}>
                {/* Barra vertical izquierda */}
                <rect x="0" y="0" width="18" height="100" rx="4" />
                {/* Barra superior horizontal */}
                <rect x="0" y="0" width="62" height="18" rx="4" />
                {/* Barra media horizontal */}
                <rect x="0" y="41" width="50" height="16" rx="4" />
            </g>

            {/* ── Letras L U X U ── */}
            <text
                x="88"
                y="86"
                fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
                fontSize="96"
                fontWeight="900"
                fill={fill}
                letterSpacing="-2"
            >
                LUXU
            </text>
        </svg>
    );
}

/**
 * Formatea un número a pesos chilenos (CLP)
 * @param amount - Monto a formatear
 * @returns String formateado con separador de miles
 */
export function formatCLP(amount: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Formatea un número a UF (Unidad de Fomento)
 * @param amount - Monto en UF
 * @returns String formateado con 2 decimales
 */
export function formatUF(amount: number): string {
    return `UF ${new Intl.NumberFormat("es-CL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)}`;
}

/**
 * Convierte UF a CLP usando el valor actual de la UF
 * @param ufAmount - Monto en UF
 * @param ufValue - Valor actual de la UF en CLP
 * @returns Monto equivalente en CLP
 */
export function convertUFtoCLP(ufAmount: number, ufValue: number): number {
    return Math.round(ufAmount * ufValue);
}

/**
 * Convierte CLP a UF usando el valor actual de la UF
 * @param clpAmount - Monto en CLP
 * @param ufValue - Valor actual de la UF en CLP
 * @returns Monto equivalente en UF
 */
export function convertCLPtoUF(clpAmount: number, ufValue: number): number {
    return clpAmount / ufValue;
}

// Valor de ejemplo de la UF (debería obtenerse de una API en producción)
export const DEFAULT_UF_VALUE = 38500;

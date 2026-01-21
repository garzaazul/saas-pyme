/**
 * Limpia el RUT de puntos y guiones, y transforma la 'k' en 'K'.
 */
export function cleanRut(rut: string): string {
    return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

/**
 * Formatea un RUT con puntos y guion.
 * Ej: 123456789 -> 12.345.678-9
 */
export function formatRut(rut: string): string {
    const cleaned = cleanRut(rut);
    if (cleaned === "19") return "1-9";
    if (cleaned.length <= 1) return cleaned;

    let result = cleaned.slice(-1);
    let body = cleaned.slice(0, -1);

    if (cleaned.length > 1) {
        result = "-" + result;
    }

    if (body.length > 0) {
        // Add points every 3 digits from right to left
        body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return body + result;
}

/**
 * Valida un RUT chileno usando el algoritmo Módulo 11.
 * Incluye excepción para el RUT "1-9".
 */
export function validateRut(rut: string): boolean {
    const cleaned = cleanRut(rut);

    // Excepción genérica solicitada
    if (cleaned === "19") return true;

    if (cleaned.length < 2) return false;

    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);

    if (!/^\d+$/.test(body)) return false;

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDv = 11 - (sum % 11);
    let dvChar = "";
    if (expectedDv === 11) dvChar = "0";
    else if (expectedDv === 10) dvChar = "K";
    else dvChar = expectedDv.toString();

    return dvChar === dv;
}

/**
 * Normaliza un número de teléfono al formato internacional de WhatsApp (+569XXXXXXXX).
 */
export function normalizePhone(phone: string): string {
    // Eliminar todo lo que no sea número o '+'
    let cleaned = phone.replace(/[^0-9+]/g, "");

    // Casos específicos:
    // Si ya empieza con +569 y tiene el largo correcto (12 caracteres), retornar
    if (cleaned.startsWith("+569") && cleaned.length === 12) return cleaned;

    // Si empieza con 569 y tiene 11 caracteres
    if (cleaned.startsWith("569") && cleaned.length === 11) return "+" + cleaned;

    // Si tiene 9 dígitos y empieza con 9
    if (cleaned.length === 9 && cleaned.startsWith("9")) return "+56" + cleaned;

    // Si tiene 8 dígitos (asumimos que falta el +569)
    if (cleaned.length === 8) return "+569" + cleaned;

    return cleaned;
}

/**
 * Valida si el teléfono cumple con el formato +569XXXXXXXX.
 */
export function isValidChileanMobile(phone: string): boolean {
    return /^\+569\d{8}$/.test(phone);
}

"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#091226] focus:border-transparent transition-all";

const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5";

export function ContactForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        const form = e.currentTarget;
        const data = new FormData(form);

        const payload = {
            name:     (data.get("name")     as string)?.trim() ?? "",
            email:    (data.get("email")    as string)?.trim() ?? "",
            phone:    (data.get("phone")    as string)?.trim() ?? "",
            business: (data.get("business") as string)?.trim() ?? "",
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => ({}));

            if (json.success) {
                setStatus("success");
                form.reset();
            } else {
                setErrorMsg(json.error || "Error al enviar. Intenta de nuevo.");
                setStatus("error");
            }
        } catch {
            setErrorMsg("Sin conexión. Intenta de nuevo.");
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 bg-green-50 rounded-2xl border border-green-100 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-900">¡Recibido!</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Te contactamos en menos de 24 horas para activar tu cuenta.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="name" className={labelClass}>
                        Nombre <span className="text-red-400 normal-case tracking-normal font-bold">*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Juan Pérez"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="email" className={labelClass}>
                        Email <span className="text-red-400 normal-case tracking-normal font-bold">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="juan@ejemplo.cl"
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="phone" className={labelClass}>
                        Teléfono{" "}
                        <span className="text-gray-400 normal-case tracking-normal font-normal">(opcional)</span>
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label htmlFor="business" className={labelClass}>
                        Tu negocio <span className="text-red-400 normal-case tracking-normal font-bold">*</span>
                    </label>
                    <input
                        id="business"
                        name="business"
                        type="text"
                        required
                        placeholder="Mi Empresa SpA"
                        className={inputClass}
                    />
                </div>
            </div>

            {status === "error" && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg}
                </div>
            )}

            {/* Checkbox legal — required */}
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#091226] focus:ring-[#091226] accent-[#091226] cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                    Acepto los{" "}
                    <a href="/terminos" target="_blank" className="text-[#091226] hover:underline font-medium">
                        Términos y Condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="/privacidad" target="_blank" className="text-[#091226] hover:underline font-medium">
                        Política de Privacidad
                    </a>
                </label>
            </div>

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#091226] hover:bg-[#0d1a33] disabled:opacity-60 text-white font-bold text-sm rounded-full transition-all shadow-lg shadow-slate-200 hover:scale-[1.02] active:scale-[0.98]"
            >
                {status === "loading" ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        Solicitar acceso
                    </>
                )}
            </button>

            <p className="text-xs text-center text-gray-400">
                Te contactamos en menos de 24 horas para activar tu cuenta.
            </p>
        </form>
    );
}

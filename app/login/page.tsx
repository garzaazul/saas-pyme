// SEGURIDAD: Registro público desactivado (invite-only).
// Complementar desactivando "Enable Sign Ups" en:
// Supabase Dashboard → Authentication → Providers → Email → Disable Sign Ups
// Esto bloquea signUp() a nivel de API aunque alguien llame al endpoint directo.

"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";
import { FluxuLogo } from "@/components/fluxu-logo";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Crear cliente solo en el cliente (browser)
    const supabase = useMemo(() => {
        if (typeof window === "undefined") return null;
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }, []);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;

        setLoading(true);
        setMessage("");

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            window.location.href = "/dashboard";
        } catch (error: any) {
            setMessage(error.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!supabase) return;

        if (!email.trim()) {
            setMessage("Ingresa tu email para recuperar tu contraseña");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });
            if (error) throw error;
            setMessage("Revisa tu email para restablecer tu contraseña");
        } catch (error: any) {
            setMessage(error.message || "Error al enviar el correo de recuperación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-5">
                        <FluxuLogo variant="dark" height={36} />
                    </div>
                    <CardDescription>
                        Inicia sesión en tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contraseña</label>
                            <Input
                                type="password"
                                placeholder="Tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        {message && (
                            <p
                                className={`text-sm text-center ${
                                    message.includes("Error") || message.includes("Invalid")
                                        ? "text-red-600"
                                        : "text-green-600"
                                }`}
                            >
                                {message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-[#091226] hover:bg-[#0d1a33] text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Mail className="w-4 h-4 mr-2" />
                            )}
                            Iniciar sesión
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            className="text-[#091226] hover:underline"
                            onClick={handleForgotPassword}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

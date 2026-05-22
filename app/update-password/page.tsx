"use client";

import { useState, useEffect, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Loader2 } from "lucide-react";

export default function UpdatePasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    // Mismo patrón de instanciación que login/page.tsx
    const supabase = useMemo(() => {
        if (typeof window === "undefined") return null;
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }, []);

    // Al montar, getSession() procesa los tokens de la URL que Supabase
    // agrega automáticamente en el email de recuperación (#access_token=...).
    useEffect(() => {
        if (!supabase) return;
        supabase.auth.getSession();
    }, [supabase]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;

        // Validación client-side: las contraseñas deben coincidir
        if (newPassword !== confirmPassword) {
            setIsError(true);
            setMessage("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            setIsError(false);
            setMessage("Contraseña actualizada correctamente. Redirigiendo...");

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (error: any) {
            setIsError(true);
            setMessage(error.message || "Error al actualizar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-xl">F</span>
                    </div>
                    <CardTitle className="text-2xl">FLUXU</CardTitle>
                    <CardDescription>
                        Elige una nueva contraseña para tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nueva contraseña</label>
                            <Input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirmar contraseña</label>
                            <Input
                                type="password"
                                placeholder="Repite la contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        {message && (
                            <p
                                className={`text-sm text-center ${
                                    isError ? "text-red-600" : "text-green-600"
                                }`}
                            >
                                {message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <KeyRound className="w-4 h-4 mr-2" />
                            )}
                            Actualizar contraseña
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

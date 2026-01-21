"use client";

import { useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

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
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage("Revisa tu email para confirmar tu cuenta");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = "/dashboard";
            }
        } catch (error: any) {
            setMessage(error.message || "Error al iniciar sesión");
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
                    <CardTitle className="text-2xl">Financier</CardTitle>
                    <CardDescription>
                        {isSignUp ? "Crea tu cuenta" : "Inicia sesión en tu cuenta"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Email Login Form */}
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
                                className={`text-sm text-center ${message.includes("Error") || message.includes("Invalid")
                                        ? "text-red-600"
                                        : "text-green-600"
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
                                <Mail className="w-4 h-4 mr-2" />
                            )}
                            {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp
                                ? "¿Ya tienes cuenta? Inicia sesión"
                                : "¿No tienes cuenta? Regístrate"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

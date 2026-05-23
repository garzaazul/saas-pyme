import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { getProfile } from "@/app/actions/auth";

export const metadata: Metadata = {
    title: "FLUXU — Gestión comercial para PyMEs chilenas",
    description: "El sistema de gestión comercial para PyMEs y emprendimientos en Chile. Cotizaciones, catálogo, clientes — todo en un solo lugar.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const profile = await getProfile();
    const initialTheme = profile?.theme || "light";

    return (
        <html lang="es" suppressHydrationWarning className={initialTheme}>
            <body className="antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-right" richColors closeButton />
                </ThemeProvider>
            </body>
        </html>
    );
}

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { getProfile } from "@/app/actions/auth";

export const metadata: Metadata = {
    title: "SaaS B2B - Gestión Operativa",
    description: "Sistema de gestión operativa para Pymes",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const profile = await getProfile();
    const initialTheme = profile?.theme || "system";

    return (
        <html lang="es" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme={profile?.theme || "light"}
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-right" richColors closeButton />
                </ThemeProvider>
            </body>
        </html>
    );
}

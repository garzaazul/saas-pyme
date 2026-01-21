import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SaaS B2B - Gestión Operativa",
    description: "Sistema de gestión operativa para Pymes",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
}

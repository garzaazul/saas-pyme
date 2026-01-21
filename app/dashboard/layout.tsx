"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // TODO: Obtener datos reales del usuario y organización desde Supabase
    const mockOrganization = "Mi Empresa SpA";
    const mockUser = {
        name: "Carlos González",
        email: "carlos@miempresa.cl",
        avatarUrl: undefined,
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <Header
                    organizationName={mockOrganization}
                    userName={mockUser.name}
                    userEmail={mockUser.email}
                    userAvatarUrl={mockUser.avatarUrl}
                    onSignOut={signOut}
                />

                {/* Page Content */}
                <main
                    className={cn(
                        "flex-1 overflow-y-auto p-6 transition-all duration-300"
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}

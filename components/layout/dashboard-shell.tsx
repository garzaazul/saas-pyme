"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { signOut } from "@/app/actions/auth";

interface DashboardShellProps {
    children: React.ReactNode;
    organizationName: string;
    userName: string;
    userEmail: string;
    userAvatarUrl?: string;
}

export function DashboardShell({
    children,
    organizationName,
    userName,
    userEmail,
    userAvatarUrl,
}: DashboardShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            {/* Sidebar */}
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                {/* Subtle Background Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

                {/* Header */}
                <Header
                    organizationName={organizationName}
                    userName={userName}
                    userEmail={userEmail}
                    userAvatarUrl={userAvatarUrl}
                    onSignOut={signOut}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

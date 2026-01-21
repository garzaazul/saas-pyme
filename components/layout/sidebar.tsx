"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    ShoppingCart,
    Receipt,
    Package,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/quotes", label: "Cotizaciones", icon: FileText },
    { href: "/dashboard/sales", label: "Ventas", icon: ShoppingCart },
    { href: "/dashboard/expenses", label: "Gastos", icon: Receipt },
    { href: "/dashboard/products", label: "Productos", icon: Package },
    { href: "/dashboard/clients", label: "Clientes", icon: Users },
    { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            <aside
                className={cn(
                    "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                {/* Logo */}
                <div className="flex items-center h-16 px-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900">Financier</span>
                                <span className="text-xs text-gray-500">Cash Flow Manager</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        const linkContent = (
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {!collapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        );

                        if (collapsed) {
                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>{item.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return <div key={item.href}>{linkContent}</div>;
                    })}
                </nav>

                {/* Toggle Button */}
                <div className="p-2 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                        className="w-full justify-center"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </aside>
        </TooltipProvider>
    );
}

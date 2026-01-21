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
                    "flex flex-col h-screen bg-white dark:bg-slate-950 border-r border-gray-200/60 dark:border-slate-800/60 transition-all duration-300 z-50",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                {/* Logo Section */}
                <div className="flex items-center h-16 px-5 border-b border-gray-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="text-white font-bold text-lg">F</span>
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-none text-lg">Financier</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">SaaS Operativo</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        const linkContent = (
                            <Link
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                                    isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-900"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                                )} />
                                {!collapsed && (
                                    <span className="font-semibold text-[0.925rem]">{item.label}</span>
                                )}
                                {isActive && !collapsed && (
                                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                                )}
                            </Link>
                        );

                        if (collapsed) {
                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                                    <TooltipContent side="right" className="bg-slate-900 text-white border-none">
                                        <p className="font-medium text-xs">{item.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return <div key={item.href}>{linkContent}</div>;
                    })}
                </nav>

                {/* Toggle & Footer Section */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800/60 bg-gray-50/50 dark:bg-slate-900/20">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                        className="w-full justify-center hover:bg-white dark:hover:bg-slate-800 shadow-none hover:shadow-sm transition-all"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                        ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-xs font-medium">Contraer menú</span>
                            </div>
                        )}
                    </Button>
                </div>
            </aside>
        </TooltipProvider>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Package,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Tag,
    Building2,
} from "lucide-react";
// PLAN SUPERIOR — ShoppingCart y Receipt se reactivarán cuando se habilite
// el módulo de control financiero (Ventas y Gastos).
// import { ShoppingCart, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FluxuLogo } from "@/components/fluxu-logo";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/quotes", label: "Cotizaciones", icon: FileText },
    // PLAN SUPERIOR — descomentar cuando se active el módulo de control financiero
    // { href: "/dashboard/sales", label: "Ventas", icon: ShoppingCart },
    // { href: "/dashboard/expenses", label: "Gastos", icon: Receipt },
    { href: "/dashboard/products", label: "Productos", icon: Package },
    { href: "/dashboard/categories", label: "Categorías", icon: Tag },
    { href: "/dashboard/clients", label: "Clientes", icon: Users },
    { href: "/dashboard/mi-empresa", label: "Mi Empresa", icon: Building2 },
    { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            <aside
                className={cn(
                    "flex flex-col h-screen bg-[#091226] border-r border-white/5 transition-all duration-300 z-50 shadow-2xl",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                {/* Logo Section */}
                <div className="flex items-center h-16 px-5 border-b border-white/5 bg-[#091226]/80 backdrop-blur-xl">
                    {collapsed ? (
                        /* Modo colapsado: solo la "F" del logo (crop del logo) */
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <span className="text-white font-black text-lg italic">F</span>
                        </div>
                    ) : (
                        <FluxuLogo variant="white" height={28} className="max-w-[110px]" />
                    )}
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar bg-[#091226]">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        const linkContent = (
                            <Link
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden",
                                    isActive
                                        ? "bg-white/10 text-white shadow-inner"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                                )} />
                                {!collapsed && (
                                    <span className={cn(
                                        "font-bold text-[0.875rem] tracking-tight",
                                        isActive ? "text-white" : ""
                                    )}>{item.label}</span>
                                )}
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-white/80 rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
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
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                        className="w-full justify-center hover:bg-white/5 text-slate-400 hover:text-white transition-all rounded-xl h-10"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-black tracking-widest">Contraer Menú</span>
                            </div>
                        )}
                    </Button>
                </div>
            </aside>
        </TooltipProvider>
    );
}

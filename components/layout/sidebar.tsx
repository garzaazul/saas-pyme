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
    Tag,
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
    { href: "/dashboard/categories", label: "Categorías", icon: Tag },
    { href: "/dashboard/clients", label: "Clientes", icon: Users },
    { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            <aside
                className={cn(
                    "flex flex-col h-screen bg-slate-950 border-r border-slate-800/60 transition-all duration-300 z-50 shadow-2xl",
                    collapsed ? "w-16" : "w-64"
                )}
            >
                {/* Logo Section */}
                <div className="flex items-center h-16 px-5 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                            <span className="text-white font-black text-lg tracking-tighter">F</span>
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col">
                                <span className="font-black text-white tracking-tighter leading-none text-xl italic">Financier</span>
                                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-400 mt-1.5 opacity-80">SaaS Pyme Core</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar bg-slate-950">
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
                                        ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white shadow-inner"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                                )} />
                                {!collapsed && (
                                    <span className={cn(
                                        "font-bold text-[0.875rem] tracking-tight",
                                        isActive ? "text-white" : ""
                                    )}>{item.label}</span>
                                )}
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
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
                <div className="p-4 border-t border-slate-800/60 bg-slate-900/40">
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

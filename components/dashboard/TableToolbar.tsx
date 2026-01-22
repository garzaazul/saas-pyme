"use client";

import React from "react";
import { Plus, Search, FileText, Download, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TabOption {
    key: string;
    label: string;
    count: number;
}

interface TableToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    activeTab: string;
    onTabChange: (value: string) => void;
    tabOptions: TabOption[];
    itemsPerPage: string;
    onItemsPerPageChange: (value: string) => void;
    onExportExcel: () => void;
    onExportPDF: () => void;
    children?: React.ReactNode; // For the main action button (e.g., "Nuevo Cliente")
    placeholder?: string;
}

export function TableToolbar({
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange,
    tabOptions,
    itemsPerPage,
    onItemsPerPageChange,
    onExportExcel,
    onExportPDF,
    children,
    placeholder = "Buscar..."
}: TableToolbarProps) {
    return (
        <div className="p-6 border-b border-gray-50 dark:border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Tabs with Badges */}
                <Tabs value={activeTab} onValueChange={onTabChange} className="w-full md:w-auto">
                    <TabsList className="bg-gray-100 dark:bg-slate-800 p-1 rounded-xl h-auto">
                        {tabOptions.map((tab) => (
                            <TabsTrigger
                                key={tab.key}
                                value={tab.key}
                                className="rounded-lg py-2 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm transition-all gap-2"
                            >
                                <span className="font-bold text-xs">{tab.label}</span>
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-none font-bold text-[10px] py-0 px-1.5 h-4 min-w-[20px] justify-center"
                                >
                                    {tab.count}
                                </Badge>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Right: Actions Group */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px] md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder={placeholder}
                            className="pl-10 rounded-xl bg-gray-50 dark:bg-slate-800 border-none h-10 text-xs font-medium"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>

                    {/* Density Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filas:</span>
                        <Select value={itemsPerPage} onValueChange={onItemsPerPageChange}>
                            <SelectTrigger className="w-[70px] h-10 rounded-xl border-none bg-gray-50 dark:bg-slate-800 font-bold text-xs ring-0 focus:ring-1 focus:ring-primary/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none premium-shadow bg-white dark:bg-slate-900">
                                <SelectItem value="10" className="font-bold text-xs">10</SelectItem>
                                <SelectItem value="25" className="font-bold text-xs">25</SelectItem>
                                <SelectItem value="50" className="font-bold text-xs">50</SelectItem>
                                <SelectItem value="100" className="font-bold text-xs">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Export Button */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-10 px-4 rounded-xl border-none bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 font-bold text-xs gap-2 transition-all active:scale-95">
                                <Download className="w-4 h-4 text-primary" />
                                <span>Exportar</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl premium-shadow border-none overflow-hidden p-1 w-40 bg-white dark:bg-slate-900">
                            <DropdownMenuItem onSelect={onExportExcel} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer gap-2 focus:bg-primary/5 focus:text-primary">
                                <FileText className="w-4 h-4 text-green-600" />
                                Excel Nativo
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={onExportPDF} className="rounded-lg font-bold text-xs py-2.5 cursor-pointer gap-2 focus:bg-primary/5 focus:text-primary">
                                <Printer className="w-4 h-4 text-red-600" />
                                Reporte PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Main Action (e.g. "+ Nuevo") */}
                    {children}
                </div>
            </div>
        </div>
    );
}

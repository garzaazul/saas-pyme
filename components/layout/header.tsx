"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, User } from "lucide-react";

interface HeaderProps {
    organizationName: string;
    userEmail?: string;
    userName?: string;
    userAvatarUrl?: string;
    onSignOut?: () => void;
}

export function Header({
    organizationName,
    userEmail,
    userName,
    userAvatarUrl,
    onSignOut,
}: HeaderProps) {
    const initials = userName
        ? userName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-800/50">
            {/* Organization Name */}
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    {organizationName}
                </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-slate-900 rounded-full transition-all">
                    <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-slate-950" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-3 px-1 py-1 hover:bg-transparent group"
                        >
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">
                                    {userName || "Usuario"}
                                </span>
                                <span className="text-[10px] font-medium text-gray-400 mt-0.5">
                                    Pro Plan
                                </span>
                            </div>
                            <Avatar className="w-9 h-9 border-2 border-white dark:border-slate-800 shadow-sm group-hover:border-primary/50 transition-all">
                                <AvatarImage src={userAvatarUrl} alt={userName} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 shadow-2xl dark:bg-slate-950 border-gray-200 dark:border-slate-800">
                        <DropdownMenuLabel className="p-4 pt-2">
                            <div className="flex flex-col space-y-2">
                                <p className="text-sm font-bold leading-none text-gray-900 dark:text-gray-100">{userName}</p>
                                <p className="text-xs leading-none text-gray-500">
                                    {userEmail}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-100 dark:bg-slate-800" />
                        <div className="py-1">
                            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                                <User className="mr-3 h-4 w-4 text-gray-500" />
                                <span className="font-medium">Mi Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
                                <Settings className="mr-3 h-4 w-4 text-gray-500" />
                                <span className="font-medium">Configuración</span>
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator className="bg-gray-100 dark:bg-slate-800" />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500 rounded-lg py-2 mt-1 cursor-pointer" onClick={onSignOut}>
                            <LogOut className="mr-3 h-4 w-4" />
                            <span className="font-bold">Cerrar Sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

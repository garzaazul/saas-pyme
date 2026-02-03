import { Organization } from "@/types/organizations";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

interface StoreFooterProps {
    organization: Organization;
}

export function StoreFooter({ organization }: StoreFooterProps) {
    return (
        <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pt-16 pb-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <h3 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                            {organization.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
                            {organization.description || "Simplificando la gestión de tu pyme."}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Contacto</h4>
                        <div className="space-y-4">
                            {organization.whatsapp && (
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
                                    <span className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm"><Phone className="w-4 h-4 text-primary" /></span>
                                    {organization.whatsapp}
                                </div>
                            )}
                            {organization.email && (
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
                                    <span className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm"><Mail className="w-4 h-4 text-primary" /></span>
                                    {organization.email}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Redes Sociales</h4>
                        <div className="flex gap-4">
                            {organization.instagram_url && (
                                <a href={organization.instagram_url} target="_blank" className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm hover:text-primary transition-all">
                                    <Instagram className="w-6 h-6" />
                                </a>
                            )}
                            {organization.facebook_url && (
                                <a href={organization.facebook_url} target="_blank" className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm hover:text-primary transition-all">
                                    <Facebook className="w-6 h-6" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 dark:border-slate-800 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        © {new Date().getFullYear()} {organization.name} • Potenciado por <span className="text-primary italic">Financier</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

import { Organization } from "@/types/organizations";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

interface StoreFooterProps {
    organization: Organization;
}

export function StoreFooter({ organization }: StoreFooterProps) {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pt-12 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Col 1 — Brand */}
                    <div className="space-y-3">
                        {organization.logo_url ? (
                            <img
                                src={organization.logo_url}
                                alt={organization.name}
                                className="h-10 w-auto object-contain mb-1"
                            />
                        ) : (
                            <div className="flex items-center gap-2.5 mb-1">
                                <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-base rounded-lg">
                                    {organization.name.charAt(0)}
                                </div>
                                <span className="text-lg font-black tracking-tighter text-gray-900 dark:text-white">
                                    {organization.name}
                                </span>
                            </div>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                            {organization.description || "Simplificando la gestión de tu PyME."}
                        </p>
                    </div>

                    {/* Col 2 — Contacto */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Contacto</h4>
                        <div className="space-y-3">
                            {organization.whatsapp && (
                                <a
                                    href={`https://wa.me/${organization.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors group"
                                >
                                    <Phone className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                    {organization.whatsapp}
                                </a>
                            )}
                            {organization.email && (
                                <a
                                    href={`mailto:${organization.email}`}
                                    className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors group"
                                >
                                    <Mail className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                                    {organization.email}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Col 3 — Redes sociales */}
                    <div className="space-y-4">
                        {(organization.instagram_url || organization.facebook_url) && (
                            <>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Redes Sociales</h4>
                                <div className="flex gap-3">
                                    {organization.instagram_url && (
                                        <a
                                            href={organization.instagram_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-pink-600 hover:border-pink-200 hover:scale-110 transition-all"
                                        >
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    )}
                                    {organization.facebook_url && (
                                        <a
                                            href={organization.facebook_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:scale-110 transition-all"
                                        >
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} {organization.name}. Todos los derechos reservados.
                    </p>
                    <a
                        href="https://fluxu.cl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                    >
                        <span className="font-black">F</span>
                        Potenciado por FLUXU
                    </a>
                </div>
            </div>
        </footer>
    );
}

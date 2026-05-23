import Link from "next/link";
import {
    FileText,
    Globe,
    Users,
    Package,
    LayoutDashboard,
    MessageSquare,
    Building2,
    FileCheck,
    CheckCircle2,
    ArrowRight,
    Phone,
} from "lucide-react";
import { MobileMenu } from "@/components/landing/mobile-menu";
import { ContactForm } from "@/components/landing/contact-form";

const WHATSAPP_URL =
    "https://wa.me/56972420708?text=Hola%2C%20me%20interesa%20FLUXU%20para%20mi%20negocio";

// ---------------------------------------------------------------------------
// Logo inline — ícono F + wordmark, idéntico al sidebar
// ---------------------------------------------------------------------------
function FluxuLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const iconSize = size === "lg" ? "w-10 h-10" : size === "sm" ? "w-7 h-7" : "w-8 h-8";
    const textSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl";

    return (
        <div className="flex items-center gap-2">
            <div className={`${iconSize} rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-200`}>
                <span className="text-white font-black italic" style={{ fontSize: size === "lg" ? "1.25rem" : "1rem" }}>
                    F
                </span>
            </div>
            <span className={`${textSize} font-black italic tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent`}>
                FLUXU
            </span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Feature card
// ---------------------------------------------------------------------------
function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) {
    return (
        <div className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Pain point card
// ---------------------------------------------------------------------------
function PainCard({
    icon: Icon,
    text,
}: {
    icon: React.ElementType;
    text: string;
}) {
    return (
        <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm font-medium text-gray-700 leading-relaxed pt-1">{text}</p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Check list item
// ---------------------------------------------------------------------------
function CheckItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            {text}
        </li>
    );
}

// ---------------------------------------------------------------------------
// PAGE — Server Component
// ---------------------------------------------------------------------------
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 antialiased">

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <FluxuLogo />

                    {/* Nav — desktop */}
                    <nav className="hidden md:flex items-center gap-1">
                        <a href="#funciones" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                            Funciones
                        </a>
                        <a href="#precio" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                            Precio
                        </a>
                        <a href="#contacto" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                            Contacto
                        </a>
                    </nav>

                    {/* CTA + Mobile menu */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden md:inline-flex items-center px-5 py-2 text-sm font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                        <MobileMenu />
                    </div>
                </div>
            </header>

            {/* ── HERO ───────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-white pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-violet-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-blue-700 uppercase tracking-wider mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Precio de lanzamiento — cupos limitados
                    </div>

                    {/* Titular */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-5 leading-tight">
                        Tu negocio,{" "}
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            ordenado y profesional
                        </span>
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-6 leading-relaxed">
                        Gestiona clientes, productos, cotizaciones y muestra tu catálogo
                        público. Todo en un solo lugar, sin complicaciones.
                    </p>

                    {/* Precio */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="text-gray-400 line-through text-sm font-medium">$15.000/mes</span>
                        <span className="text-2xl font-black text-blue-600">$10.000/mes</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                            Primer mes gratis
                        </span>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                        >
                            Quiero probarlo gratis
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#contacto"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-gray-200 hover:border-blue-200 text-gray-700 hover:text-blue-600 font-bold text-sm rounded-2xl transition-all hover:bg-blue-50"
                        >
                            Solicitar acceso
                        </a>
                    </div>

                    {/* Dashboard screenshot placeholder */}
                    <div className="mt-14 relative mx-auto max-w-3xl">
                        <div className="absolute inset-x-0 -bottom-6 h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                        <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50 border border-gray-200 shadow-2xl flex items-center justify-center">
                            <p className="text-sm font-medium text-gray-400">Captura del dashboard · Próximamente</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PROBLEMA ───────────────────────────────────────────────── */}
            <section id="problema" className="py-20 bg-gray-50/70">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                            ¿Te suena esto?
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Problemas comunes que tienen las PyMEs chilenas sin una herramienta adecuada.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PainCard
                            icon={MessageSquare}
                            text="Cotizas por WhatsApp o Word y se te pierden los números"
                        />
                        <PainCard
                            icon={Globe}
                            text="No tienes un catálogo online para mostrar tus productos"
                        />
                        <PainCard
                            icon={Building2}
                            text="Quieres verte profesional pero un ERP es caro y complicado"
                        />
                        <PainCard
                            icon={FileCheck}
                            text="No necesitas facturar, pero sí necesitas orden"
                        />
                    </div>
                </div>
            </section>

            {/* ── FUNCIONES ──────────────────────────────────────────────── */}
            <section id="funciones" className="py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                            Todo lo que necesitas para gestionar tu negocio
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Sin complicaciones, sin exceso de funciones. Solo lo que una PyME realmente usa.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <FeatureCard
                            icon={FileText}
                            title="Cotizaciones profesionales"
                            description="Crea, envía y haz seguimiento. PDF con tu marca y folio automático. Tus clientes te ven serio."
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Catálogo público online"
                            description="Tu vitrina con productos, precios y fotos. Tus clientes te escriben directo por WhatsApp al ver lo que quieren."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Gestión de clientes"
                            description="Tu cartera ordenada: datos, RUT, historial. Todo en un lugar para no buscar en chats ni hojas de cálculo."
                        />
                        <FeatureCard
                            icon={Package}
                            title="Productos y servicios"
                            description="Catálogo interno con categorías, stock básico e imágenes. La base de tus cotizaciones y catálogo público."
                        />
                        <FeatureCard
                            icon={LayoutDashboard}
                            title="Dashboard de gestión"
                            description="Pipeline de cotizaciones, tasa de aceptación, alertas de vencimiento. Tu negocio de un vistazo."
                        />
                        {/* Sexta card — CTA */}
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-blue-200 flex flex-col items-start justify-between hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                                <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white mb-1.5">¿Quieres verlo en acción?</h3>
                                <p className="text-sm text-blue-100 leading-relaxed">
                                    Escríbenos por WhatsApp y te mostramos el sistema en menos de 10 minutos.
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── PRECIO ─────────────────────────────────────────────────── */}
            <section id="precio" className="py-20 bg-gray-50/70">
                <div className="max-w-lg mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                            Un solo plan. Todo incluido.
                        </h2>
                        <p className="text-gray-500">
                            Sin cobros por funciones extras ni sorpresas en la boleta.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-xl shadow-blue-50 overflow-hidden">
                        {/* Header card */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-6 text-center">
                            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                                Lanzamiento — primeros 100 inscritos
                            </span>
                            <div className="flex items-baseline justify-center gap-3 mb-2">
                                <span className="text-blue-200 line-through text-lg font-medium">$15.000/mes</span>
                                <span className="text-4xl font-black text-white">$10.000</span>
                                <span className="text-blue-200 text-sm font-medium">/mes</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-400/20 border border-green-300/30 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                                <span className="text-green-100 text-xs font-bold uppercase tracking-wide">Primer mes gratis</span>
                            </div>
                        </div>

                        {/* Body card */}
                        <div className="px-8 py-8">
                            <ul className="space-y-3 mb-8">
                                <CheckItem text="Cotizaciones ilimitadas con PDF" />
                                <CheckItem text="Catálogo público online" />
                                <CheckItem text="Gestión de clientes" />
                                <CheckItem text="Productos y servicios con imágenes" />
                                <CheckItem text="Dashboard de gestión" />
                                <CheckItem text="Soporte por WhatsApp" />
                                <CheckItem text="Sin contratos — cancela cuando quieras" />
                            </ul>

                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Empezar gratis
                            </a>

                            <p className="text-xs text-center text-gray-400 mt-3">
                                Al activar, tienes 30 días gratis sin cargos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTACTO ───────────────────────────────────────────────── */}
            <section id="contacto" className="py-20">
                <div className="max-w-xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                            ¿Prefieres que te contactemos?
                        </h2>
                        <p className="text-gray-500">
                            Déjanos tus datos y te activamos tu cuenta en menos de 24 horas.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
                        <ContactForm />
                    </div>
                </div>
            </section>

            {/* ── FOOTER ─────────────────────────────────────────────────── */}
            <footer className="bg-slate-900 text-slate-400">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        {/* Logo en oscuro */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                                <span className="text-white font-black italic text-sm">F</span>
                            </div>
                            <span className="text-lg font-black italic text-white tracking-tight">FLUXU</span>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-6 text-sm">
                            <Link href="/terminos" className="hover:text-white transition-colors">
                                Términos
                            </Link>
                            <Link href="/privacidad" className="hover:text-white transition-colors">
                                Privacidad
                            </Link>
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-white transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                +56 9 7242 0708
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
                        © 2026 FLUXU. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

        </div>
    );
}

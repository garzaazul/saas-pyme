import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
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
import { FluxuLogo } from "@/components/fluxu-logo";

// ── Fuente display — carácter sin instalación adicional ─────────────────────
const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

const WHATSAPP_URL =
    "https://wa.me/56972420708?text=Hola%2C%20me%20interesa%20FLUXU%20para%20mi%20negocio";

// FluxuLogo importado desde @/components/fluxu-logo

// ---------------------------------------------------------------------------
// Check list item (sección precio)
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
// Pain row — lista de dolores con dividers
// ---------------------------------------------------------------------------
function PainRow({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
    return (
        <div className="flex items-center gap-4 py-4 group">
            <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-base font-medium text-gray-700 leading-snug">{text}</p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Feature card estándar (bento)
// ---------------------------------------------------------------------------
function FeatureCard({
    icon: Icon,
    title,
    description,
    accent = false,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    accent?: boolean;
}) {
    return (
        <div className={`group p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
            accent
                ? "bg-[#091226]/5 border-[#091226]/10 hover:shadow-md hover:shadow-[#091226]/10"
                : "bg-white border-gray-100 shadow-sm hover:shadow-md"
        }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                accent ? "bg-[#091226]/10 group-hover:bg-[#091226]/15" : "bg-gray-50 group-hover:bg-[#091226]/5"
            }`}>
                <Icon className={`w-4.5 h-4.5 ${accent ? "text-[#091226]" : "text-gray-600 group-hover:text-[#091226]"} transition-colors`} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// PAGE — Server Component
// ---------------------------------------------------------------------------
export default function LandingPage() {
    return (
        <div className={`${jakarta.className} min-h-screen bg-white text-gray-900 antialiased`}>

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <FluxuLogo variant="dark" />

                    {/* Nav desktop — solo color change, sin hover:bg */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#funciones" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            Funciones
                        </a>
                        <a href="#precio" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            Precio
                        </a>
                        <a href="#contacto" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            Contacto
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-full hover:border-[#091226]/30 hover:text-[#091226] transition-colors"
                        >
                            Iniciar sesión
                        </Link>
                        <MobileMenu />
                    </div>
                </div>
            </header>

            {/* ── HERO — layout asimétrico ────────────────────────────────── */}
            <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24">
                {/* Dot grid pattern */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle, #d1d5db 1.5px, transparent 1.5px)",
                        backgroundSize: "28px 28px",
                    }}
                />
                {/* Gradient overlay that fades the dots */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white pointer-events-none" />
                {/* Color wash top-right */}
                <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-gradient-to-bl from-[#091226]/5 via-[#091226]/2 to-transparent pointer-events-none rounded-bl-full" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                    {/* GRID: texto izquierda, mockup derecha */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">

                        {/* ─ Columna izquierda — texto ─ */}
                        <div>
                            {/* Badge — estilo editorial, no pill */}
                            <div className="inline-flex items-center gap-2.5 border border-gray-900 px-3 py-1.5 mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#091226] animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-900">
                                    Precio de lanzamiento — cupos limitados
                                </span>
                            </div>

                            {/* h1 grande, compacto, alineado izquierda */}
                            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-gray-900 leading-[1.08] mb-6">
                                Tu PyME,{" "}
                                <span className="text-[#091226]">
                                    ordenada y<br />profesional
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-gray-500 mb-6 leading-relaxed max-w-md">
                                El sistema de gestión comercial para PyMEs y emprendimientos
                                en Chile. Cotizaciones, catálogo de productos y clientes — todo en un
                                solo lugar.
                            </p>

                            {/* Precio inline */}
                            <div className="flex flex-wrap items-center gap-2.5 mb-8">
                                <span className="text-gray-400 line-through text-sm font-medium">$15.000/mes</span>
                                <span className="text-2xl font-extrabold text-[#091226]">$10.000/mes</span>
                                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wide">
                                    Primer mes gratis
                                </span>
                            </div>

                            {/* CTAs — formulario primario, WhatsApp secundario */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="#contacto"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#091226] hover:bg-[#0d1a33] text-white font-bold text-sm rounded-full shadow-lg shadow-slate-300 transition-all duration-200 hover:scale-105 active:scale-95"
                                >
                                    Solicitar acceso gratis
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold text-sm rounded-full transition-colors duration-200"
                                >
                                    Escríbenos por WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* ─ Columna derecha — mockup ─ */}
                        <div className="order-first lg:order-last">
                            <div className="relative">
                                {/* Blob decorativo detrás */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-[#091226]/10 via-[#091226]/5 to-[#091226]/10 rounded-3xl blur-2xl opacity-60 pointer-events-none" />
                                <div className="relative aspect-[4/3] w-full rounded-2xl bg-white border border-gray-200 shadow-2xl shadow-slate-200/60 flex flex-col items-center justify-center gap-3 overflow-hidden">
                                    {/* Mini header bar simulado */}
                                    <div className="absolute top-0 left-0 right-0 h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                                    </div>
                                    <LayoutDashboard className="w-10 h-10 text-[#091226]/20 mt-6" />
                                    <p className="text-sm font-medium text-gray-400">Captura del dashboard</p>
                                    <p className="text-xs text-gray-300">Próximamente</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PROBLEMA — 2 columnas asimétrico ───────────────────────── */}
            <section id="problema" className="py-20 bg-stone-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">

                        {/* Título — left column */}
                        <div className="lg:pt-2">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-[1.1] mb-4">
                                ¿Te suena<br />esto?
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Si eres PyME o emprendedor en Chile, seguro te ha pasado.
                            </p>
                        </div>

                        {/* Lista de dolores con dividers */}
                        <div className="divide-y divide-stone-200">
                            <PainRow icon={MessageSquare} text="Cotizas por WhatsApp o Word y se te pierden los números" />
                            <PainRow icon={Globe} text="No tienes un catálogo online para mostrar tus productos" />
                            <PainRow icon={Building2} text="Quieres verte profesional pero un ERP es caro y complicado" />
                            <PainRow icon={FileCheck} text="No necesitas facturar, pero sí necesitas orden" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FUNCIONES — bento grid ──────────────────────────────────── */}
            <section id="funciones" className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">

                    {/* Título — izquierda, no centrado */}
                    <div className="mb-10">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-[1.1] mb-3">
                            Todo lo que necesitas<br className="hidden sm:block" />para gestionar tu PyME
                        </h2>
                        <p className="text-gray-500 max-w-lg text-sm leading-relaxed">
                            Diseñado para PyMEs y emprendimientos chilenos. Sin complicaciones, sin funciones que no vas a usar.
                        </p>
                    </div>

                    {/* Bento grid — primera card ocupa 2 de 3 columnas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                        {/* ── Card hero: Cotizaciones — oscura, 2 columnas ── */}
                        <div className="sm:col-span-2 group relative overflow-hidden p-7 bg-slate-950 rounded-2xl">
                            {/* decoración esquina */}
                            <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-white/10 via-white/5 to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                            <div className="relative">
                                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                                    <FileText className="w-5 h-5 text-white/80" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Cotizaciones profesionales</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-sm">
                                    Crea, envía y haz seguimiento. PDF con tu marca y folio automático. Tus clientes te ven serio.
                                </p>
                                {/* Mini preview placeholder */}
                                <div className="w-full h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="text-xs text-slate-600 font-medium">Preview PDF · Próximamente</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Card 2: Catálogo — tono acento ── */}
                        <FeatureCard
                            icon={Globe}
                            title="Catálogo público online"
                            description="Tu vitrina con productos, precios y fotos. Tus clientes te escriben directo por WhatsApp al ver lo que quieren."
                            accent
                        />

                        {/* ── Card 3, 4, 5 — cards normales ── */}
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

                        {/* ── CTA banner — ancho completo ── */}
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sm:col-span-2 md:col-span-3 group flex items-center justify-between px-7 py-5 bg-[#091226] rounded-2xl shadow-lg shadow-slate-300 hover:shadow-xl hover:shadow-slate-300 transition-all duration-200"
                        >
                            <div>
                                <p className="font-bold text-white text-sm">¿Quieres verlo en acción?</p>
                                <p className="text-white/70 text-xs mt-0.5">
                                    Escríbenos por WhatsApp y te mostramos el sistema en menos de 10 minutos.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-white font-bold text-sm ml-6 shrink-0 group-hover:translate-x-1 transition-transform duration-200">
                                Escribir ahora
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── CONTACTO — CTA principal ────────────────────────────────── */}
            <section id="contacto" className="py-24 bg-gradient-to-b from-stone-50 via-[#091226]/[0.03] to-stone-50">
                <div className="max-w-xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        {/* Badge editorial */}
                        <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 border border-[#091226]/20 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#091226]/70">
                                30 días gratis · Sin tarjeta
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                            Solicita tu acceso gratuito
                        </h2>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto">
                            Déjanos tus datos y te activamos tu cuenta con 30 días gratis.
                            Sin tarjeta, sin compromiso.
                        </p>
                    </div>

                    {/* Form card — elevated, no flat */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-slate-200/80 p-8">
                        <ContactForm />
                    </div>

                    {/* Alternativa WhatsApp */}
                    <p className="text-center text-sm text-gray-400 mt-5">
                        ¿Prefieres hablar primero?{" "}
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#091226] font-semibold hover:underline"
                        >
                            Escríbenos por WhatsApp →
                        </a>
                    </p>
                </div>
            </section>

            {/* ── PRECIO — cierre/refuerzo ────────────────────────────────── */}
            <section id="precio" className="py-20 bg-white">
                <div className="max-w-lg mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                            Un solo plan. Todo incluido.
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Pensado para el bolsillo PyME. Sin cobros extras ni sorpresas en la boleta.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-slate-200/80 overflow-hidden">
                        {/* Header card */}
                        <div className="bg-[#091226] px-8 py-7 text-center">
                            <span className="inline-block border border-white/30 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-[0.12em] mb-5">
                                Lanzamiento — primeros 100 inscritos
                            </span>
                            <div className="flex items-baseline justify-center gap-3 mb-3">
                                <span className="text-white/50 line-through text-base font-medium">$15.000/mes</span>
                                <span className="text-4xl font-extrabold text-white">$10.000</span>
                                <span className="text-white/70 text-sm font-medium">/mes</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-400/20 border border-green-300/30 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                                <span className="text-green-100 text-xs font-bold uppercase tracking-wide">Primer mes gratis</span>
                            </div>
                        </div>

                        {/* Body */}
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
                                href="#contacto"
                                className="block w-full text-center px-6 py-3.5 bg-[#091226] hover:bg-[#0d1a33] text-white font-bold text-sm rounded-full shadow-lg shadow-slate-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Solicitar acceso gratis
                            </a>

                            <p className="text-xs text-center text-gray-400 mt-3">
                                Al activar, tienes 30 días gratis sin cargos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ─────────────────────────────────────────────────── */}
            <footer className="bg-[#091226] text-slate-400">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        {/* Logo */}
                        <FluxuLogo variant="white" height={28} />

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

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-600 space-y-1.5">
                        <p>© 2026 FLUXU. Todos los derechos reservados.</p>
                        <p>Hecho en Chile 🇨🇱 para PyMEs y emprendimientos.</p>
                    </div>
                </div>
            </footer>

        </div>
    );
}

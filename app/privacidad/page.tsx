// NOTA: Contenido legal base. Revisar con abogado antes de escalar.
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { FluxuLogo } from "@/components/fluxu-logo";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

// ---------------------------------------------------------------------------
// Sección de artículo legal
// ---------------------------------------------------------------------------
function Article({ number, title, children }: {
    number: number;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">
                <span className="text-[#091226] mr-2">{number}.</span>
                {title}
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-2 pl-5 border-l-2 border-gray-100">
                {children}
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Badge de categoría de dato
// ---------------------------------------------------------------------------
function DataBadge({ label, color = "navy" }: { label: string; color?: "navy" | "amber" | "slate" }) {
    const colors = {
        navy: "bg-[#091226]/5 text-[#091226] border-[#091226]/10",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        slate: "bg-slate-50 text-slate-600 border-slate-200",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
            {label}
        </span>
    );
}

// ---------------------------------------------------------------------------
// PAGE — Server Component
// ---------------------------------------------------------------------------
export default function PrivacidadPage() {
    return (
        <div className={`${jakarta.className} min-h-screen bg-white antialiased`}>

            {/* Header mínimo */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/">
                        <FluxuLogo variant="dark" height={28} />
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </div>
            </header>

            {/* Contenido */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

                {/* Encabezado del documento */}
                <div className="mb-12 pb-8 border-b border-gray-100">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#091226] mb-3">
                        Documento legal
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-3">
                        Política de Privacidad
                    </h1>
                    <p className="text-sm text-gray-400 font-medium">
                        Última actualización: mayo de 2026 · Conforme a Ley 19.628 (Chile)
                    </p>
                </div>

                {/* Introducción */}
                <div className="mb-10 p-5 bg-[#091226]/5 rounded-2xl border border-[#091226]/10">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        En FLUXU nos tomamos en serio la privacidad de las personas. Esta Política de Privacidad describe de manera transparente cómo recopilamos, utilizamos, almacenamos y protegemos los datos personales de quienes utilizan nuestra plataforma, en cumplimiento de la <strong>Ley 19.628 sobre Protección de la Vida Privada</strong> de la República de Chile y sus modificaciones.
                    </p>
                </div>

                {/* Artículos */}
                <div className="space-y-10">

                    <Article number={1} title="Responsable del tratamiento de datos">
                        <p>
                            El responsable del tratamiento de los datos personales es:
                        </p>
                        <div className="mt-2 p-4 bg-stone-50 rounded-xl border border-stone-200 text-sm space-y-1">
                            <p><strong className="text-gray-800">Nombre:</strong> Carlos Garcés Aguilar</p>
                            <p><strong className="text-gray-800">Rol:</strong> Operador del servicio FLUXU</p>
                            <p>
                                <strong className="text-gray-800">Contacto:</strong>{" "}
                                <a href="mailto:carlosgarcesaguilar@gmail.com" className="text-[#091226] hover:underline">
                                    carlosgarcesaguilar@gmail.com
                                </a>
                            </p>
                        </div>
                    </Article>

                    <Article number={2} title="Datos que recopilamos">
                        <p>FLUXU recopila los siguientes tipos de datos, según su origen:</p>

                        <div className="mt-3 space-y-4">
                            {/* Bloque 1 */}
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <DataBadge label="Del usuario de FLUXU" color="navy" />
                                </div>
                                <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-600">
                                    <li>Nombre completo y correo electrónico de acceso.</li>
                                    <li>Contraseña (almacenada en forma encriptada — nunca en texto plano).</li>
                                    <li>Datos de la empresa: nombre o razón social, RUT, giro comercial, teléfono, dirección, logo e imagen de la organización.</li>
                                    <li>Datos de transferencia bancaria (si el usuario los ingresa para mostrarlos en sus cotizaciones).</li>
                                </ul>
                            </div>

                            {/* Bloque 2 */}
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <DataBadge label="De los clientes del usuario" color="amber" />
                                    <span className="text-xs text-gray-400">(tratados por FLUXU como encargado)</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Estos datos son ingresados por el propio usuario de FLUXU. FLUXU los almacena y procesa únicamente para operar el servicio, actuando como <strong>encargado del tratamiento</strong> por cuenta del usuario (quien es el responsable ante sus propios clientes):
                                </p>
                                <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-600">
                                    <li>Razón social o nombre del cliente final.</li>
                                    <li>RUT del cliente final.</li>
                                    <li>Correo electrónico, teléfono y dirección del cliente final.</li>
                                </ul>
                            </div>

                            {/* Bloque 3 */}
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <DataBadge label="Datos de uso del sistema" color="slate" />
                                </div>
                                <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-600">
                                    <li>Acciones realizadas en la plataforma (creación de cotizaciones, navegación entre secciones).</li>
                                    <li>Datos técnicos básicos (tipo de navegador, dirección IP aproximada) para seguridad y diagnóstico.</li>
                                </ul>
                            </div>
                        </div>
                    </Article>

                    <Article number={3} title="Finalidad del tratamiento">
                        <p>Los datos recopilados se utilizan exclusivamente para:</p>
                        <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-600">
                            <li><strong>Operar el servicio:</strong> gestión de cotizaciones, catálogo público, administración de clientes y productos.</li>
                            <li><strong>Comunicaciones del servicio:</strong> notificaciones de cobro, actualizaciones de la plataforma, soporte técnico y avisos de cambios en los términos o en esta política.</li>
                            <li><strong>Mejora del servicio:</strong> análisis agregados y anónimos de uso para identificar áreas de mejora. No se utilizan datos personales identificables para este fin.</li>
                        </ul>
                        <p>
                            FLUXU <strong>no utiliza los datos con fines publicitarios</strong>, ni los cede a terceros para que los usen con esa finalidad.
                        </p>
                    </Article>

                    <Article number={4} title="Base legal del tratamiento">
                        <p>
                            El tratamiento de datos se realiza sobre la base del <strong>consentimiento informado</strong> que el usuario otorga al aceptar estos términos y esta política al momento de la activación de su cuenta. El usuario puede revocar este consentimiento en cualquier momento solicitando la cancelación de su cuenta y la eliminación de sus datos.
                        </p>
                    </Article>

                    <Article number={5} title="Compartición de datos con terceros">
                        <p>
                            FLUXU <strong>no vende, arrienda ni comparte</strong> datos personales con terceros para fines comerciales. Los únicos supuestos en que datos pueden ser accedidos o procesados por terceros son:
                        </p>
                        <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-600">
                            <li>
                                <strong>Supabase (infraestructura):</strong> proveedor de base de datos y autenticación en la nube. Actúa como encargado del tratamiento bajo acuerdo de procesamiento de datos. Los datos se almacenan en servidores seguros.
                            </li>
                            <li>
                                <strong>Pasarela de pago:</strong> solo recibe los datos necesarios para procesar el cobro mensual (datos de la tarjeta). FLUXU no almacena datos de tarjetas de crédito o débito.
                            </li>
                            <li>
                                <strong>Requerimiento legal:</strong> si una autoridad competente chilena lo exige mediante orden judicial o resolución administrativa, FLUXU entregará los datos estrictamente necesarios, notificando al usuario cuando la ley lo permita.
                            </li>
                        </ul>
                    </Article>

                    <Article number={6} title="Seguridad de los datos">
                        <p>Aplicamos las siguientes medidas de seguridad para proteger los datos:</p>
                        <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-600">
                            <li><strong>Cifrado en tránsito:</strong> toda comunicación entre el navegador del usuario y el sistema utiliza HTTPS con certificado TLS.</li>
                            <li><strong>Contraseñas hasheadas:</strong> las contraseñas nunca se almacenan en texto plano. Se utiliza el algoritmo de hashing seguro provisto por Supabase Auth.</li>
                            <li><strong>Aislamiento multi-tenant:</strong> el acceso entre organizaciones está bloqueado tanto a nivel de aplicación como a nivel de base de datos mediante políticas de Row Level Security (RLS), que impiden que un usuario acceda a datos de otra organización.</li>
                            <li><strong>Acceso mínimo:</strong> el equipo técnico de FLUXU accede a los datos solo cuando es estrictamente necesario para soporte o diagnóstico, bajo deber de confidencialidad.</li>
                        </ul>
                        <p>
                            No obstante, ningún sistema es infalible. FLUXU se compromete a notificar a los usuarios afectados en caso de una brecha de seguridad significativa, dentro de los plazos que establezca la legislación vigente.
                        </p>
                    </Article>

                    <Article number={7} title="Retención de datos">
                        <p>
                            Los datos se conservan mientras la cuenta del usuario esté activa. Al cancelar la suscripción, los datos se mantienen por un período de <strong>30 días adicionales</strong> para permitir una eventual reactivación o exportación, tras lo cual son eliminados de forma permanente.
                        </p>
                        <p>
                            El usuario puede solicitar la eliminación anticipada de sus datos enviando un correo a{" "}
                            <a href="mailto:carlosgarcesaguilar@gmail.com" className="text-[#091226] hover:underline">
                                carlosgarcesaguilar@gmail.com
                            </a>
                            . La eliminación se ejecuta en un plazo máximo de <strong>30 días</strong> desde la recepción de la solicitud.
                        </p>
                    </Article>

                    <Article number={8} title="Derechos del titular de los datos">
                        <p>
                            De acuerdo con la <strong>Ley 19.628 de Protección de la Vida Privada</strong> de Chile, el titular de datos personales tiene los siguientes derechos:
                        </p>
                        <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-600">
                            <li><strong>Derecho de información:</strong> conocer qué datos suyos están siendo tratados, con qué finalidad y por cuánto tiempo.</li>
                            <li><strong>Derecho de acceso:</strong> obtener una copia de los datos que FLUXU tiene sobre el titular.</li>
                            <li><strong>Derecho de rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
                            <li><strong>Derecho de cancelación (supresión):</strong> solicitar la eliminación de sus datos cuando ya no sean necesarios o se haya revocado el consentimiento.</li>
                            <li><strong>Derecho de oposición:</strong> oponerse al tratamiento de sus datos en determinadas circunstancias.</li>
                        </ul>
                        <p>
                            Para ejercer cualquiera de estos derechos, escríbenos a{" "}
                            <a href="mailto:carlosgarcesaguilar@gmail.com" className="text-[#091226] hover:underline">
                                carlosgarcesaguilar@gmail.com
                            </a>
                            . Responderemos en un plazo máximo de <strong>15 días hábiles</strong>.
                        </p>
                    </Article>

                    <Article number={9} title="Uso de cookies">
                        <p>
                            FLUXU utiliza <strong>únicamente cookies esenciales</strong> para el funcionamiento del servicio: gestión de la sesión del usuario autenticado y preferencias básicas de la interfaz.
                        </p>
                        <p>
                            No utilizamos cookies de seguimiento, cookies de publicidad, ni ningún tipo de tecnología de rastreo de comportamiento entre sitios. No integramos píxeles de redes sociales ni herramientas de analítica con identificación personal.
                        </p>
                    </Article>

                    <Article number={10} title="Catálogo público">
                        <p>
                            FLUXU permite a los usuarios publicar un catálogo público de sus productos y servicios con una URL única accesible sin autenticación. Este catálogo puede incluir nombre de la empresa, logo, productos, precios e información de contacto que el propio usuario decide publicar.
                        </p>
                        <p>
                            El usuario es el único responsable del contenido que elige publicar en su catálogo público y de asegurar que cuenta con los derechos necesarios sobre las imágenes y contenidos incluidos.
                        </p>
                    </Article>

                    <Article number={11} title="Modificaciones de esta política">
                        <p>
                            Esta Política de Privacidad puede ser actualizada para reflejar cambios en el servicio, en la legislación aplicable o en nuestras prácticas de tratamiento de datos. Cualquier cambio relevante se comunicará por correo electrónico con al menos <strong>30 días de anticipación</strong> a su entrada en vigencia.
                        </p>
                        <p>
                            La versión vigente estará siempre disponible en{" "}
                            <Link href="/privacidad" className="text-[#091226] hover:underline">
                                fluxu.app/privacidad
                            </Link>
                            .
                        </p>
                    </Article>

                    <Article number={12} title="Contacto">
                        <p>
                            Para cualquier consulta, solicitud o reclamo relacionado con el tratamiento de tus datos personales, contáctanos en:
                        </p>
                        <div className="mt-2 p-4 bg-stone-50 rounded-xl border border-stone-200 text-sm">
                            <a href="mailto:carlosgarcesaguilar@gmail.com" className="text-[#091226] font-semibold hover:underline">
                                carlosgarcesaguilar@gmail.com
                            </a>
                            <p className="text-gray-500 mt-1 text-xs">Tiempo de respuesta: hasta 15 días hábiles.</p>
                        </div>
                    </Article>

                </div>

                {/* Cierre */}
                <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        © 2026 FLUXU · Versión mayo 2026
                    </p>
                    <Link
                        href="/terminos"
                        className="text-sm text-[#091226] font-medium hover:underline"
                    >
                        ← Términos y Condiciones
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#091226] text-slate-400">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <span>© 2026 FLUXU. Todos los derechos reservados.</span>
                    <div className="flex items-center gap-5">
                        <Link href="/terminos" className="hover:text-white transition-colors">
                            Términos
                        </Link>
                        <Link href="/privacidad" className="hover:text-white transition-colors font-medium text-white">
                            Privacidad
                        </Link>
                        <Link href="/" className="hover:text-white transition-colors">
                            Inicio
                        </Link>
                    </div>
                </div>
            </footer>

        </div>
    );
}

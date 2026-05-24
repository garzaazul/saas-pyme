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
// PAGE — Server Component
// ---------------------------------------------------------------------------
export default function TerminosPage() {
    return (
        <div className={`${jakarta.className} min-h-screen bg-white antialiased`}>

            {/* Header mínimo */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/">
                        <FluxuLogo variant="light" height={28} />
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
                        Términos y Condiciones de Uso
                    </h1>
                    <p className="text-sm text-gray-400 font-medium">
                        Última actualización: mayo de 2026
                    </p>
                </div>

                {/* Introducción */}
                <div className="mb-10 p-5 bg-[#091226]/5 rounded-2xl border border-[#091226]/10">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        FLUXU es un servicio de gestión comercial desarrollado y operado por <strong>Carlos Garcés Aguilar</strong>, bajo la marca comercial <strong>Agencia bestIA</strong> (en adelante, "nosotros" o "FLUXU"). Al acceder y utilizar este servicio, el usuario (en adelante, "usuario" o "cliente") acepta íntegramente los presentes Términos y Condiciones. Si no estás de acuerdo con ellos, te pedimos que no uses el servicio.
                    </p>
                </div>

                {/* Artículos */}
                <div className="space-y-10">

                    <Article number={1} title="Descripción del servicio">
                        <p>
                            FLUXU es una plataforma de gestión comercial en la nube que permite a empresas y emprendedores gestionar cotizaciones, administrar su cartera de clientes, mantener un catálogo de productos y servicios, y publicar un catálogo público en línea para facilitar el contacto comercial con sus clientes.
                        </p>
                        <p>
                            FLUXU <strong>no es un sistema de facturación electrónica</strong> ni reemplaza ninguna obligación tributaria o legal ante el Servicio de Impuestos Internos (SII) u otro organismo regulador. El usuario es el único responsable del cumplimiento de sus obligaciones fiscales.
                        </p>
                    </Article>

                    <Article number={2} title="Registro y acceso">
                        <p>
                            El acceso a FLUXU es por invitación. No existe registro público abierto. Una vez que el acceso es activado, cada usuario es responsable de mantener la confidencialidad de sus credenciales de acceso (correo electrónico y contraseña).
                        </p>
                        <p>
                            El usuario se compromete a notificar de inmediato a FLUXU si detecta cualquier uso no autorizado de su cuenta. FLUXU no será responsable por daños derivados del uso no autorizado de las credenciales del usuario.
                        </p>
                    </Article>

                    <Article number={3} title="Plan y condiciones de pago">
                        <p>
                            FLUXU ofrece un <strong>plan único mensual de $9.900 CLP</strong> (pesos chilenos) al mes. Este precio puede ser modificado con un aviso previo de al menos 30 días por correo electrónico.
                        </p>
                        <p>
                            Al activar la cuenta, el usuario accede a un <strong>primer mes gratuito</strong> sin cargo. Finalizado el período de prueba, el cobro se realiza de forma automática y mensual mediante la pasarela de pago habilitada, con cargo a la tarjeta de crédito o débito registrada.
                        </p>
                        <p>
                            El usuario puede cancelar el servicio en cualquier momento desde su cuenta o contactando a FLUXU. La cancelación es efectiva al término del período ya pagado, sin reembolsos parciales.
                        </p>
                    </Article>

                    <Article number={4} title="Uso aceptable">
                        <p>
                            El usuario se compromete a utilizar FLUXU exclusivamente para fines lícitos y actividades comerciales legítimas. Queda expresamente prohibido:
                        </p>
                        <ul className="list-disc list-outside pl-5 space-y-1 text-gray-600 text-sm">
                            <li>Intentar acceder a datos o cuentas de otras organizaciones registradas en el sistema.</li>
                            <li>Vulnerar, intentar vulnerar o eludir los mecanismos de seguridad de la plataforma.</li>
                            <li>Usar el servicio para actividades ilícitas, fraudulentas o que vulneren derechos de terceros.</li>
                            <li>Introducir virus, malware u otro código malicioso en el sistema.</li>
                        </ul>
                        <p>
                            El incumplimiento de estas condiciones faculta a FLUXU a suspender o cancelar el acceso del usuario sin previo aviso y sin derecho a reembolso.
                        </p>
                    </Article>

                    <Article number={5} title="Propiedad de los datos">
                        <p>
                            Todos los datos que el usuario carga en el sistema —clientes, productos, servicios, cotizaciones, logos e imágenes— son y seguirán siendo <strong>propiedad exclusiva del usuario</strong>. FLUXU actúa únicamente como procesador de esos datos para operar el servicio.
                        </p>
                        <p>
                            FLUXU no comparte, vende ni cede los datos del usuario a terceros con fines comerciales. El acceso a los datos está estrictamente limitado al equipo técnico de FLUXU cuando sea necesario para resolver problemas de soporte, siempre bajo deber de confidencialidad.
                        </p>
                    </Article>

                    <Article number={6} title="Disponibilidad del servicio">
                        <p>
                            FLUXU opera como servicio en la nube (SaaS). Si bien hacemos nuestro máximo esfuerzo por mantener el servicio disponible de forma continua, <strong>no garantizamos disponibilidad ininterrumpida</strong> al 100%. Pueden producirse mantenciones programadas, actualizaciones o interrupciones imprevistas.
                        </p>
                        <p>
                            Nos comprometemos a notificar con anticipación razonable cualquier mantención programada que pueda afectar la disponibilidad del servicio, y a restaurar la operación normal en el menor tiempo posible ante interrupciones no planificadas.
                        </p>
                    </Article>

                    <Article number={7} title="Limitación de responsabilidad">
                        <p>
                            FLUXU no será responsable por:
                        </p>
                        <ul className="list-disc list-outside pl-5 space-y-1 text-gray-600 text-sm">
                            <li>Decisiones comerciales, financieras o legales tomadas por el usuario con base en la información gestionada en el sistema.</li>
                            <li>Pérdidas de datos derivadas de uso incorrecto por parte del usuario.</li>
                            <li>Daños indirectos, consecuentes o lucro cesante derivados de interrupciones del servicio.</li>
                            <li>Errores en los datos ingresados por el propio usuario.</li>
                        </ul>
                        <p>
                            La responsabilidad máxima de FLUXU frente al usuario, en cualquier caso, no excederá el monto pagado por el usuario en el mes inmediatamente anterior al evento que origina la reclamación.
                        </p>
                    </Article>

                    <Article number={8} title="Propiedad intelectual">
                        <p>
                            El software, diseño, marca, textos y demás elementos de FLUXU son propiedad de <strong>Carlos Garcés Aguilar</strong>, desarrollados bajo la marca comercial <strong>Agencia bestIA</strong>, y están protegidos por las leyes de propiedad intelectual aplicables. El usuario no adquiere ningún derecho sobre ellos más allá del uso del servicio conforme a estos términos.
                        </p>
                    </Article>

                    <Article number={9} title="Modificaciones de los términos">
                        <p>
                            Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios se notificarán por correo electrónico con al menos <strong>30 días de anticipación</strong>. El uso continuado del servicio tras la fecha de vigencia de los nuevos términos implica su aceptación.
                        </p>
                    </Article>

                    <Article number={10} title="Legislación aplicable y jurisdicción">
                        <p>
                            Estos Términos y Condiciones se rigen por las leyes de la República de Chile. Cualquier controversia derivada de la interpretación o aplicación de estos términos se someterá a los tribunales ordinarios de justicia competentes en Chile.
                        </p>
                    </Article>

                    <Article number={11} title="Contacto">
                        <p>
                            Para consultas, reclamos o solicitudes relacionadas con estos términos, puedes escribirnos a:{" "}
                            <a
                                href="mailto:carlosgarcesaguilar@gmail.com"
                                className="text-[#091226] font-medium hover:underline"
                            >
                                carlosgarcesaguilar@gmail.com
                            </a>
                        </p>
                    </Article>

                </div>

                {/* Cierre */}
                <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        © 2026 FLUXU · Versión mayo 2026
                    </p>
                    <Link
                        href="/privacidad"
                        className="text-sm text-[#091226] font-medium hover:underline"
                    >
                        Política de Privacidad →
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#091226] text-slate-400">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex flex-col items-center sm:items-start gap-1">
                        <span>© 2026 FLUXU. Todos los derechos reservados.</span>
                        <span>
                            Desarrollado por{" "}
                            <a href="https://www.agenciabestia.cl" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors font-medium">
                                Agencia bestIA
                            </a>
                            {" "}· Carlos Garcés Aguilar
                        </span>
                    </div>
                    <div className="flex items-center gap-5">
                        <Link href="/terminos" className="hover:text-white transition-colors font-medium text-white">
                            Términos
                        </Link>
                        <Link href="/privacidad" className="hover:text-white transition-colors">
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

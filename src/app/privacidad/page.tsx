export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#1A1A2E] text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-[#16213E] rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12 border border-blue-900/30">
                <h1 className="text-3xl font-extrabold text-white mb-8 border-b border-blue-800 pb-4">
                    Política de Privacidad — Aditor AI
                </h1>

                <div className="space-y-8 text-base leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">Quiénes somos</h2>
                        <p>
                            Aditor AI es una herramienta SaaS de análisis automatizado de campañas publicitarias de Meta Ads diseñada para ayudar a anunciantes y agencias a optimizar su rendimiento mediante inteligencia artificial.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">Qué datos recopilamos</h2>
                        <p>
                            Para poder ofrecerte nuestros servicios, recopilamos la siguiente información estrictamente necesaria:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                            <li>Tu dirección de correo electrónico y nombre (para la gestión de tu cuenta).</li>
                            <li>Métricas y estructuras de tus campañas de Meta Ads (exclusivamente en modo de <strong>solo lectura</strong>).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">Qué NO hacemos</h2>
                        <p>En Aditor AI valoramos profundamente la seguridad y privacidad de tu negocio. Por lo tanto, garantizamos que <strong>NUNCA</strong>:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                            <li>Modificamos, pausamos o creamos campañas dentro de tu cuenta publicitaria.</li>
                            <li>Accedemos ni almacenamos tus datos de pago, tarjetas de crédito o facturación de Meta.</li>
                            <li>Vendemos, compartimos ni cedemos tus datos a terceros bajo ninguna circunstancia.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">Cómo usamos los datos</h2>
                        <p>
                            La información extraída de tus campañas se utiliza <strong>única y exclusivamente</strong> para generar los reportes de auditoría, sugerencias de optimización y hooks accionables que tú mismo solicitas en la plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">Almacenamiento y Seguridad</h2>
                        <p>
                            Tus datos se almacenan de manera segura utilizando la infraestructura de Supabase, que cumple con los más altos estándares de seguridad de la industria. Implementamos estrictos controles de acceso para proteger tu información.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">Permisos de Meta</h2>
                        <p>
                            Nuestra integración oficial con Meta (Facebook) requiere tu autorización explícita. Solo solicitamos los permisos mínimos necesarios: <code>ads_read</code> y <code>business_management</code>. Esto certifica que nuestro acceso es de nivel "solo lectura" y no tenemos capacidad operativa sobre tus anuncios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">Eliminación de datos</h2>
                        <p>
                            Tienes control total sobre tu información. Si en algún momento deseas revocar nuestro acceso o solicitar la eliminación completa de tus datos y tu cuenta de nuestros servidores, puedes hacerlo escribiéndonos un correo a <a href="mailto:soporte@aditor-ai.com" className="text-blue-400 hover:text-blue-300 font-medium underline">soporte@aditor-ai.com</a>. Procesaremos tu solicitud a la brevedad.
                        </p>
                    </section>

                    <section className="pt-6 mt-6 border-t border-blue-800/50">
                        <h2 className="text-lg font-bold text-white mb-2">Contacto</h2>
                        <p>
                            Si tienes alguna duda sobre esta política o el tratamiento de tus datos, contáctanos en: <br />
                            <a href="mailto:soporte@aditor-ai.com" className="text-blue-400 hover:text-blue-300 font-medium bg-blue-900/20 px-2 py-1 rounded inline-block mt-2">soporte@aditor-ai.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function TerminosYCondiciones() {
    return (
        <div className="min-h-screen bg-[#1A1A2E] text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-[#16213E] rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12 border border-blue-900/30">
                <h1 className="text-3xl font-extrabold text-white mb-8 border-b border-blue-800 pb-4">
                    Términos y Condiciones — Aditor AI
                </h1>

                <div className="space-y-8 text-base leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">1. Descripción del Servicio</h2>
                        <p>
                            Aditor AI es un servicio Software as a Service (SaaS) diseñado para analizar, auditar y generar sugerencias sobre campañas publicitarias de Meta Ads (Facebook e Instagram). Funciona exclusivamente en modo de lectura utilizando inteligencia artificial para proporcionar reportes y optimizaciones a usuarios de LATAM y España.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">2. Uso Aceptable</h2>
                        <p>
                            Al utilizar Aditor AI, te comprometes a conectar cuentas publicitarias de Meta sobre las cuales tengas autorización legal y legítima para auditar. El servicio está destinado a uso profesional y comercial. Queda estrictamente prohibido:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                            <li>Intentar vulnerar la seguridad de nuestra plataforma o la infraestructura de Meta.</li>
                            <li>Usar el servicio para análisis de campañas que promuevan actividades ilegales.</li>
                            <li>Revender el acceso a tu cuenta de Aditor AI a terceros.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">3. Pagos, Tarifas y Suscripciones</h2>
                        <p>
                            El acceso a la versión completa de Aditor AI requiere una suscripción mensual.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                            <li><strong>Tarifa Mensual:</strong> $185.000 COP / mes (aprox. $47 USD).</li>
                            <li><strong>Prueba Gratuita:</strong> Ofrecemos 7 días de prueba gratuita. Pasado este tiempo, el cobro se realizará automáticamente si no se ha cancelado previamente.</li>
                            <li><strong>Cancelaciones:</strong> Puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario o comunicándote con nosotros. No realizamos reembolsos por meses ya facturados y en curso.</li>
                            <li>Los pagos son procesados de forma segura a través de Mercado Pago.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">4. Limitación de Responsabilidad</h2>
                        <p>
                            Aditor AI funciona como una herramienta de análisis y asesoramiento. <strong>No aplicamos cambios automáticos en tus campañas</strong>.
                        </p>
                        <p className="mt-2">
                            La plataforma y sus creadores no se hacen responsables por caídas en el rendimiento de ventas, bloqueos de cuentas de Meta (baneos), o variaciones en el retorno de inversión (ROI/ROAS). Tú eres el único responsable de decidir si implementas o no las sugerencias brindadas por nuestra IA.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-blue-400 mb-3">5. Modificaciones del Servicio</h2>
                        <p>
                            Nos reservamos el derecho de modificar o discontinuar el servicio (o cualquier parte de este) con o sin previo aviso en cualquier momento. De igual manera, podemos actualizar estos términos modificando esta misma página.
                        </p>
                    </section>

                    <section className="pt-6 mt-6 border-t border-blue-800/50">
                        <h2 className="text-lg font-bold text-white mb-2">Contacto</h2>
                        <p>
                            Para cualquier consulta relacionada con tu suscripción o estos Términos y Condiciones, por favor contáctanos en: <br />
                            <a href="mailto:info@aditor-ai.com" className="text-blue-400 hover:text-blue-300 font-medium bg-blue-900/20 px-2 py-1 rounded inline-block mt-2">info@aditor-ai.com</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}

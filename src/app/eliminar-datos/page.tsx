export default function EliminarDatos() {
    return (
        <div className="min-h-screen bg-[#1A1A2E] text-gray-200 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-[#16213E] rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12 border border-blue-900/30">
                <h1 className="text-3xl font-extrabold text-white mb-8 border-b border-blue-800 pb-4">
                    Solicitud de Eliminación de Datos
                </h1>

                <div className="space-y-6 text-base leading-relaxed">
                    <p className="text-lg text-gray-300">
                        En Aditor AI respetamos tu privacidad y tu derecho a controlar tus datos personales. De acuerdo con las políticas de Meta (Facebook Login) y las normativas internacionales de protección de datos, puedes solicitar la eliminación permanente de toda la información asociada a tu cuenta.
                    </p>

                    <section className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6 mt-6">
                        <h2 className="text-xl font-bold text-blue-400 mb-4">¿Cómo solicitar la eliminación?</h2>

                        <p className="mb-4">
                            Sigue estas instrucciones para procesar tu solicitud:
                        </p>

                        <ol className="list-decimal pl-5 space-y-3 text-gray-300">
                            <li>
                                Envíanos un correo electrónico a <a href="mailto:info@aditor-ai.com" className="text-blue-400 font-medium">info@aditor-ai.com</a>.
                            </li>
                            <li>
                                El asunto del correo debe ser: <strong>Solicitud de Eliminación de Datos</strong>.
                            </li>
                            <li>
                                En el cuerpo del correo, indícanos el <strong>correo electrónico</strong> con el cual te registraste en nuestra plataforma.
                            </li>
                            <li>
                                <em>Es importante que envíes este requerimiento desde la misma dirección de correo que deseas eliminar para verificar tu identidad.</em>
                            </li>
                        </ol>
                    </section>

                    <section className="mt-8">
                        <h2 className="text-xl font-bold text-white mb-3">¿Qué sucederá después?</h2>
                        <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-300">
                            <li>Te enviaremos una confirmación de recepción de tu solicitud.</li>
                            <li>Eliminaremos permanentemente tus credenciales de acceso, tus tokens de Meta Ads (Facebook), tu historial de auditorías y tu nombre de nuestros servidores principales.</li>
                            <li>Si tienes una suscripción activa, la cancelaremos automáticamente para evitar futuros cobros.</li>
                            <li>Completaremos el proceso de eliminación en un plazo máximo de <strong>14 días hábiles</strong> posteriores a tu solicitud.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}


import { SignUp } from "@clerk/nextjs";

export default function RegistroPage() {
    return (
        <main className="min-h-screen bg-[#1A1A2E] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E94560] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4ECDC4] rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md space-y-6">
                {/* Trial Banner */}
                <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#74B9FF]/10 border border-[#4ECDC4]/20 rounded-2xl p-4 flex items-center justify-center gap-3 w-fit mx-auto">
                    <div className="text-2xl">🎁</div>
                    <div>
                        <div className="text-sm font-bold text-[#4ECDC4]">7 días completamente gratis</div>
                        <div className="text-xs text-gray-400">Sin tarjeta · Cancelá cuando quieras</div>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold font-syne mb-1">Crear cuenta gratis</h1>
                    <p className="text-sm text-gray-400">Para ver el reporte completo y activar tu trial</p>
                </div>

                {/* Clerk SignUp */}
                <div className="flex justify-center">
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-[#16213E] border border-white/10 rounded-2xl shadow-none w-full",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white",
                                socialButtonsBlockButtonText: "text-white font-medium",
                                dividerLine: "bg-white/10",
                                dividerText: "text-gray-500",
                                formFieldLabel: "text-gray-400 uppercase text-[10px] font-bold tracking-wider",
                                formFieldInput: "bg-white/5 border-white/10 text-white rounded-xl focus:border-[#E94560] focus:ring-[#E94560]",
                                footer: "hidden",
                                formButtonPrimary: "bg-gradient-to-r from-[#E94560] to-[#ff8e53] border-none shadow-[0_4px_14px_rgba(233,69,96,0.35)] hover:bg-gradient-to-r hover:from-[#ff8e53] hover:to-[#E94560]"
                            },
                            layout: {
                                socialButtonsPlacement: "top",
                                showOptionalFields: false
                            }
                        }}
                        forceRedirectUrl="/dashboard"
                        signInUrl="/login"
                    />
                </div>

                <p className="text-center text-[10px] text-gray-500 px-4">
                    Al registrarte aceptás los Términos de servicio y la Política de privacidad.
                </p>

            </div>
        </main>
    );
}

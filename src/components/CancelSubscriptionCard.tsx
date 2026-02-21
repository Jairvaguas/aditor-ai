"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";

export function CancelSubscriptionCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/payments/cancel-subscription", {
                method: "POST",
            });

            if (res.ok) {
                // Redirect user with success state (will be handled on /subscribe to show message)
                router.push("/subscribe?canceled=true");
            } else {
                alert("Ocurrió un error al procesar tu solicitud.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Cancel error:", error);
            alert("Ocurrió un error inesperado.");
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="bg-[#1A1A2E]/50 border border-red-500/20 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-white mb-1">Cancelar Suscripción</h3>
                    <p className="text-xs text-slate-400">
                        Detén tu facturación. Perderás acceso a las auditorías al finalizar tu ciclo actual.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold text-sm py-3 px-6 rounded-xl transition-colors border border-red-500/30 whitespace-nowrap"
                >
                    Cancelar suscripción
                </button>
            </div>

            {/* Modal de confirmación */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

                        {/* Header Modal */}
                        <div className="flex justify-between items-center p-5 border-b border-slate-800">
                            <h3 className="text-lg font-bold font-syne text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Confirmar Cancelación
                            </h3>
                            <button
                                onClick={() => !isLoading && setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                                disabled={isLoading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6">
                            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                ¿Estás seguro que deseas cancelar? Perderás acceso al finalizar tu período actual.
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                Para volver a usar el servicio solo deberás reconectar tu cuenta de Meta Ads desde Configuración.
                            </p>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-5 flex gap-3 justify-end border-t border-slate-800 bg-slate-900/50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isLoading}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? "Cancelando..." : "Sí, cancelar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

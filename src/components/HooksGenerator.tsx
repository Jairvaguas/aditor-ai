"use client";

import { useState } from "react";
import { Copy, LayoutTemplate, Wand2, RefreshCw } from "lucide-react";

interface HookItem {
    id: number;
    type: string;
    content: string;
    angle: string;
}

const DEFAULT_HOOKS: HookItem[] = [
    {
        id: 1,
        type: "Atención al Dolor",
        content: "«¿Sientes que el ROAS cae aunque subas tu presupuesto? Este error en tu retargeting te está robando ventas.»",
        angle: "Contraintuitivo / Miedo a la pérdida"
    },
    {
        id: 2,
        type: "Prueba Social Directa",
        content: "«Cómo 3,450 tiendas dejaron de depender del tráfico frío y aumentaron su LTV en 45 días.»",
        angle: "Curiosidad por casos de éxito"
    },
    {
        id: 3,
        type: "Oferta Irresistible",
        content: "«Deja de regalar descuentos. Así es como estructuramos una oferta que tus clientes se sientan tontos si la rechazan.»",
        angle: "Educacional / Valor percibo"
    }
];

export function HooksGenerator() {
    const [hooks, setHooks] = useState<HookItem[]>(DEFAULT_HOOKS);
    const [isLoading, setIsLoading] = useState(false);

    // Minimal mock data to mimic what the API expects for context
    const mockCampaignsData = [
        { name: "Retargeting 7 días", roas: "4.2x", ctr: "1.8%" },
        { name: "Lookalike 1%", roas: "1.9x", ctr: "0.9%" },
        { name: "Intereses Mujer", roas: "0.8x", ctr: "0.5%" } // Dolor
    ];

    const generateHooks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/hooks/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ campaignsData: mockCampaignsData }),
            });

            const data = await res.json();

            if (res.ok && data.hooks) {
                setHooks(data.hooks);
            } else {
                console.error("API Error:", data.error);
                alert("Ocurrió un error al generar los hooks. Revisa tu suscripción o intenta más tarde.");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("Error al conectar con la IA.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Podríamos agregar un toast notification aquí si hubiera una librería
    };

    return (
        <>
            <div className="bg-gradient-to-r from-slate-900 to-[#131D2E] border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00D4AA]/10 rounded-full blur-[40px] pointer-events-none"></div>
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-xl font-bold font-display text-white mb-2 flex items-center gap-2">
                        <Wand2 className="w-6 h-6 text-[#00D4AA]" />
                        Ideación de Copywriting Creativo
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Genera hooks y copies para tus anuncios basados en los datos y el rendimiento técnico de tus campañas analizadas por Aditor AI.
                    </p>
                </div>
                <button
                    onClick={generateHooks}
                    disabled={isLoading}
                    className="whitespace-nowrap flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold text-sm shadow-[0_4px_14px_rgba(255,107,107,0.35)] hover:scale-[1.02] transition-transform relative z-10 min-w-[220px] disabled:opacity-70 fill-white"
                >
                    {isLoading ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Generando IA...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-4 h-4" /> Generar nuevo hook
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {isLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B1120]/60 backdrop-blur-sm rounded-3xl">
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="w-8 h-8 text-[#00D4AA] animate-spin" />
                            <p className="text-sm font-bold text-[#00D4AA] font-display animate-pulse">Claude está escribiendo...</p>
                        </div>
                    </div>
                )}

                {hooks.map((hook) => (
                    <div key={hook.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col group hover:border-[#00D4AA]/40 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 line-clamp-1">
                                {hook.type}
                            </span>
                            <button
                                onClick={() => copyToClipboard(hook.content)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                                title="Copiar al portapapeles"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 bg-slate-800/30 rounded-xl p-4 mb-4 border border-slate-800">
                            <p className="text-sm text-slate-200 font-medium italic leading-relaxed">
                                {hook.content}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-800/80">
                            <LayoutTemplate className="w-3.5 h-3.5" />
                            <span>Ángulo: <strong className="text-slate-400">{hook.angle}</strong></span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

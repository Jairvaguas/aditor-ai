'use client';
import { useState } from 'react';
import { TrendingUp, AlertTriangle, AlertCircle, Lightbulb, ChevronRight } from 'lucide-react';

const tabs = ['Críticos', 'Advertencias', 'Oportunidades'];

const findings: Record<number, Array<{
    icon: any;
    label: string;
    title: string;
    metric: string;
    action: string;
    borderColor: string;
    bgColor: string;
    badgeBg: string;
    badgeText: string;
}>> = {
    0: [
        {
            icon: AlertCircle,
            label: 'Crítico',
            title: 'ROAS bajo en "Campaña Ventas Dic"',
            metric: 'ROAS actual: 0.8x — mínimo recomendado: 2x',
            action: 'Pausar campaña y revisar segmentación y oferta',
            borderColor: 'border-l-red-500',
            bgColor: 'bg-red-500/5',
            badgeBg: 'bg-red-500/10',
            badgeText: 'text-red-400',
        },
        {
            icon: AlertCircle,
            label: 'Crítico',
            title: 'Sin conversiones en últimos 14 días — Conjunto B',
            metric: 'Inversión: $1,200 sin retorno confirmado',
            action: 'Verificar píxel y revisar ventana de atribución',
            borderColor: 'border-l-red-500',
            bgColor: 'bg-red-500/5',
            badgeBg: 'bg-red-500/10',
            badgeText: 'text-red-400',
        },
    ],
    1: [
        {
            icon: AlertTriangle,
            label: 'Advertencia',
            title: 'Frecuencia 8.2x en Conjunto de Anuncios A',
            metric: 'Promedio saludable: 2-4x por semana',
            action: 'Renovar creatividades o ampliar audiencia',
            borderColor: 'border-l-yellow-500',
            bgColor: 'bg-yellow-500/5',
            badgeBg: 'bg-yellow-500/10',
            badgeText: 'text-yellow-400',
        },
        {
            icon: AlertTriangle,
            label: 'Advertencia',
            title: 'Superposición de audiencias detectada (67%)',
            metric: 'Conjuntos 2 y 3 compiten entre sí',
            action: 'Excluir audiencias para evitar canibalización',
            borderColor: 'border-l-yellow-500',
            bgColor: 'bg-yellow-500/5',
            badgeBg: 'bg-yellow-500/10',
            badgeText: 'text-yellow-400',
        },
    ],
    2: [
        {
            icon: Lightbulb,
            label: 'Oportunidad',
            title: 'Campaña Retargeting con presupuesto insuficiente',
            metric: 'CTR 4.2% — alta intención de compra',
            action: 'Aumentar presupuesto un 30% para maximizar retorno',
            borderColor: 'border-l-[#00D4AA]',
            bgColor: 'bg-[#00D4AA]/5',
            badgeBg: 'bg-[#00D4AA]/10',
            badgeText: 'text-[#00D4AA]',
        },
        {
            icon: Lightbulb,
            label: 'Oportunidad',
            title: 'Video ads con CPR 3x menor que imágenes',
            metric: 'Mejor rendimiento en audiencias frías',
            action: 'Duplicar conjuntos con video y escalar presupuesto',
            borderColor: 'border-l-[#00D4AA]',
            bgColor: 'bg-[#00D4AA]/5',
            badgeBg: 'bg-[#00D4AA]/10',
            badgeText: 'text-[#00D4AA]',
        },
    ],
};

export default function DemoPreview() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="max-w-4xl mx-auto">
            {/* Browser chrome */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                {/* Title bar */}
                <div className="bg-slate-800 px-5 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    <div className="ml-4 flex-1 bg-slate-700 rounded-md px-4 py-1.5 text-xs text-slate-400 max-w-xs">
                        aditor-ai.com/reporte/demo
                    </div>
                </div>

                {/* Report content */}
                <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
                        <div>
                            <h3 className="font-bold text-white text-lg">Reporte de Auditoría</h3>
                            <p className="text-slate-500 text-xs mt-0.5">
                                Cuenta: Mi Tienda Online · Generado hace 2 min · 11 hallazgos
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold">
                                3 críticos
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold">
                                5 avisos
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-[#00D4AA]/10 text-[#00D4AA] text-xs font-bold">
                                3 oportunidades
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-slate-800 pb-4">
                        {tabs.map((tab, i) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(i)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeTab === i
                                        ? 'bg-[#FF6B6B] text-white shadow-lg shadow-[#FF6B6B]/20'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Findings */}
                    <div className="space-y-3">
                        {findings[activeTab].map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div
                                    key={i}
                                    className={`p-4 rounded-xl border-l-4 ${f.borderColor} ${f.bgColor} transition-all duration-300`}
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${f.badgeBg} ${f.badgeText}`}>
                                                {f.label}
                                            </span>
                                            <span className="font-semibold text-white text-sm">{f.title}</span>
                                        </div>
                                        <p className="text-slate-500 text-xs">{f.metric}</p>
                                        <div className="flex items-start gap-1.5">
                                            <TrendingUp className="w-3.5 h-3.5 text-[#818cf8] shrink-0 mt-0.5" />
                                            <p className="text-[#818cf8] text-xs font-medium">{f.action}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA inside preview */}
                    <div className="mt-4 flex items-center gap-2 bg-[#818cf8]/10 rounded-xl p-3 border border-[#818cf8]/20">
                        <Lightbulb className="w-4 h-4 text-[#818cf8] shrink-0" />
                        <span className="text-xs text-[#818cf8] font-medium">
                            Ver las 11 recomendaciones completas →
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

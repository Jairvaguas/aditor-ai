'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

interface Hook {
    tipo: string;
    texto: string;
    score_estimado: number | string;
}

interface HooksViewProps {
    hooks: Hook[];
    auditId: string;
}

export default function HooksView({ hooks, auditId }: HooksViewProps) {
    const [filter, setFilter] = useState('Todos');

    const filters = ['Todos', 'Dolor', 'Curiosidad', 'Contraste', 'Identidad', 'Prueba social'];

    const getHookColor = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('dolor')) return '#FF6B6B'; // Coral
        if (t.includes('curiosidad')) return '#FFE66D'; // Amarillo
        if (t.includes('contraste')) return '#4ECDC4'; // Mint
        if (t.includes('identidad')) return '#74B9FF'; // Azul
        return '#A29BFE'; // Purple
    };

    const filteredHooks = filter === 'Todos'
        ? hooks
        : hooks.filter(h => h.tipo.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="max-w-[680px] mx-auto px-5 py-5 min-h-screen">

            {/* Header */}
            <div className="mb-6">
                <Link href={`/reporte/${auditId}`} className="text-xs text-gray-400 mb-2 flex items-center gap-1 hover:text-white transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Volver al reporte
                </Link>
                <h1 className="text-2xl font-bold font-display">Hooks y Ángulos 🎣</h1>
                <p className="text-xs text-[#8892A4] mt-1">Mejores ángulos creativos para tus anuncios.</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${filter === f
                            ? 'bg-white text-[#1A1A2E] border-white'
                            : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Hooks List */}
            <div className="space-y-0">
                {filteredHooks.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        No hay hooks para este filtro.
                    </div>
                ) : (
                    filteredHooks.map((hook, i) => {
                        const color = getHookColor(hook.tipo);
                        const score = parseInt(String(hook.score_estimado)) || 85;

                        return (
                            <div
                                key={i}
                                style={{
                                    borderLeft: `3px solid ${color}`,
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '14px',
                                    padding: '16px 16px 16px 20px',
                                    marginBottom: '10px'
                                }}
                            >
                                {/* Type Label */}
                                <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">
                                    {hook.tipo}
                                </div>

                                {/* Hook Text */}
                                <h3 className="text-[14px] text-white font-medium leading-normal mb-3">
                                    "{hook.texto}"
                                </h3>

                                {/* Score Bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                    <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                        <div style={{ width: `${score}%`, height: '100%', background: 'linear-gradient(90deg, #E94560, #FFE66D)', borderRadius: '2px' }} />
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#8892A4', fontWeight: '700' }}>{score}%</span>
                                </div>

                                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-gray-500">
                                    <Play className="w-3 h-3" />
                                    <span>Formato recomendado: video/imagen/carrusel</span>
                                </div>

                            </div>
                        );
                    })
                )}
            </div>

        </div>
    );
}


import Link from 'next/link';

export default function TeaserPage() {
    return (
        <main className="min-h-screen bg-[#1A1A2E] text-white font-sans pb-20">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E94560] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4ECDC4] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-md mx-auto relative">
                {/* Notch simulation */}
                <div className="w-[110px] h-[26px] bg-[#1A1A2E] rounded-b-[18px] mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-50"></div>

                {/* Header */}
                <div className="pt-12 px-5 pb-4">
                    <h2 className="text-[19px] font-extrabold font-syne mb-1">Tu análisis está listo 🎉</h2>
                    <p className="text-[11px] text-[#8892A4]">Analizamos 23 campañas · Hace un momento</p>
                </div>

                {/* Score Card */}
                <div className="mx-5 mb-4 bg-gradient-to-br from-[#FF6B6B]/12 to-[#FF8E53]/12 border border-[#FF6B6B]/25 rounded-[18px] p-4 flex items-center gap-3.5">
                    {/* Circular Score */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 relative" style={{ background: 'conic-gradient(#FFE66D 0deg 230deg, rgba(255,255,255,0.08) 230deg 360deg)' }}>
                        <div className="w-[46px] h-[46px] bg-[#16213E] rounded-full flex flex-col items-center justify-center">
                            <span className="text-base font-extrabold text-[#FFE66D] font-syne leading-none">64</span>
                            <span className="text-[8px] text-[#8892A4]">/100</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-[15px] font-extrabold font-syne mb-1">Salud de cuenta: Regular</h3>
                        <p className="text-[11px] text-[#8892A4] leading-snug">
                            Encontramos <strong className="text-[#FF6B6B]">4 problemas urgentes</strong> y <strong className="text-[#4ECDC4]">2 oportunidades</strong> de escalar.
                        </p>
                    </div>
                </div>

                {/* Findings List */}
                <div className="px-5 pb-4">
                    <div className="text-[11px] font-bold text-[#8892A4] tracking-widest uppercase mb-2.5">Lo que encontramos</div>

                    {/* Red Finding */}
                    <div className="bg-[#FF6B6B]/8 border border-[#FF6B6B]/20 rounded-[14px] p-3 mb-2">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="px-2 py-0.5 rounded-[5px] bg-[#FF6B6B]/20 text-[#FF6B6B] text-[9px] font-bold tracking-wider uppercase">🔴 Pausar</div>
                            <div className="text-[12px] font-semibold flex-1">Intereses — Ropa Mujer</div>
                        </div>
                        <p className="text-[11px] text-[#8892A4] leading-snug">Gastó $340 en 7 días con ROAS 0.8x. Está perdiendo dinero sin retorno.</p>
                    </div>

                    {/* Green Finding */}
                    <div className="bg-[#4ECDC4]/8 border border-[#4ECDC4]/20 rounded-[14px] p-3 mb-2">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="px-2 py-0.5 rounded-[5px] bg-[#4ECDC4]/20 text-[#4ECDC4] text-[9px] font-bold tracking-wider uppercase">🟢 Escalar</div>
                            <div className="text-[12px] font-semibold flex-1">Carrito abandonado</div>
                        </div>
                        <p className="text-[11px] text-[#8892A4] leading-snug">ROAS 5.1x con solo $180. Tiene margen para triplicar presupuesto.</p>
                    </div>

                    {/* Yellow Finding */}
                    <div className="bg-[#FFE66D]/8 border border-[#FFE66D]/20 rounded-[14px] p-3 mb-2">
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="px-2 py-0.5 rounded-[5px] bg-[#FFE66D]/20 text-[#FFE66D] text-[9px] font-bold tracking-wider uppercase">🟡 Atención</div>
                            <div className="text-[12px] font-semibold flex-1">Video testimonial #3</div>
                        </div>
                        <p className="text-[11px] text-[#8892A4] leading-snug">Frecuencia 6.8. Tu audiencia está saturada con este creativo.</p>
                    </div>

                    {/* Locked/Blurred Findings */}
                    <div className="relative mt-2">
                        <div className="absolute inset-0 z-10"></div> {/* Click blocker */}

                        {/* Blurred Content */}
                        <div className="opacity-50 filter blur-[4px] pointer-events-none select-none">
                            <div className="bg-[#FF6B6B]/8 border border-[#FF6B6B]/20 rounded-[14px] p-3 mb-2">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="px-2 py-0.5 rounded-[5px] bg-[#FF6B6B]/20 text-[#FF6B6B] text-[9px] font-bold tracking-wider uppercase">🔴 Pausar</div>
                                    <div className="text-[12px] font-semibold flex-1">Campaña Lookalike 2%</div>
                                </div>
                                <div className="text-[11px] text-[#8892A4]">CPM muy alto sin conversiones en los últimos 5 días.</div>
                            </div>

                            <div className="bg-[#4ECDC4]/8 border border-[#4ECDC4]/20 rounded-[14px] p-3 mb-2">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="px-2 py-0.5 rounded-[5px] bg-[#4ECDC4]/20 text-[#4ECDC4] text-[9px] font-bold tracking-wider uppercase">🟢 Escalar</div>
                                    <div className="text-[12px] font-semibold flex-1">Retargeting 3 días</div>
                                </div>
                                <div className="text-[11px] text-[#8892A4]">ROAS 3.8x con frecuencia baja. Listo para escalar.</div>
                            </div>
                        </div>

                        {/* Lock Overlay Banner */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] bg-[#1A1A2E]/95 backdrop-blur-md border border-[#FF6B6B]/30 rounded-[16px] p-4 text-center z-20 shadow-2xl">
                            <div className="text-2xl mb-2">🔒</div>
                            <h3 className="text-[15px] font-extrabold font-syne mb-1 text-white">+3 hallazgos más</h3>
                            <p className="text-[11px] text-[#8892A4] mb-3 leading-snug">
                                Creá tu cuenta gratis para ver todas las recomendaciones y activar la auditoría semanal.
                            </p>
                            <Link href="/registro" className="block w-full py-3 bg-gradient-to-br from-[#E94560] to-[#ff8e53] rounded-[14px] text-white text-[14px] font-bold shadow-[0_6px_20px_rgba(255,107,107,0.35)] hover:scale-[1.02] transition-transform">
                                Ver reporte completo gratis →
                            </Link>
                            <div className="text-[10px] text-[#8892A4] mt-2">7 días gratis · Sin tarjeta de crédito</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

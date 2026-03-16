'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, Crown, Plus, Minus } from 'lucide-react';

interface DynamicPricingFormProps {
    copRate: number;
    isLanding?: boolean;
}

export default function DynamicPricingForm({ copRate, isLanding = false }: DynamicPricingFormProps) {
    const [extraAccounts, setExtraAccounts] = useState<number>(0);
    const additionalAccountUsd = 15;

    const basicBase = 24;
    const proBase = 39;
    const extraCost = extraAccounts * additionalAccountUsd;
    const basicTotal = basicBase + extraCost;
    const proTotal = proBase + extraCost;

    const basicCop = new Intl.NumberFormat('es-CO').format(Math.round(basicTotal * copRate));
    const proCop = new Intl.NumberFormat('es-CO').format(Math.round(proTotal * copRate));
    const totalAccounts = 1 + extraAccounts;

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {/* Selector de cuentas */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 text-center max-w-md mx-auto w-full">
                <p className="text-sm text-slate-400 mb-4">¿Cuántas cuentas publicitarias necesitas?</p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setExtraAccounts(Math.max(0, extraAccounts - 1))}
                        disabled={extraAccounts === 0}
                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                        <span className="text-3xl font-extrabold text-white">{totalAccounts}</span>
                        <p className="text-xs text-slate-500 mt-1">{totalAccounts === 1 ? 'cuenta' : 'cuentas'}</p>
                    </div>
                    <button
                        onClick={() => setExtraAccounts(Math.min(14, extraAccounts + 1))}
                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                {extraAccounts > 0 && (
                    <p className="text-xs text-[#00D4AA] mt-3 font-medium">
                        1 incluida + {extraAccounts} adicional{extraAccounts > 1 ? 'es' : ''} (${extraCost} USD)
                    </p>
                )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan Básico */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 flex flex-col relative">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-[#74B9FF]/10 rounded-lg">
                                <Zap className="w-5 h-5 text-[#74B9FF]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Básico</h3>
                        </div>
                        <p className="text-sm text-slate-400">Perfecto para emprendedores que quieren entender sus campañas.</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-white">${basicTotal}</span>
                            <span className="text-lg text-slate-400">USD / mes</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">~${basicCop} COP / mes</p>
                        {extraAccounts > 0 && (
                            <p className="text-xs text-slate-500 mt-0.5">${basicBase} base + ${extraCost} ({extraAccounts} cuenta{extraAccounts > 1 ? 's' : ''} extra)</p>
                        )}
                    </div>

                    <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg px-3 py-2 mb-6">
                        <p className="text-xs text-[#00D4AA] font-bold">7 días de prueba gratis</p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                            <span>{totalAccounts} cuenta{totalAccounts > 1 ? 's' : ''} publicitaria{totalAccounts > 1 ? 's' : ''}</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                            <span>Auditoría semanal automática (lunes 9AM)</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                            <span>Reporte por email con hallazgos y plan de acción</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                            <span>Dashboard con métricas en tiempo real</span>
                        </li>
                    </ul>

                    {isLanding ? (
                        <Link
                            href="/conectar"
                            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all text-center border border-slate-600 hover:border-slate-500"
                        >
                            Empezar gratis
                        </Link>
                    ) : (
                        <button className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all text-center border border-slate-600 hover:border-slate-500">
                            Empezar gratis
                        </button>
                    )}
                </div>

                {/* Plan Pro */}
                <div className="bg-slate-900 border-2 border-[#FF6B6B]/40 rounded-2xl p-8 flex flex-col relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(255,107,107,0.3)]">
                            Más popular
                        </span>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-[#FF6B6B]/10 rounded-lg">
                                <Crown className="w-5 h-5 text-[#FF6B6B]" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Pro</h3>
                        </div>
                        <p className="text-sm text-slate-400">Para quienes quieren dominar Meta Ads y maximizar cada peso.</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-white">${proTotal}</span>
                            <span className="text-lg text-slate-400">USD / mes</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">~${proCop} COP / mes</p>
                        {extraAccounts > 0 && (
                            <p className="text-xs text-slate-500 mt-0.5">${proBase} base + ${extraCost} ({extraAccounts} cuenta{extraAccounts > 1 ? 's' : ''} extra)</p>
                        )}
                    </div>

                    <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg px-3 py-2 mb-6">
                        <p className="text-xs text-[#00D4AA] font-bold">7 días de prueba gratis</p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                            <span>{totalAccounts} cuenta{totalAccounts > 1 ? 's' : ''} publicitaria{totalAccounts > 1 ? 's' : ''}</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-white font-medium">
                            <Check className="w-4 h-4 text-[#FF6B6B] mt-0.5 flex-shrink-0" />
                            <span>Auditorías ilimitadas bajo demanda</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-white font-medium">
                            <Check className="w-4 h-4 text-[#FF6B6B] mt-0.5 flex-shrink-0" />
                            <span>Auditoría semanal automática (lunes 9AM)</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                            <span>Recomendaciones avanzadas por objetivo de campaña</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                            <span>Dashboard con métricas en tiempo real</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-300">
                            <Check className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" />
                            <span>Soporte prioritario</span>
                        </li>
                    </ul>

                    {isLanding ? (
                        <Link
                            href="/conectar"
                            className="w-full py-3.5 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53] text-white font-bold rounded-xl shadow-[0_6px_20px_rgba(255,107,107,0.3)] hover:shadow-[0_8px_25px_rgba(255,107,107,0.5)] transition-all text-center hover:-translate-y-0.5"
                        >
                            Empezar gratis
                        </Link>
                    ) : (
                        <button className="w-full py-3.5 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53] text-white font-bold rounded-xl shadow-[0_6px_20px_rgba(255,107,107,0.3)] hover:shadow-[0_8px_25px_rgba(255,107,107,0.5)] transition-all text-center hover:-translate-y-0.5">
                            Empezar gratis
                        </button>
                    )}
                </div>
            </div>

            {/* Nota de cuentas adicionales */}
            <div className="text-center">
                <p className="text-sm text-slate-500">
                    ¿Más de 15 cuentas? <a href="https://wa.link/xua0ua" target="_blank" rel="noreferrer" className="text-[#FF6B6B] hover:underline font-medium">Contáctanos para un plan a medida</a>
                </p>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import SubscribeButton from './SubscribeButton';

interface DynamicPricingFormProps {
    copRate: number;
}

export default function DynamicPricingForm({ copRate }: DynamicPricingFormProps) {
    const [accountsCount, setAccountsCount] = useState<number>(1);

    // Formula: $47 base price (includes 1) + $15 for each additional
    const usdPrice = 47 + ((accountsCount - 1) * 15);
    const copPriceEstimate = Math.round(usdPrice * copRate);
    const formattedCop = new Intl.NumberFormat('es-CO').format(copPriceEstimate);

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 max-w-lg mx-auto mb-10 text-left shadow-sm">
            <div className="mb-6">
                <label htmlFor="ad_accounts_count" className="block text-sm font-medium text-gray-300 mb-2">
                    ¿Cuántas cuentas publicitarias quieres auditar?
                </label>
                <select
                    id="ad_accounts_count"
                    value={accountsCount}
                    onChange={(e) => setAccountsCount(parseInt(e.target.value))}
                    className="w-full bg-[#16213E] border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] transition-all"
                >
                    <option value="1">1 cuenta ($47 USD) - Incluida en el plan</option>
                    <option value="2">2 cuentas ($62 USD)</option>
                    <option value="3">3 cuentas ($77 USD)</option>
                    <option value="4">4 cuentas ($92 USD)</option>
                    <option value="5">5 cuentas ($107 USD)</option>
                </select>
                <p className="text-xs text-slate-400 mt-2">
                    Incluye 1 cuenta en el plan base. Cada cuenta adicional cuesta $15 USD / mes.
                </p>
            </div>

            <ul className="space-y-4 mb-8 text-gray-300">
                <li className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Auditorías de campañas ilimitadas
                </li>
                <li className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Análisis profundo con IA avanzada
                </li>
                <li className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Generación de hooks y copys optimizados
                </li>
                <li className="flex items-center">
                    <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Soporte prioritario
                </li>
            </ul>

            <div className="text-center mb-6">
                <div className="flex justify-center items-baseline gap-2 transition-all">
                    <span className="text-5xl font-extrabold text-white">${usdPrice}</span>
                    <span className="text-xl font-medium text-gray-400">USD / mes</span>
                </div>
                <div className="text-sm font-medium text-gray-500 mt-2">≈ ${formattedCop} COP</div>
            </div>

            <p className="text-center text-sm text-green-600 font-semibold mb-6">
                ¡Incluye 7 días de prueba gratis!
            </p>

            <div className="flex justify-center">
                <SubscribeButton accountsCount={accountsCount} formattedCop={formattedCop} />
            </div>
        </div>
    );
}

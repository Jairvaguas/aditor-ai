'use client';

import { useState } from 'react';
import SubscribeButton from './SubscribeButton';

interface DynamicPricingFormProps {
    copRate: number;
}

export default function DynamicPricingForm({ copRate }: DynamicPricingFormProps) {
    const [accountsCount, setAccountsCount] = useState<number>(1);

    let usdPrice = 47;
    if (accountsCount === 1) usdPrice = 47;
    else if (accountsCount === 2) usdPrice = 62;
    else if (accountsCount === 3) usdPrice = 77;
    else if (accountsCount === 4) usdPrice = 92;
    else if (accountsCount === 5) usdPrice = 107;
    else if (accountsCount === 10) usdPrice = 157; // 6-10 package
    else if (accountsCount === 15) usdPrice = 197; // 11-15 package
    else if (accountsCount === 16) usdPrice = 0;   // 16+ package (contact)

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
                    <option value="10">Paquete 6-10 cuentas ($157 USD)</option>
                    <option value="15">Paquete 11-15 cuentas ($197 USD)</option>
                    <option value="16">Más de 16 cuentas - Contáctanos</option>
                </select>
                <p className="text-xs text-slate-400 mt-2">
                    Incluye 1 cuenta en el plan base. Ahorra eligiendo paquetes por volumen.
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
                    {accountsCount === 16 ? (
                        <span className="text-4xl font-extrabold text-white">A Medida</span>
                    ) : (
                        <>
                            <span className="text-5xl font-extrabold text-white">${usdPrice}</span>
                            <span className="text-xl font-medium text-gray-400">USD / mes</span>
                        </>
                    )}
                </div>
            </div>

            <p className="text-center text-sm text-green-600 font-semibold mb-6">
                {accountsCount === 16 ? 'Armamos un plan especial para tu agencia.' : '¡Incluye 7 días de prueba gratis!'}
            </p>

            <div className="flex justify-center">
                {accountsCount === 16 ? (
                    <a
                        href="https://wa.link/xua0ua"
                        target="_blank"
                        rel="noreferrer"
                        className="px-8 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53] text-white font-bold rounded-xl shadow-[0_6px_20px_rgba(255,107,107,0.35)] hover:shadow-[0_8px_25px_rgba(255,107,107,0.5)] transition-all duration-300 transform hover:-translate-y-1 w-full text-center"
                    >
                        Hablar con ventas
                    </a>
                ) : (
                    <SubscribeButton accountsCount={accountsCount} formattedCop={formattedCop} />
                )}
            </div>
        </div>
    );
}

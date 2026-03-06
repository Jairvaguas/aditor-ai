'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface AdAccount {
    id: string;
    account_id: string;
    name: string;
    currency: string;
}

export default function AccountSelector({ 
    accounts, 
    connectedAccountIds = [],
    maxAccounts = 1 
}: { 
    accounts: AdAccount[], 
    connectedAccountIds?: string[],
    maxAccounts?: number 
}) {
    const [loadingAccount, setLoadingAccount] = useState<string | null>(null);
    const router = useRouter();

    const connectedCount = connectedAccountIds.length;

    const handleSelect = async (acc: AdAccount) => {
        const isAlreadyConnected = connectedAccountIds.includes(acc.account_id);
        
        // Si ya está conectada, solo cambiar a ella
        if (isAlreadyConnected) {
            setLoadingAccount(acc.account_id);
            try {
                const res = await fetch('/api/auth/switch-account', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ adAccountId: acc.account_id })
                });
                const data = await res.json();
                if (data.success) {
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Switch error:', error);
            }
            return;
        }

        // Si no está conectada, verificar límite
        if (connectedCount >= maxAccounts) {
            alert(`Tu plan permite ${maxAccounts} cuenta(s). Contacta soporte para agregar más.`);
            return;
        }

        setLoadingAccount(acc.account_id);
        try {
            const res = await fetch('/api/auth/select-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    adAccountId: acc.account_id,
                    accountName: acc.name,
                    currency: acc.currency 
                })
            });
            const data = await res.json();
            if (data.success && data.redirectUrl) {
                router.push(data.redirectUrl);
            } else {
                if (data.error === 'account_limit_reached') {
                    alert(`Tu plan permite ${data.maxAccounts} cuenta(s). Upgrade para agregar más.`);
                } else if (data.error === 'account_already_in_use') {
                    router.push('/conectar?error=account_already_in_use');
                } else {
                    router.push('/conectar?error=selection_failed');
                }
            }
        } catch (error) {
            console.error('Selection error:', error);
            router.push('/conectar?error=exception');
        } finally {
            setLoadingAccount(null);
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto">
            <div className="text-sm text-slate-400 text-center mb-2">
                {connectedCount} / {maxAccounts} cuentas vinculadas
            </div>
            {accounts.map((acc) => {
                const isConnected = connectedAccountIds.includes(acc.account_id);
                const isAtLimit = connectedCount >= maxAccounts && !isConnected;
                
                return (
                    <button
                        key={acc.id}
                        onClick={() => handleSelect(acc)}
                        disabled={!!loadingAccount || isAtLimit}
                        className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 text-left cursor-pointer shadow-lg
                            ${isConnected
                                ? 'bg-[#00D4AA]/10 border-[#00D4AA]/40'
                                : isAtLimit
                                    ? 'bg-[#16213E] border-white/5 opacity-50 cursor-not-allowed'
                                    : 'bg-[#16213E] border-white/5 hover:border-[#1877F2]/50 hover:bg-[#1A284B] hover:-translate-y-1'
                            }
                            ${loadingAccount && loadingAccount !== acc.account_id ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <div>
                            <div className="font-bold text-lg text-white mb-1">{acc.name}</div>
                            <div className="text-sm text-gray-400">ID: {acc.account_id} • {acc.currency}</div>
                            {isConnected && (
                                <div className="text-xs font-semibold text-[#00D4AA] mt-1 uppercase tracking-wide flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Vinculada
                                </div>
                            )}
                            {isAtLimit && !isConnected && (
                                <div className="text-xs font-semibold text-[#FF6B6B] mt-1">
                                    Límite de cuentas alcanzado
                                </div>
                            )}
                        </div>
                        <div className={isConnected ? 'text-[#00D4AA]' : 'text-[#1877F2]'}>
                            {loadingAccount === acc.account_id ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : isConnected ? (
                                <span className="text-sm font-medium">Ir al dashboard →</span>
                            ) : (
                                <ArrowRight className="w-6 h-6" />
                            )}
                        </div>
                    </button>
                );
            })}
            {loadingAccount && (
                <p className="text-sm mt-6 text-[#00D4AA] animate-pulse text-center">
                    Procesando... Esto puede tomar unos segundos.
                </p>
            )}
        </div>
    );
}

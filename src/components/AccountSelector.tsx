'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

interface AdAccount {
    id: string;
    account_id: string;
    name: string;
    currency: string;
}

export default function AccountSelector({ accounts, currentSelection }: { accounts: AdAccount[], currentSelection?: string | null }) {
    const [selectedAccount, setSelectedAccount] = useState<string | null>(currentSelection || null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSelect = async (accountId: string) => {
        setSelectedAccount(accountId);
        setIsLoading(true);

        try {
const acc = accounts.find(a => a.account_id === accountId);
            const currency = acc?.currency || 'USD';
            const bodyPayload = JSON.stringify({ adAccountId: accountId, currency });
            
            const res = await fetch('/api/auth/select-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: bodyPayload
            });

            const data = await res.json();

            if (data.success && data.auditId) {
                router.push(`/teaser?auditId=${data.auditId}`);
            } else {
                console.error("Error creating audit:", data.error);
                if (data.error === 'account_already_in_use') {
                    router.push('/conectar?error=account_already_in_use');
                } else if (data.error === 'already_locked') {
                    router.push('/conectar?error=account_locked');
                } else if (data.error === 'meta_api_error') {
                    router.push('/conectar?error=meta_api_error');
                } else {
                    router.push('/conectar?error=selection_failed');
                }
            }
        } catch (error) {
            console.error("Selection error:", error);
            router.push('/conectar?error=exception');
        } finally {
            // We keep loading true because we are navigating away
            if (!selectedAccount) {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto">
            {accounts.map((acc) => (
                <button
                    key={acc.id}
                    onClick={() => handleSelect(acc.account_id)}
                    disabled={isLoading || (!!currentSelection && currentSelection !== acc.account_id)}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 text-left cursor-pointer shadow-lg
                        ${selectedAccount === acc.account_id
                            ? 'bg-[#1877F2]/20 border-[#1877F2] transform scale-[1.02]'
                            : 'bg-[#16213E] border-white/5 hover:border-[#1877F2]/50 hover:bg-[#1A284B] hover:-translate-y-1'
                        }
                        ${isLoading && selectedAccount !== acc.account_id ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                    `}
                >
                    <div>
                        <div className="font-bold text-lg text-white mb-1">{acc.name}</div>
                        <div className="text-sm text-gray-400">ID: {acc.account_id} • Moneda: {acc.currency}</div>
                        {currentSelection === acc.account_id && (
                            <div className="text-xs font-semibold text-[#00D4AA] mt-1 uppercase tracking-wide">
                                Cuenta Vinculada a tu Plan
                            </div>
                        )}
                    </div>

                    <div className="text-[#1877F2]">
                        {selectedAccount === acc.account_id && isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <ArrowRight className="w-6 h-6" />
                        )}
                    </div>
                </button>
            ))}

            {isLoading && (
                <p className="text-sm mt-6 text-[#00D4AA] animate-pulse">
                    Generando tu primera auditoría con IA. Esto puede tomar unos segundos...
                </p>
            )}
        </div>
    );
}

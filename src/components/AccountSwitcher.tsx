'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, Loader2 } from 'lucide-react';

interface ConnectedAccount {
    ad_account_id: string;
    account_name: string;
    currency: string;
}

export default function AccountSwitcher({ 
    accounts, 
    selectedAccountId 
}: { 
    accounts: ConnectedAccount[];
    selectedAccountId: string | null;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentAccount = accounts.find(a => a.ad_account_id === selectedAccountId);
    const displayName = currentAccount?.account_name || 'Seleccionar cuenta';

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitch = async (adAccountId: string) => {
        if (adAccountId === selectedAccountId) {
            setIsOpen(false);
            return;
        }
        setSwitching(true);
        try {
            const res = await fetch('/api/auth/switch-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adAccountId })
            });
            const data = await res.json();
            if (data.success) {
                setIsOpen(false);
                router.refresh();
            }
        } catch (error) {
            console.error('Error switching account:', error);
        } finally {
            setSwitching(false);
        }
    };

    // Si solo tiene 1 cuenta, mostrar solo el nombre sin dropdown
    if (accounts.length <= 1) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300">
                <span className="truncate max-w-[180px]">{displayName}</span>
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
            >
                {switching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                <span className="truncate max-w-[180px]">{displayName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 min-w-[260px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-800">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Cuentas vinculadas</span>
                    </div>
                    {accounts.map((acc) => (
                        <button
                            key={acc.ad_account_id}
                            onClick={() => handleSwitch(acc.ad_account_id)}
                            disabled={switching}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800/50 transition-colors
                                ${acc.ad_account_id === selectedAccountId ? 'bg-slate-800/30' : ''}
                                ${switching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <div>
                                <div className="text-sm font-medium text-white">{acc.account_name}</div>
                                <div className="text-xs text-slate-500">ID: {acc.ad_account_id} • {acc.currency}</div>
                            </div>
                            {acc.ad_account_id === selectedAccountId && (
                                <Check className="w-4 h-4 text-[#00D4AA]" />
                            )}
                        </button>
                    ))}
                    <div className="border-t border-slate-800">
                        <a
                            href="/conectar/cuentas"
                            className="block px-4 py-3 text-sm text-[#FF6B6B] hover:bg-slate-800/50 transition-colors font-medium"
                        >
                            + Administrar cuentas
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

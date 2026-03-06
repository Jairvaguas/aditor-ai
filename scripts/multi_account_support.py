import os

# Definitions
FILE_ROUTE_SELECT = "src/app/api/auth/select-account/route.ts"
FILE_ROUTE_SWITCH = "src/app/api/auth/switch-account/route.ts"
FILE_ROUTE_GET = "src/app/api/auth/connected-accounts/route.ts"
FILE_COMP_SELECTOR = "src/components/AccountSelector.tsx"
FILE_PAGE_CUENTAS = "src/app/conectar/cuentas/page.tsx"

CONTENT_ROUTE_SELECT = """import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { adAccountId, accountName, currency = 'USD' } = body;

        if (!adAccountId) {
            return NextResponse.json({ error: 'Missing adAccountId' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // 1. Obtener perfil del usuario
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('meta_access_token, selected_ad_account_id, ad_accounts_count')
            .eq('clerk_user_id', clerkUserId)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 500 });
        }

        const maxAccounts = profile.ad_accounts_count || 1;

        // 2. Contar cuentas ya vinculadas por este usuario
        const { count: currentCount } = await supabase
            .from('connected_accounts')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', clerkUserId)
            .eq('is_active', true);

        // 3. Verificar si esta cuenta ya está vinculada por este usuario
        const { data: existingAccount } = await supabase
            .from('connected_accounts')
            .select('id')
            .eq('user_id', clerkUserId)
            .eq('ad_account_id', adAccountId)
            .single();

        if (existingAccount) {
            // Ya la tiene vinculada, simplemente seleccionarla como activa
            await supabase
                .from('profiles')
                .update({ selected_ad_account_id: adAccountId, moneda: currency })
                .eq('clerk_user_id', clerkUserId);

            return NextResponse.json({ success: true, redirectUrl: '/dashboard' });
        }

        // 4. Verificar que no exceda el límite de cuentas
        if ((currentCount || 0) >= maxAccounts) {
            return NextResponse.json({ 
                error: 'account_limit_reached',
                message: `Tu plan permite ${maxAccounts} cuenta(s). Upgrade para agregar más.`,
                currentCount,
                maxAccounts
            }, { status: 403 });
        }

        // 5. Verificar que la cuenta no esté reclamada por otro usuario
        const { data: globalCheck } = await supabase
            .from('connected_accounts')
            .select('user_id')
            .eq('ad_account_id', adAccountId)
            .eq('is_active', true)
            .neq('user_id', clerkUserId)
            .limit(1);

        if (globalCheck && globalCheck.length > 0) {
            return NextResponse.json({ error: 'account_already_in_use' }, { status: 403 });
        }

        // 6. Insertar nueva cuenta vinculada
        const { error: insertError } = await supabase
            .from('connected_accounts')
            .insert({
                user_id: clerkUserId,
                ad_account_id: adAccountId,
                account_name: accountName || `Cuenta ${adAccountId}`,
                currency: currency,
                is_active: true
            });

        if (insertError) {
            console.error('Error inserting connected account:', insertError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // 7. Actualizar selected_ad_account_id en profiles (cuenta activa en el dashboard)
        await supabase
            .from('profiles')
            .update({ 
                selected_ad_account_id: adAccountId,
                moneda: currency
            })
            .eq('clerk_user_id', clerkUserId);

        return NextResponse.json({ success: true, redirectUrl: '/dashboard' });

    } catch (error: any) {
        console.error('Error in select-account API:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
"""

CONTENT_ROUTE_SWITCH = """import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { adAccountId } = await request.json();
        if (!adAccountId) {
            return NextResponse.json({ error: 'Missing adAccountId' }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        // Verificar que la cuenta pertenece al usuario
        const { data: account } = await supabase
            .from('connected_accounts')
            .select('id, currency')
            .eq('user_id', clerkUserId)
            .eq('ad_account_id', adAccountId)
            .eq('is_active', true)
            .single();

        if (!account) {
            return NextResponse.json({ error: 'Account not found or not yours' }, { status: 404 });
        }

        // Actualizar la cuenta seleccionada en el perfil
        await supabase
            .from('profiles')
            .update({ 
                selected_ad_account_id: adAccountId,
                moneda: account.currency || 'USD'
            })
            .eq('clerk_user_id', clerkUserId);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Error switching account:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
"""

CONTENT_ROUTE_GET = """import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = getSupabaseAdmin();

        const { data: accounts, error } = await supabase
            .from('connected_accounts')
            .select('ad_account_id, account_name, currency, connected_at')
            .eq('user_id', clerkUserId)
            .eq('is_active', true)
            .order('connected_at', { ascending: true });

        if (error) {
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('selected_ad_account_id, ad_accounts_count')
            .eq('clerk_user_id', clerkUserId)
            .single();

        return NextResponse.json({
            accounts: accounts || [],
            selectedAccountId: profile?.selected_ad_account_id,
            maxAccounts: profile?.ad_accounts_count || 1
        });

    } catch (error: any) {
        console.error('Error fetching connected accounts:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
"""

CONTENT_COMP_SELECTOR = """'use client';
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
"""

CONTENT_PAGE_CUENTAS = """import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getAdAccounts } from '@/lib/meta-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSelector from '@/components/AccountSelector';

export default async function SelectAccountPage() {
    const { userId } = await auth();
    if (!userId) {
        redirect('/login?redirect=/conectar');
    }

    const supabase = getSupabaseAdmin();

    // Obtener perfil con token y límite de cuentas
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('meta_access_token, selected_ad_account_id, ad_accounts_count')
        .eq('clerk_user_id', userId)
        .single();

    if (error || !profile?.meta_access_token) {
        redirect('/conectar?error=token_exchange_failed');
    }

    // Obtener cuentas ya vinculadas
    const { data: connectedAccounts } = await supabase
        .from('connected_accounts')
        .select('ad_account_id')
        .eq('user_id', userId)
        .eq('is_active', true);

    const connectedAccountIds = (connectedAccounts || []).map(a => a.ad_account_id);

    // Obtener todas las cuentas disponibles en Meta
    let adAccounts = [];
    try {
        adAccounts = await getAdAccounts(profile.meta_access_token);
    } catch (e: any) {
        console.error('Error fetching ad accounts from Meta:', e);
        redirect('/conectar?error=meta_api_error');
    }

    if (!adAccounts || adAccounts.length === 0) {
        redirect('/conectar?error=no_ad_accounts');
    }

    const maxAccounts = profile.ad_accounts_count || 1;

    return (
        <div className="flex flex-col min-h-screen bg-[#0B1120] text-[#F0F0F0] font-sans selection:bg-[#FF6B6B]/30 pt-32">
            <Navbar />
            <main className="flex-grow max-w-2xl mx-auto px-6 py-12 w-full text-center">
                <h1 className="text-3xl font-bold mb-4">Selecciona tus Cuentas Publicitarias</h1>
                <p className="text-gray-400 mb-10">
                    Tu plan permite hasta {maxAccounts} cuenta{maxAccounts > 1 ? 's' : ''}. 
                    Selecciona las cuentas que quieres auditar.
                </p>
                <AccountSelector 
                    accounts={adAccounts} 
                    connectedAccountIds={connectedAccountIds}
                    maxAccounts={maxAccounts}
                />
            </main>
            <Footer />
        </div>
    );
}
"""

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {path}")

write_file(FILE_ROUTE_SELECT, CONTENT_ROUTE_SELECT)
write_file(FILE_ROUTE_SWITCH, CONTENT_ROUTE_SWITCH)
write_file(FILE_ROUTE_GET, CONTENT_ROUTE_GET)
write_file(FILE_COMP_SELECTOR, CONTENT_COMP_SELECTOR)
write_file(FILE_PAGE_CUENTAS, CONTENT_PAGE_CUENTAS)

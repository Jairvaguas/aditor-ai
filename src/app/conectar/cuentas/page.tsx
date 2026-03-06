import React from 'react';
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

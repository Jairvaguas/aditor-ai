import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { getAdAccounts } from '@/lib/meta-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSelector from '@/components/AccountSelector';

export default async function SelectAccountPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in?redirect_url=/conectar');
    }

    // Obtenemos el token del usuario para llamar a Meta
    const { data: account, error } = await supabaseAdmin
        .from('connected_accounts')
        .select('access_token')
        .eq('user_id', userId)
        .single();

    if (error || !account?.access_token) {
        redirect('/conectar?error=auth_required');
    }

    // Buscamos las cuentas en Meta
    let adAccounts = [];
    try {
        adAccounts = await getAdAccounts(account.access_token);
    } catch (e: any) {
        console.error("Error fetching ad accounts from Meta:", e);
        redirect('/conectar?error=meta_api_error');
    }

    if (!adAccounts || adAccounts.length === 0) {
        redirect('/conectar?error=no_ad_accounts');
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0B1120] text-[#F0F0F0] font-sans selection:bg-[#FF6B6B]/30 pt-32">
            <Navbar />
            <main className="flex-grow max-w-2xl mx-auto px-6 py-12 w-full text-center">
                <h1 className="text-3xl font-bold mb-4">Selecciona tu Cuenta Publicitaria</h1>
                <p className="text-gray-400 mb-10">
                    Elige con qué cuenta publicitaria de Meta quieres realizar la auditoría gratuita.
                </p>

                <AccountSelector accounts={adAccounts} />
            </main>
            <Footer />
        </div>
    );
}

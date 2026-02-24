
import { NextResponse } from 'next/server';
import { exchangeCodeForToken, getAdAccounts, getCampaignInsights, getMetaUser } from '@/lib/meta-auth';
import { generateAudit } from '@/lib/audit';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // 1. Validar request
    if (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=auth_denied`);
    }

    if (!code) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=missing_code`);
    }

    // TODO: Validar state cookie (simplificado para MVP, pero recomendado)

    try {
        // Obtenemos user de Clerk actual
        const { userId: clerkUserId } = await auth();

        if (!clerkUserId) {
            // Si no tiene sesion, redirigimos a login, y luego a conectar
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?redirect=/conectar`);
        }

        // 2. Intercambio de Token
        const accessToken = await exchangeCodeForToken(code);

        // 3. Guardar Token en Supabase (tabla profiles)
        const { error: dbError } = await supabaseAdmin
            .from('profiles')
            .update({
                meta_access_token: accessToken,
                // Si el usuario acaba de conectar, asumiremos que en algun punto
                // podria guardar selected_ad_account_id, pero el request pedía guardarlo
                // aqui si era posible o en el siguiente paso.
                // Como obtenemos selected_ad_account_id? 
                // Ah, el usuario pidio:
                // "Guardar el token en Supabase tabla profiles del usuario actual (selected_ad_account_id y un nuevo campo meta_access_token)"
            })
            .eq('id', clerkUserId);

        // (Opcional, pero util: si el req decia "selected_ad_account_id", tal vez tambien debemos 
        // traer adAccounts y guardar el primero para cumplirlo a raja tabla o simplemente delegar a /conectar/cuentas)
        // Revisemos el request: "Guardar el token en Supabase tabla profiles del usuario actual (selected_ad_account_id y un nuevo campo meta_access_token)"
        
        // Mejor obtenemos las cuentas y guardamos la primera
        const adAccounts = await getAdAccounts(accessToken);
        
        if (adAccounts.length > 0) {
            const selectedAccount = adAccounts[0];
            await supabaseAdmin
                .from('profiles')
                .update({ selected_ad_account_id: selectedAccount.account_id })
                .eq('id', clerkUserId);
        }

        if (dbError) {
            console.error('Error saving token to profile:', dbError);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_error`);
        }

        // 6. Redirigir a Selección de Cuentas si se autentico y guardo todo bien.
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar/cuentas`);

    } catch (err: any) {
        console.error('Callback Error:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=callback_exception&details=${encodeURIComponent(err.message || 'unknown')}`);
    }
}

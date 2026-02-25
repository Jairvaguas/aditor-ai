
import { NextResponse } from 'next/server';
import { exchangeCodeForToken, getAdAccounts, getCampaignInsights, getMetaUser } from '@/lib/meta-auth';
import { generateAudit } from '@/lib/audit';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('=== META CALLBACK ===');
    console.log('code:', searchParams.get('code'));
    console.log('state:', searchParams.get('state'));
    console.log('error:', searchParams.get('error'));

    // 1. Validar request
    if (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=auth_denied`);
    }

    if (!code || !state) {
        console.error('Missing params:', { code, state });
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=missing_params`);
    }

    // TODO: Validar state cookie (simplificado para MVP, pero recomendado)

    try {
        // Obtenemos user de Clerk actual
        const clerkUserId = state; // We receive Clerk userId from Meta 'state' param

        if (!clerkUserId) {
            // Si no tiene sesion, redirigimos a login, y luego a conectar
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?redirect=/conectar`);
        }

        // 2. Intercambio de Token
        const accessToken = await exchangeCodeForToken(code);

        // 3. Guardar Token en Supabase (tabla profiles)
        console.log("DEBUG - Intentando UPSERT de token para clerkUserId:", clerkUserId);
        const { data: updatedRecords, error: dbError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                clerk_user_id: clerkUserId, 
                meta_access_token: accessToken,
                email: 'pending@aditor-ai.com',
                nombre: 'Usuario Meta'
            }, { onConflict: 'clerk_user_id' })
            .select();
            
        if (dbError) {
            console.error("DEBUG - Fallo en UPSERT de token:", { 
                message: dbError.message, 
                details: dbError.details, 
                hint: dbError.hint,
                code: dbError.code
            });
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_error`);
        }
            
        if (!updatedRecords || updatedRecords.length === 0) {
            console.error("CRITICAL DB ERROR: El UPSERT falló silenciosamente devolviendo cero filas para clerk_user_id:", clerkUserId);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_upsert_failed`);
        }

        // (Opcional, pero util: si el req decia "selected_ad_account_id", tal vez tambien debemos 
        // traer adAccounts y guardar el primero para cumplirlo a raja tabla o simplemente delegar a /conectar/cuentas)
        // Revisemos el request: "Guardar el token en Supabase tabla profiles del usuario actual (selected_ad_account_id y un nuevo campo meta_access_token)"

        // Mejor obtenemos las cuentas y guardamos la primera
        const adAccounts = await getAdAccounts(accessToken);

        if (adAccounts.length > 0) {
            const selectedAccount = adAccounts[0];
            const { error: accDbError } = await supabaseAdmin
                .from('profiles')
                .upsert({ 
                    clerk_user_id: clerkUserId, 
                    selected_ad_account_id: selectedAccount.account_id,
                    email: 'pending@aditor-ai.com',
                    nombre: 'Usuario Meta'
                }, { onConflict: 'clerk_user_id' });
                
            if (accDbError) {
                 console.error("DEBUG - Fallo en UPSERT de ad account:", { 
                     message: accDbError.message, 
                     details: accDbError.details, 
                     hint: accDbError.hint
                 });
                 // We don't hard fail here to at least let them connect, but logged it.
            }
        }

        // 6. Redirigir a Selección de Cuentas si se autentico y guardo todo bien.
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar/cuentas`);

    } catch (err: any) {
        console.error('Callback Error:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=callback_exception&details=${encodeURIComponent(err.message || 'unknown')}`);
    }
}

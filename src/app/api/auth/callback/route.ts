
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
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/sign-in?redirect_url=/conectar`);
        }

        // 2. Intercambio de Token
        const accessToken = await exchangeCodeForToken(code);

        // 3. Obtener info de usuario de Meta
        const metaUser = await getMetaUser(accessToken);

        // 4. Obtener Cuentas Publicitarias
        const adAccounts = await getAdAccounts(accessToken);

        if (adAccounts.length === 0) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=no_ad_accounts`);
        }

        // --- SELECCION AUTOMATICA (ZERO-CLICK) ---
        // Tomamos la primera cuenta disponible
        const selectedAccount = adAccounts[0];

        // 5. Guardar/Actualizar Token en Supabase
        const { error: dbError } = await supabaseAdmin
            .from('connected_accounts')
            .upsert({
                user_id: clerkUserId,
                ad_account_id: selectedAccount.account_id, // e.g., '123456789'
                facebook_user_id: metaUser.id,
                access_token: accessToken,
                account_name: selectedAccount.name,
                currency: selectedAccount.currency
            }, { onConflict: 'ad_account_id' });

        if (dbError) {
            console.error('Error saving connected account:', dbError);
            // Seguimos adelante, quizas fallo el upsert pero queremos mostrar el resultado si es posible,
            // aunque para persistencia futura es malo. Mejor redirigir con error si es critico.
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_error`);
        }

        // 6. Ejecutar Auditoria Inmediata (Teaser)
        // Traemos insights de los ultimos 30 dias
        const campaigns = await getCampaignInsights(accessToken, selectedAccount.account_id);

        if (!campaigns || campaigns.length === 0) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=no_campaign_data`);
        }

        // Generamos auditoria con IA
        // Nota: generateAudit guarda en DB tambien.
        const auditResult = await generateAudit(
            campaigns,
            clerkUserId,
            selectedAccount.currency
        );

        // 7. Redirigir al Teaser
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/teaser?auditId=${auditResult.id}`);

    } catch (err: any) {
        console.error('Callback Error:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=callback_exception&details=${encodeURIComponent(err.message || 'unknown')}`);
    }
}

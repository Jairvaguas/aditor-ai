import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCampaignInsights } from '@/lib/meta-auth';
import { generateAudit } from '@/lib/audit';

export async function POST(request: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Obtener Perfil (Tokens, Moneda, Plan)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('meta_access_token, selected_ad_account_id, moneda, plan')
            .eq('clerk_user_id', clerkUserId)
            .single();

        if (profileError || !profile || !profile.meta_access_token || !profile.selected_ad_account_id) {
            return NextResponse.json({ error: 'Missing profile data or tokens' }, { status: 400 });
        }

        const accessToken = profile.meta_access_token;
        const adAccountId = profile.selected_ad_account_id;
        const currency = profile.moneda || 'USD';
        const plan = profile.plan || 'trial';

        // 2. Regla de Trial a Conversión
        if (plan === 'trial') {
            const { count, error: countError } = await supabaseAdmin
                .from('auditorias')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', clerkUserId);

            if (!countError && count && count > 0) {
                return NextResponse.json({
                    success: false,
                    reason: 'trial_exhausted',
                    redirectUrl: '/subscribe'
                });
            }
        }

        // 3. Obtener Campañas de Meta
        let campaigns;
        try {
            campaigns = await getCampaignInsights(accessToken, adAccountId);
        } catch (metaErr: any) {
            console.error('Meta API Error fetching insights:', metaErr.message);
            return NextResponse.json({ error: 'meta_api_error', details: metaErr.message }, { status: 502 });
        }

        if (!campaigns || campaigns.length === 0) {
            return NextResponse.json({ error: 'no_campaign_data' }, { status: 400 });
        }

        // 4. Generar Auditoría (IA)
        console.log("DEBUG - Iniciando proceso de IA...");
        const auditResult = await generateAudit(campaigns, clerkUserId, currency);

        // 5. Devolver Éxito
        return NextResponse.json({
            success: true,
            auditId: auditResult.id,
            redirectUrl: `/reporte/${auditResult.id}`
        });

    } catch (error: any) {
        console.error('Error in /api/audit/start:', error);
        return NextResponse.json({ error: 'audit_failed', message: error.message || 'Server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateAudit } from '@/lib/audit';
import { getCampaignInsights } from '@/lib/meta-auth';
import { sendWeeklyAuditEmail } from '@/lib/emails';
import { XMLParser } from 'fast-xml-parser';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
    // Verificar que el request viene de Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Traer todos los usuarios con plan activo o trial vigente
    const { data: users } = await supabase
        .from('profiles')
        .select('clerk_user_id, email, nombre, meta_access_token, moneda, pais, plan, trial_ends_at, is_subscribed')
        .or('is_subscribed.eq.true,trial_ends_at.gt.now()');

    if (!users || users.length === 0) {
        return NextResponse.json({ message: 'No active users' });
    }

    const results = [];
    const parser = new XMLParser();

    for (const user of users) {
        // Saltar usuarios sin token de Meta
        if (!user.meta_access_token) {
            results.push({ userId: user.clerk_user_id, status: 'skipped', reason: 'no_meta_token' });
            continue;
        }

        try {
            // Obtener todas las cuentas vinculadas y activas
            const { data: accounts } = await supabase
                .from('connected_accounts')
                .select('ad_account_id, currency, account_name')
                .eq('user_id', user.clerk_user_id)
                .eq('is_active', true);

            if (!accounts || accounts.length === 0) {
                results.push({ userId: user.clerk_user_id, status: 'skipped', reason: 'no_accounts' });
                continue;
            }

            for (const account of accounts) {
                try {
                    // Obtener datos REALES de Meta Ads
                    const campaigns = await getCampaignInsights(
                        user.meta_access_token,
                        account.ad_account_id
                    );

                    // Si no hay campañas, saltar
                    if (!campaigns || campaigns.length === 0) {
                        results.push({ 
                            userId: user.clerk_user_id, 
                            adAccountId: account.ad_account_id, 
                            status: 'skipped', 
                            reason: 'no_campaigns' 
                        });
                        continue;
                    }

                    // Generar auditoría con datos reales
                    const audit = await generateAudit(
                        campaigns,
                        user.clerk_user_id,
                        user.moneda || account.currency || 'USD',
                        user.pais || 'CO'
                    );

                    // Marcar como automática
                    await supabase
                        .from('auditorias')
                        .update({ tipo: 'automatica', ad_account_id: account.ad_account_id })
                        .eq('id', audit.id);

                    // Parse XML para extraer datos del email
                    let score = 0;
                    let hallazgosCount = 0;
                    let roas = 0;
                    let gasto = 0;
                    try {
                        const parsed = parser.parse(audit.xml);
                        const auditData = parsed.auditoria;
                        score = parseInt(auditData?.score_cuenta?.valor) || 0;
                        
                        const findings = auditData?.hallazgos?.hallazgo;
                        hallazgosCount = Array.isArray(findings) ? findings.length : (findings ? 1 : 0);
                        
                        roas = parseFloat(auditData?.metricas_globales?.roas_promedio) || 0;
                        gasto = parseFloat(auditData?.metricas_globales?.gasto_total_30d) || 0;
                    } catch (e) {
                        console.error('Error parsing XML for email:', e);
                    }

                    // Enviar email semanal
                    await sendWeeklyAuditEmail(
                        user.email,
                        audit.id,
                        score,
                        hallazgosCount,
                        roas,
                        gasto,
                        user.moneda || account.currency || 'USD'
                    );

                    results.push({ 
                        userId: user.clerk_user_id, 
                        adAccountId: account.ad_account_id, 
                        auditId: audit.id, 
                        status: 'ok', 
                        emailSent: true 
                    });

                } catch (accError: any) {
                    console.error(`Error processing account ${account.ad_account_id} for user ${user.clerk_user_id}:`, accError?.message);
                    results.push({ 
                        userId: user.clerk_user_id, 
                        adAccountId: account.ad_account_id, 
                        status: 'error', 
                        error: accError?.message 
                    });
                }

                // Esperar 30 segundos entre cada cuenta para no saturar APIs
                await sleep(30000);
            }

        } catch (error: any) {
            console.error(`Error processing user ${user.clerk_user_id}:`, error?.message);
            results.push({ userId: user.clerk_user_id, status: 'error', error: error?.message });
        }
    }

    return NextResponse.json({ processed: results.length, results });
}
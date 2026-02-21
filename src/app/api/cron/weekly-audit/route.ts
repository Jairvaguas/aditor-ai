import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateAudit } from '@/lib/audit';
import { sendWeeklyAuditEmail } from '@/lib/emails';
import { XMLParser } from 'fast-xml-parser';

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

    // Traer todos los usuarios con plan activo
    const { data: users } = await supabase
        .from('profiles')
        .select('*, connected_accounts(*)')
        .in('plan', ['trial', 'active']);

    if (!users || users.length === 0) {
        return NextResponse.json({ message: 'No active users' });
    }

    const results = [];
    const parser = new XMLParser();

    for (const user of users) {
        try {
            if (!user.connected_accounts?.length) continue;

            const account = user.connected_accounts[0];

            // Por ahora usar datos de prueba hasta tener Meta API real
            const mockCampaigns = [{
                id: 'auto_001',
                nombre: 'Auditoría automática semanal',
                ad_account_id: account.ad_account_id,
                estado: 'activa',
                presupuesto_diario: 50,
                metricas_30d: {
                    roas: 2.1, ctr: 1.2, cpm: 12.5, cpc: 1.04,
                    frecuencia: 3.2, gasto_total: 1400,
                    conversiones: 45, valor_conversiones: 2940,
                    pagos_iniciados: 58, visitas_landing: 1680
                }
            }];

            const audit = await generateAudit(
                mockCampaigns,
                user.clerk_user_id,
                user.moneda,
                user.pais
            );

            // Actualizar tipo a automatica
            await supabase
                .from('auditorias')
                .update({ tipo: 'automatica' })
                .eq('id', audit.id);

            // Parse XML to get score and findings count for email
            let score = 0;
            let hallazgosCount = 0;
            try {
                const parsed = parser.parse(audit.xml);
                const scoreVal = parsed.auditoria?.score_cuenta?.valor;
                score = parseInt(scoreVal) || 0;

                const findings = parsed.auditoria?.hallazgos?.hallazgo;
                hallazgosCount = Array.isArray(findings) ? findings.length : (findings ? 1 : 0);
            } catch (e) {
                console.error('Error parsing XML for email:', e);
            }

            // Send Weekly Email
            await sendWeeklyAuditEmail(
                user.email,
                audit.id,
                score,
                hallazgosCount,
                mockCampaigns[0].metricas_30d.roas,
                mockCampaigns[0].metricas_30d.gasto_total
            );

            results.push({ userId: user.clerk_user_id, auditId: audit.id, status: 'ok', emailSent: true });

        } catch (error) {
            console.error(`Error processing user ${user.clerk_user_id}:`, error);
            results.push({ userId: user.clerk_user_id, status: 'error', error });
        }
    }

    return NextResponse.json({ processed: results.length, results });
}
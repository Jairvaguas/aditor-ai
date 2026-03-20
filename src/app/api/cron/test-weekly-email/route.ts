import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateAudit } from '@/lib/audit';
import { getCampaignInsights } from '@/lib/meta-auth';
import { sendWeeklyAuditEmail } from '@/lib/emails';
import { XMLParser } from 'fast-xml-parser';

export async function GET(request: Request) {
    // Solo permitir en desarrollo o con auth
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sourceEmail = 'contacto@78grados.com'; // cuenta con token de Meta
    const sendToEmail = 'jairvaguas@gmail.com'; // donde enviar el email de prueba
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Buscar tu perfil
    const { data: profile } = await supabase
        .from('profiles')
        .select('clerk_user_id, email, meta_access_token, moneda, pais')
        .eq('email', sourceEmail)
        .single();

    if (!profile || !profile.meta_access_token) {
        return NextResponse.json({ error: 'Profile not found or no meta token' }, { status: 404 });
    }

    // Buscar tu primera cuenta vinculada
    const { data: accounts } = await supabase
        .from('connected_accounts')
        .select('ad_account_id, currency')
        .eq('user_id', profile.clerk_user_id)
        .eq('is_active', true)
        .limit(1);

    if (!accounts || accounts.length === 0) {
        return NextResponse.json({ error: 'No connected accounts' }, { status: 404 });
    }

    const account = accounts[0];

    try {
        // Obtener datos reales de Meta
        const campaigns = await getCampaignInsights(
            profile.meta_access_token,
            account.ad_account_id
        );

        // Generar auditoría real
        const audit = await generateAudit(
            campaigns,
            profile.clerk_user_id,
            profile.moneda || account.currency || 'COP',
            profile.pais || 'CO'
        );

        // Marcar como automática
        await supabase
            .from('auditorias')
            .update({ tipo: 'automatica', ad_account_id: account.ad_account_id })
            .eq('id', audit.id);

        // Parse XML
        const parser = new XMLParser();
        let score = 0, hallazgosCount = 0, roas = 0, gasto = 0;
        try {
            const parsed = parser.parse(audit.xml);
            const auditData = parsed.auditoria;
            score = parseInt(auditData?.score_cuenta?.valor) || 0;
            const findings = auditData?.hallazgos?.hallazgo;
            hallazgosCount = Array.isArray(findings) ? findings.length : (findings ? 1 : 0);
            roas = parseFloat(auditData?.metricas_globales?.roas_promedio) || 0;
            gasto = parseFloat(auditData?.metricas_globales?.gasto_total_30d) || 0;
        } catch (e) {
            console.error('Error parsing XML:', e);
        }

        // Enviar email de prueba
        await sendWeeklyAuditEmail(
            sendToEmail,
            audit.id,
            score,
            hallazgosCount,
            roas,
            gasto
        );

        return NextResponse.json({ 
            success: true, 
            message: `Email enviado a ${sendToEmail}`,
            auditId: audit.id,
            score,
            hallazgosCount
        });

    } catch (error: any) {
        console.error('Test email error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

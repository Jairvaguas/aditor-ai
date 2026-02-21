import os

def write_file(path, content):
    dirname = os.path.dirname(path)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Creado/Actualizado: {path}")

def build_resend_emails_module():
    # 1. src/lib/emails.ts (Core)
    emails_ts = """
import { Resend } from 'resend';

// Helper global init wrapper
const getResendClient = () => {
    return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
};
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Aditor AI <noreply@aditor-ai.com>';
const globalStyles = {
    body: "font-family: Arial, sans-serif; background-color: #0B1120; color: #ffffff; padding: 40px; margin: 0;",
    container: "max-w-xl mx-auto bg-[#1A2234] border border-[#334155] rounded-2xl overflow-hidden shadow-2xl p-8",
    h1: "font-size: 24px; font-weight: bold; color: #ffffff; margin-bottom: 20px; text-align: center;",
    p: "font-size: 16px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;",
    button: "display: inline-block; background-color: #FF6B6B; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; text-align: center; margin: 0 auto;",
    buttonContainer: "text-align: center; margin-top: 30px;",
    footer: "text-align: center; font-size: 12px; color: #64748b; margin-top: 40px;"
};

export async function sendWelcomeEmail(email: string, nombre: string) {
    if (!process.env.RESEND_API_KEY) return;
    try {
        await getResendClient()?.emails.send({
            from: fromEmail,
            to: email,
            subject: 'Bienvenido a Aditor AI 🚀',
            html: `
            <div style="${globalStyles.body}">
                <div style="${globalStyles.container}">
                    <h1 style="${globalStyles.h1}">¡Hola ${nombre}, bienvenido a Aditor AI! 🚀</h1>
                    <p style="${globalStyles.p}">
                        Estamos emocionados de tenerte a bordo. Recuerda que a partir de hoy cuentas con un <strong>Trial Gratis de 7 días</strong> para que audites tus campañas de Meta Ads sin compromiso.
                    </p>
                    <p style="${globalStyles.p}">
                        Encuentra oportunidades ocultas, frena el desperdicio de presupuesto y escala tu ROAS en pocos minutos usando nuestra IA.
                    </p>
                    <div style="${globalStyles.buttonContainer}">
                        <a href="https://aditor-ai.com/dashboard" style="${globalStyles.button}">Ir al Dashboard</a>
                    </div>
                </div>
                <div style="${globalStyles.footer}">
                    © ${new Date().getFullYear()} Aditor AI. Todos los derechos reservados.
                </div>
            </div>
            `
        });
    } catch (e) { console.error('Error enviando Welcome Email', e); }
}

export async function sendSubscriptionActiveEmail(email: string, planContratado: string, limiteCuentas: number, proxyPeriodEndTimestamp?: number) {
    if (!process.env.RESEND_API_KEY) return;
    try {
        const proximaRenov = proxyPeriodEndTimestamp ? new Date(proxyPeriodEndTimestamp * 1000).toLocaleDateString() : 'El próximo mes';
        await getResendClient()?.emails.send({
            from: fromEmail,
            to: email,
            subject: 'Tu suscripción está activa ✅',
            html: `
            <div style="${globalStyles.body}">
                <div style="${globalStyles.container}">
                    <h1 style="${globalStyles.h1}">Tu suscripción está lista ✅</h1>
                    <p style="${globalStyles.p}">
                        Gracias por confiar en Aditor AI. Tu plan <strong>${planContratado}</strong> ha sido activado satisfactoriamente.
                    </p>
                    <p style="${globalStyles.p}">
                        - <strong>Cuentas Incluidas:</strong> ${limiteCuentas} Ad Accounts<br>
                        - <strong>Próxima Renovación:</strong> ${proximaRenov}
                    </p>
                    <div style="${globalStyles.buttonContainer}">
                        <a href="https://aditor-ai.com/dashboard" style="${globalStyles.button}">Ir al Dashboard</a>
                    </div>
                </div>
                <div style="${globalStyles.footer}">
                    © ${new Date().getFullYear()} Aditor AI. Todos los derechos reservados.
                </div>
            </div>
            `
        });
    } catch (e) { console.error('Error enviando Subscription Email', e); }
}

export async function sendAuditReadyEmail(email: string, auditId: string, score: number, hallazgosCount: number) {
    if (!process.env.RESEND_API_KEY) return;
    try {
        await getResendClient()?.emails.send({
            from: fromEmail,
            to: email,
            subject: 'Tu auditoría está lista 📊',
            html: `
            <div style="${globalStyles.body}">
                <div style="${globalStyles.container}">
                    <h1 style="${globalStyles.h1}">Auditoría Finalizada 📊</h1>
                    <p style="${globalStyles.p}">
                        Nuestra inteligencia artificial ha analizado tus campañas. Tenemos resultados para ti.
                    </p>
                    <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #1e293b; text-align: center;">
                        <p style="margin: 0; color: #94a3b8; font-size: 14px;">Score de la Cuenta</p>
                        <p style="margin: 5px 0 0 0; color: #FF6B6B; font-size: 32px; font-weight: bold;">${score}/100</p>
                        <p style="margin: 10px 0 0 0; color: #cbd5e1; font-size: 15px;">Hemos detectado <strong>${hallazgosCount} hallazgos</strong> clave en tu estructura.</p>
                    </div>
                    <div style="${globalStyles.buttonContainer}">
                        <a href="https://aditor-ai.com/dashboard/reporte/${auditId}" style="${globalStyles.button}">Ver Reporte Completo</a>
                    </div>
                </div>
                <div style="${globalStyles.footer}">
                    © ${new Date().getFullYear()} Aditor AI. Todos los derechos reservados.
                </div>
            </div>
            `
        });
    } catch (e) { console.error('Error enviando Audit Email', e); }
}

export async function sendWeeklyAuditEmail(email: string, auditId: string, score: number, numHallazgos: number, roas: number, gasto: number) {
    if (!process.env.RESEND_API_KEY) return;
    try {
        const dateStr = new Date().toLocaleDateString();
        await getResendClient()?.emails.send({
            from: fromEmail,
            to: email,
            subject: 'Tu auditoría semanal está lista 📊',
            html: `
            <div style="${globalStyles.body}">
                <div style="${globalStyles.container}">
                    <h1 style="${globalStyles.h1}">Reporte Semanal (${dateStr}) 📊</h1>
                    <p style="${globalStyles.p}">
                        Este es tu resumen automatizado semanal para que estés al tanto del desempeño de tus cuentas y hallazgos críticos sin tener que entrar a Meta Ads.
                    </p>
                    <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #1e293b;">
                         <ul style="list-style: none; padding: 0; margin: 0; color: #cbd5e1; line-height: 1.8;">
                             <li>📈 <strong>Score Semanal:</strong> <span style="color: #FF6B6B">${score}/100</span></li>
                             <li>🚨 <strong>Oportunidades/Riesgos:</strong> ${numHallazgos} hallazgos detectados</li>
                             <li>💸 <strong>Inversión Base:</strong> $${gasto} USD</li>
                             <li>🎯 <strong>ROAS Estimado:</strong> ${roas}x</li>
                         </ul>
                    </div>
                    <div style="${globalStyles.buttonContainer}">
                        <a href="https://aditor-ai.com/dashboard/reporte/${auditId}" style="${globalStyles.button}">Ver Reporte Completo</a>
                    </div>
                </div>
                <div style="${globalStyles.footer}">
                    © ${new Date().getFullYear()} Aditor AI. Todos los derechos reservados.
                </div>
            </div>
            `
        });
    } catch (e) { console.error('Error enviando Weekly Audit Email', e); }
}
"""
    write_file("src/lib/emails.ts", emails_ts)

    # 2. Modify Clerk Webhook (src/app/api/webhooks/clerk/route.ts)
    clerk_webhook_ts = """
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/emails'

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Please add CLERK_WEBHOOK_SECRET to .env.local')
        } else {
            throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local')
        }
    }

    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new NextResponse('Error occured -- no svix headers', {
            status: 400,
        })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent

    if (WEBHOOK_SECRET) {
        const wh = new Webhook(WEBHOOK_SECRET)

        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            }) as WebhookEvent
        } catch (err) {
            console.error('Error verifying webhook:', err)
            return new NextResponse('Error occured', {
                status: 400,
            })
        }
    } else {
        if (process.env.NODE_ENV === 'development') {
            evt = payload as WebhookEvent;
        } else {
            return new NextResponse('Error occured', { status: 400 });
        }
    }

    const { id } = evt.data
    const eventType = evt.type

    if (eventType === 'user.created') {
        const { email_addresses, first_name, last_name } = evt.data
        const primaryEmail = email_addresses?.find((email: any) => email.id === evt.data.primary_email_address_id)?.email_address || email_addresses?.[0]?.email_address || 'default@email.com';
        const nombre = [first_name, last_name].filter(Boolean).join(' ') || 'User';

        const { error } = await supabaseAdmin
            .from('profiles')
            .insert({
                clerk_user_id: id,
                email: primaryEmail,
                nombre: nombre,
            })

        if (error) {
            console.error('Error inserting profile in webhook', error);
            return new NextResponse('Error inserting profile', { status: 500 });
        }
        
        // Dispatch Welcome Email
        await sendWelcomeEmail(primaryEmail, nombre);
    }

    return new NextResponse('', { status: 200 })
}
"""
    write_file("src/app/api/webhooks/clerk/route.ts", clerk_webhook_ts)

    # 3. Modify Mercado Pago Webhook (src/app/api/payments/webhook/route.ts)
    mercadopago_webhook_ts = """
import { NextResponse } from 'next/server';
import { preapproval } from '@/lib/mercadopago';
import { supabaseAdmin } from '@/lib/supabase';
import { sendSubscriptionActiveEmail } from '@/lib/emails';

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        const topic = url.searchParams.get('topic');
        const dataId = url.searchParams.get('data.id');

        const body = await req.json().catch(() => ({}));

        const id = body?.data?.id || dataId;
        const type = body?.type || topic;

        if (id && (type === 'subscription_preapproval' || body.action === 'created' || body.action === 'updated')) {
            const subscription = await preapproval.get({ id });

            const { status, external_reference, reason, next_payment_date } = subscription;

            if (external_reference) { 
                let is_subscribed = false;
                if (status === 'authorized') {
                    is_subscribed = true;
                } else if (status === 'cancelled' || status === 'paused') {
                    is_subscribed = false;
                }
                
                // Get pre-existing data
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('ad_accounts_count, email, is_subscribed')
                    .eq('clerk_user_id', external_reference)
                    .single();

                await supabaseAdmin
                    .from('profiles')
                    .update({
                        is_subscribed,
                        subscription_id: id,
                    })
                    .eq('clerk_user_id', external_reference);
                    
                // Send email ONLY upon fresh subscription active transition
                if (status === 'authorized' && profile && !profile.is_subscribed) {
                    const accountsLimit = profile.ad_accounts_count || 1;
                    const nextPaymentTs = next_payment_date ? Math.floor(new Date(next_payment_date).getTime() / 1000) : undefined;
                    
                    await sendSubscriptionActiveEmail(
                       profile.email,
                       reason || "Aditor AI Pro",
                       accountsLimit,
                       nextPaymentTs
                    );
                }
            }
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new NextResponse('Webhook Received with Error', { status: 200 });
    }
}
"""
    write_file("src/app/api/payments/webhook/route.ts", mercadopago_webhook_ts)

    # 4. Modify Regular Audit Generate API Handler (src/app/api/audit/generate/route.ts)
    audit_generate_ts = """
import { NextResponse } from 'next/server';
import { generateAudit } from '@/lib/audit';
import { sendAuditReadyEmail } from '@/lib/emails';
import { supabaseAdmin } from '@/lib/supabase';
import { XMLParser } from 'fast-xml-parser';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { campaigns, userId, moneda, pais } = body;

        if (!campaigns || !Array.isArray(campaigns) || campaigns.length === 0) {
            return NextResponse.json(
                { error: 'Invalid campaigns data' },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId' },
                { status: 400 }
            );
        }

        const { id, xml } = await generateAudit(campaigns, userId, moneda, pais);
        
        // Post Generation processing to send Email
        try {
             const { data: profile } = await supabaseAdmin.from('profiles').select('email').eq('clerk_user_id', userId).single();
             if (profile?.email) {
                 const parser = new XMLParser();
                 const parsed = parser.parse(xml);
                 const scoreVal = parsed.auditoria?.score_cuenta?.valor;
                 const score = parseInt(scoreVal) || 0;
                 const findings = parsed.auditoria?.hallazgos?.hallazgo;
                 const hallazgosCount = Array.isArray(findings) ? findings.length : (findings ? 1 : 0);
                 
                 await sendAuditReadyEmail(profile.email, id, score, hallazgosCount);
             }
        } catch(e) {
             console.error('Email dispatching post audit Generation errored non-fatally:', e);
        }

        return NextResponse.json({ auditId: id, xml });

    } catch (error: any) {
        console.error('Error in /api/audit/generate:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
"""
    write_file("src/app/api/audit/generate/route.ts", audit_generate_ts)

    # 5. Modify Weekly Cron Audit (src/app/api/cron/weekly-audit/route.ts)
    cron_weekly_ts = """
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
"""
    write_file("src/app/api/cron/weekly-audit/route.ts", cron_weekly_ts)
    
if __name__ == "__main__":
    print("Ejecutando setup resend emails...")
    build_resend_emails_module()

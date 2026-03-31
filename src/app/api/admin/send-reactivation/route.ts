import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const FROM = 'Aditor AI <noreply@aditor-ai.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aditor-ai.com';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: users, error } = await supabase
    .from('profiles')
    .select('email, nombre')
    .is('meta_access_token', null);

  if (error || !users || users.length === 0) {
    return NextResponse.json({ error: 'No users found', detail: error }, { status: 404 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const results = [];

  for (const user of users) {
    const nombre = user.nombre?.split(' ')[0] || 'ahí';
    try {
      await resend.emails.send({
        from: FROM,
        to: user.email,
        subject: `${nombre}, tu auditoría de Meta Ads te está esperando 👀`,
        html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0f1e;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td align="center" style="padding-bottom:28px;">
          <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
            Aditor <span style="color:#3b82f6;">AI</span>
          </span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background-color:#111827;border-radius:16px;padding:36px 32px;border:1px solid #1e2d45;">

          <p style="margin:0 0 6px;font-size:32px;text-align:center;">👀</p>

          <h2 style="margin:16px 0 8px;font-size:20px;font-weight:700;color:#ffffff;text-align:center;line-height:1.3;">
            ${nombre}, tu auditoría te está esperando
          </h2>

          <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;text-align:center;line-height:1.6;">
            Te registraste en Aditor AI pero todavía no conectaste tu cuenta de Meta Ads.
            <strong style="color:#ffffff;">Solo falta ese paso</strong> para ver exactamente 
            qué está fallando en tus campañas.
          </p>

          <!-- Lo que vas a descubrir -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #1e2d45;">
              <span style="font-size:14px;color:#d1d5db;">🔍 <strong style="color:#ffffff;">Qué campañas te están quemando plata</strong> sin resultados</span>
            </td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #1e2d45;">
              <span style="font-size:14px;color:#d1d5db;">📈 <strong style="color:#ffffff;">Tu ROAS real</strong> vs lo que deberías estar obteniendo</span>
            </td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #1e2d45;">
              <span style="font-size:14px;color:#d1d5db;">⚡ <strong style="color:#ffffff;">Oportunidades concretas</strong> para escalar lo que funciona</span>
            </td></tr>
            <tr><td style="padding:8px 0;">
              <span style="font-size:14px;color:#d1d5db;">🛡️ Sin acceso a pagos ni modificaciones — <strong style="color:#ffffff;">solo lectura</strong></span>
            </td></tr>
          </table>

          <!-- Urgencia -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e2d45;border-radius:10px;padding:16px 20px;margin-bottom:28px;border:1px solid #2563eb;">
            <tr><td>
              <p style="margin:0;font-size:14px;color:#93c5fd;text-align:center;line-height:1.6;">
                ⏰ <strong style="color:#ffffff;">Sos uno de los primeros usuarios de Aditor AI.</strong><br>
                Tu trial gratuito está activo — aprovechalo antes de que venza.
              </p>
            </td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${APP_URL}/conectar"
                 style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:16px 40px;border-radius:10px;">
                Conectar Meta Ads ahora
              </a>
            </td></tr>
          </table>

          <p style="margin:20px 0 0;font-size:12px;color:#4b5563;text-align:center;">
            Tarda menos de 1 minuto · Desde tu computadora
          </p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:24px;" align="center">
          <p style="margin:0;font-size:12px;color:#374151;line-height:1.6;">
            © ${new Date().getFullYear()} Aditor AI · 
            <a href="${APP_URL}" style="color:#374151;text-decoration:none;">aditor-ai.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
      });
      results.push({ email: user.email, status: 'sent' });
    } catch (e: any) {
      results.push({ email: user.email, status: 'error', error: e.message });
    }
  }

  return NextResponse.json({ 
    total: users.length, 
    sent: results.filter(r => r.status === 'sent').length,
    results 
  });
}

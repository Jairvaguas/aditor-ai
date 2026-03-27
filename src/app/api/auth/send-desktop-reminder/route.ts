import { auth } from '@clerk/nextjs/server';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Buscar email del usuario en Supabase tabla profiles
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('clerk_user_id', userId)
    .single();

  if (!profile?.email) return NextResponse.json({ ok: false });

  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'Aditor AI <noreply@aditor-ai.com>',
    to: profile.email,
    subject: '⚡ Un paso más para activar Aditor AI',
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Aditor <span style="color:#3b82f6;">AI</span>
              </h1>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#1e293b;border-radius:16px;padding:40px 36px;border:1px solid #334155;">
              
              <!-- Icon -->
              <p style="margin:0 0 24px 0;font-size:48px;text-align:center;">🎯</p>
              
              <!-- Title -->
              <h2 style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:#ffffff;text-align:center;line-height:1.3;">
                Ya casi estás listo para usar Aditor AI
              </h2>
              
              <!-- Subtitle -->
              <p style="margin:0 0 32px 0;font-size:15px;color:#94a3b8;text-align:center;line-height:1.6;">
                Solo falta conectar tu cuenta de Meta Ads. 
                Este paso requiere hacerlo desde tu <strong style="color:#e2e8f0;">computadora</strong> — 
                te lleva menos de 1 minuto.
              </p>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;border-radius:12px;padding:20px 24px;margin-bottom:32px;">
                <tr><td style="padding:6px 0;font-size:14px;color:#e2e8f0;">✅ &nbsp;Leer campañas y métricas (ROAS, CTR, CPM)</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#e2e8f0;">✅ &nbsp;Ver creativos activos</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#e2e8f0;">✅ &nbsp;Analizar frecuencia e impresiones</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#64748b;">❌ &nbsp;Modificar campañas — nunca</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#64748b;">❌ &nbsp;Acceder a datos de pago — nunca</td></tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/conectar"
                       style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:16px 40px;border-radius:12px;letter-spacing:0.2px;">
                      Conectar Meta Ads →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- URL fallback -->
              <p style="margin:24px 0 0 0;font-size:12px;color:#475569;text-align:center;">
                O copiá este link en tu navegador:<br>
                <span style="color:#3b82f6;font-family:monospace;">
                  ${process.env.NEXT_PUBLIC_APP_URL}/conectar
                </span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;" align="center">
              <p style="margin:0;font-size:12px;color:#334155;line-height:1.6;">
                Recibiste este email porque te registraste en Aditor AI.<br>
                Conexión encriptada vía OAuth 2.0 · Nunca modificamos tus campañas.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
  });

  return NextResponse.json({ ok: true });
}

import { Resend } from 'resend';

const getResendClient = () => {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
};

const FROM = 'Aditor AI <noreply@aditor-ai.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aditor-ai.com';

function baseTemplate(content: string, previewText: string = '') {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${previewText}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>
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
          ${content}
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
</html>`;
}

function ctaButton(text: string, url: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0 0;">
    <tr><td align="center">
      <a href="${url}" style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:10px;letter-spacing:0.1px;">
        ${text} &#8250;
      </a>
    </td></tr>
  </table>`;
}

function metaRow(icon: string, text: string, muted = false) {
  return `<tr><td style="padding:7px 0;font-size:14px;color:${muted ? '#4b5563' : '#d1d5db'};">
    ${icon} &nbsp;${text}
  </td></tr>`;
}

// ─── 1. BIENVENIDA ────────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, nombre: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const content = `
      <p style="margin:0 0 6px 0;font-size:32px;text-align:center;">🚀</p>
      <h2 style="margin:16px 0 8px;font-size:20px;font-weight:700;color:#ffffff;text-align:center;line-height:1.3;">
        ¡Bienvenido, ${nombre}!
      </h2>
      <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;text-align:center;line-height:1.6;">
        Ya tenés <strong style="color:#ffffff;">7 días gratis</strong> para auditar tus campañas de Meta Ads con IA.
        Solo falta conectar tu cuenta.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border-radius:10px;padding:16px 20px;margin-bottom:4px;">
        ${metaRow('✅', 'Auditorías automáticas semanales')}
        ${metaRow('✅', 'Análisis de ROAS, CTR, CPM y más')}
        ${metaRow('✅', 'Alertas de campañas en riesgo')}
      </table>
      ${ctaButton('Conectar Meta Ads', APP_URL + '/conectar')}
      <p style="margin:20px 0 0;font-size:12px;color:#4b5563;text-align:center;">
        Cancelás cuando quieras · Sin permanencia
      </p>
    `;
    await getResendClient()?.emails.send({
      from: FROM,
      to: email,
      subject: '¡Bienvenido a Aditor AI! Tu trial de 7 días está activo 🚀',
      html: baseTemplate(content, 'Tu trial gratuito de 7 días ya está activo — conectá Meta Ads y empezá ahora'),
    });
  } catch (e) { console.error('Error sendWelcomeEmail', e); }
}

// ─── 2. RECORDATORIO DESKTOP ──────────────────────────────────────
export async function sendDesktopReminderEmail(email: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const content = `
      <p style="margin:0 0 6px 0;font-size:32px;text-align:center;">💻</p>
      <h2 style="margin:16px 0 8px;font-size:20px;font-weight:700;color:#ffffff;text-align:center;line-height:1.3;">
        Un paso más para activar Aditor AI
      </h2>
      <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;text-align:center;line-height:1.6;">
        Conectar tu cuenta de Meta Ads requiere hacerlo desde tu 
        <strong style="color:#ffffff;">computadora</strong>. 
        Te lleva menos de 1 minuto.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border-radius:10px;padding:16px 20px;margin-bottom:4px;">
        ${metaRow('✅', 'Leer campañas y métricas (ROAS, CTR, CPM)')}
        ${metaRow('✅', 'Ver creativos activos')}
        ${metaRow('✅', 'Analizar frecuencia e impresiones')}
        ${metaRow('❌', 'Modificar campañas — nunca', true)}
        ${metaRow('❌', 'Acceder a datos de pago — nunca', true)}
      </table>
      ${ctaButton('Conectar Meta Ads', APP_URL + '/conectar')}
      <p style="margin:20px 0 0;font-size:12px;color:#4b5563;text-align:center;">
        O copiá este link: <span style="color:#3b82f6;font-family:monospace;">${APP_URL}/conectar</span>
      </p>
    `;
    await getResendClient()?.emails.send({
      from: FROM,
      to: email,
      subject: '⚡ Un paso más para activar Aditor AI',
      html: baseTemplate(content, 'Conectá tu cuenta de Meta Ads desde tu computadora — menos de 1 minuto'),
    });
  } catch (e) { console.error('Error sendDesktopReminderEmail', e); }
}

// ─── 3. SUSCRIPCIÓN ACTIVA ────────────────────────────────────────
export async function sendSubscriptionActiveEmail(
  email: string,
  planContratado: string,
  limiteCuentas: number,
  proxyPeriodEndTimestamp?: number
) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const proximaRenov = proxyPeriodEndTimestamp
      ? new Date(proxyPeriodEndTimestamp * 1000).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'El próximo mes';
    const content = `
      <p style="margin:0 0 6px 0;font-size:32px;text-align:center;">✅</p>
      <h2 style="margin:16px 0 8px;font-size:20px;font-weight:700;color:#ffffff;text-align:center;line-height:1.3;">
        Suscripción confirmada
      </h2>
      <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;text-align:center;line-height:1.6;">
        Tu plan <strong style="color:#ffffff;">${planContratado}</strong> está activo. 
        Ya podés usar todas las funciones de Aditor AI.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border-radius:10px;padding:16px 20px;margin-bottom:4px;">
        ${metaRow('📦', `Plan: <strong style="color:#ffffff;">${planContratado}</strong>`)}
        ${metaRow('🔗', `Cuentas incluidas: <strong style="color:#ffffff;">${limiteCuentas} Ad Account${limiteCuentas > 1 ? 's' : ''}</strong>`)}
        ${metaRow('📅', `Próxima renovación: <strong style="color:#ffffff;">${proximaRenov}</strong>`)}
      </table>
      ${ctaButton('Ir al dashboard', APP_URL + '/dashboard')}
    `;
    await getResendClient()?.emails.send({
      from: FROM,
      to: email,
      subject: '¡Tu suscripción a Aditor AI está activa! ✅',
      html: baseTemplate(content, `Tu plan ${planContratado} está activo — accedé al dashboard`),
    });
  } catch (e) { console.error('Error sendSubscriptionActiveEmail', e); }
}

// ─── 4. TRIAL POR VENCER ─────────────────────────────────────────
export async function sendTrialExpiryEmail(email: string, nombre: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const content = `
      <p style="margin:0 0 6px 0;font-size:32px;text-align:center;">⏰</p>
      <h2 style="margin:16px 0 8px;font-size:20px;font-weight:700;color:#ffffff;text-align:center;line-height:1.3;">
        Tu prueba gratis vence mañana
      </h2>
      <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;text-align:center;line-height:1.6;">
        Hola ${nombre}, mañana termina tu período de prueba. 
        Activá tu suscripción para no perder el acceso.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border-radius:10px;padding:16px 20px;margin-bottom:4px;">
        ${metaRow('🚨', 'Auditorías semanales automáticas')}
        ${metaRow('🚨', 'Reportes completos de campañas')}
        ${metaRow('🚨', 'Alertas de campañas con pérdida activa')}
      </table>
      ${ctaButton('Activar suscripción', APP_URL + '/subscribe')}
      <p style="margin:20px 0 0;font-size:12px;color:#4b5563;text-align:center;">
        Cancelás cuando quieras · Sin permanencia
      </p>
    `;
    await getResendClient()?.emails.send({
      from: FROM,
      to: email,
      subject: '⏰ Tu prueba gratuita vence mañana — no pierdas el acceso',
      html: baseTemplate(content, 'Tu trial vence mañana — activá tu suscripción para mantener el acceso'),
    });
  } catch (e) { console.error('Error sendTrialExpiryEmail', e); }
}

// ─── 5. AUDITORÍA LISTA ───────────────────────────────────────────
export async function sendAuditReadyEmail(
  email: string,
  auditId: string,
  score: number,
  hallazgosCount: number
) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const scoreColor = score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444';
    const content = `
      <p style="margin:0 0 6px 0;font-size:32px;text-align:center;">📊</p>
      <h2 style="margin:16px 0 8px;font-size:20px;font-weight:700;color:#ffffff;text-align:center;line-height:1.3;">
        Tu auditoría está lista
      </h2>
      <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;text-align:center;line-height:1.6;">
        Analizamos tus campañas de Meta Ads. Acá está el resumen:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border-radius:10px;padding:24px;margin-bottom:28px;text-align:center;">
        <tr><td>
          <div style="font-size:52px;font-weight:800;color:${scoreColor};line-height:1;">${score}</div>
          <div style="font-size:13px;color:#6b7280;margin-top:6px;">Score de salud de tu cuenta</div>
        </td></tr>
        <tr><td style="padding-top:16px;font-size:15px;color:#d1d5db;">
          Encontramos <strong style="color:#ffffff;">${hallazgosCount} hallazgos</strong> que requieren atención
        </td></tr>
      </table>
      ${ctaButton('Ver reporte completo', APP_URL + '/reporte/' + auditId)}
    `;
    await getResendClient()?.emails.send({
      from: FROM,
      to: email,
      subject: `Tu auditoría está lista — ${hallazgosCount} hallazgos detectados 📊`,
      html: baseTemplate(content, `Score ${score}/100 · ${hallazgosCount} hallazgos en tus campañas`),
    });
  } catch (e) { console.error('Error sendAuditReadyEmail', e); }
}

// ─── 6. AUDITORÍA SEMANAL ─────────────────────────────────────────
export async function sendWeeklyAuditEmail(
  email: string,
  auditId: string,
  score: number,
  numHallazgos: number,
  roas: number,
  gasto: number,
  moneda: string = 'USD'
) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    const scoreColor = score > 70 ? '#10b981' : score > 40 ? '#f59e0b' : '#ef4444';
    const dateStr = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const gastoFmt = new Intl.NumberFormat('es-CO').format(gasto);
    const content = `
      <p style="margin:0 0 6px 0;font-size:32px;text-align:center;">📈</p>
      <h2 style="margin:16px 0 4px;font-size:20px;font-weight:700;color:#ffffff;text-align:center;line-height:1.3;">
        Reporte semanal
      </h2>
      <p style="margin:0 0 28px;font-size:13px;color:#6b7280;text-align:center;">${dateStr}</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border-radius:10px;padding:20px 24px;margin-bottom:28px;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1e2d45;">
            <span style="font-size:13px;color:#6b7280;">Score semanal</span>
            <span style="float:right;font-size:15px;font-weight:700;color:${scoreColor};">${score}<span style="font-size:12px;font-weight:400;color:#6b7280;">/100</span></span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1e2d45;">
            <span style="font-size:13px;color:#6b7280;">Hallazgos detectados</span>
            <span style="float:right;font-size:15px;font-weight:700;color:#ffffff;">${numHallazgos}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1e2d45;">
            <span style="font-size:13px;color:#6b7280;">Inversión (30d)</span>
            <span style="float:right;font-size:15px;font-weight:700;color:#ffffff;">$${gastoFmt} <span style="font-size:12px;font-weight:400;color:#6b7280;">${moneda}</span></span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;">
            <span style="font-size:13px;color:#6b7280;">ROAS estimado</span>
            <span style="float:right;font-size:15px;font-weight:700;color:#ffffff;">${roas}x</span>
          </td>
        </tr>
      </table>
      ${ctaButton('Ver reporte completo', APP_URL + '/reporte/' + auditId)}
      <p style="margin:20px 0 0;font-size:12px;color:#4b5563;text-align:center;">
        Próxima auditoría automática: el lunes que viene
      </p>
    `;
    await getResendClient()?.emails.send({
      from: FROM,
      to: email,
      subject: `Tu reporte semanal está listo — Score ${score}/100 📈`,
      html: baseTemplate(content, `Score ${score}/100 · ROAS ${roas}x · ${numHallazgos} hallazgos esta semana`),
    });
  } catch (e) { console.error('Error sendWeeklyAuditEmail', e); }
}

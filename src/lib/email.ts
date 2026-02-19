
import { Resend } from 'resend';

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export async function sendAuditReadyEmail(
  email: string,
  auditId: string,
  score: number,
  hallazgosCount: number
) {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Resend not configured' };

  try {
    const { data, error } = await resend.emails.send({
      from: 'Aditor AI <hola@aditorai.com>',
      to: email,
      subject: `Tu auditoría semanal está lista — ${hallazgosCount} hallazgos detectados 🔍`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1A1A2E; color: #FAFAFA; padding: 40px; border-radius: 16px;">
          <h1 style="color: #E94560; font-size: 24px; margin-bottom: 8px;">Tu auditoría semanal está lista</h1>
          <p style="color: #8892A4; margin-bottom: 24px;">Analizamos tus campañas de Meta Ads. Acá está el resumen:</p>
          
          <div style="background: rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 48px; font-weight: 800; color: ${score > 70 ? '#4ECDC4' : score > 40 ? '#FFE66D' : '#E94560'};">${score}</div>
            <div style="color: #8892A4; font-size: 14px;">Score de salud de tu cuenta</div>
          </div>
  
          <p style="color: #FAFAFA; margin-bottom: 24px;">Encontramos <strong style="color: #E94560;">${hallazgosCount} hallazgos</strong> en tus campañas que requieren atención.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/reporte/${auditId}" 
             style="display: block; background: linear-gradient(135deg, #E94560, #ff8e53); color: white; text-decoration: none; padding: 14px 24px; border-radius: 12px; text-align: center; font-weight: 700; font-size: 16px;">
            Ver reporte completo →
          </a>
          
          <p style="color: #8892A4; font-size: 12px; margin-top: 24px; text-align: center;">
            Próxima auditoría automática: el lunes que viene a las 8AM
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (e) {
    console.error('Exception sending email:', e);
    return { success: false, error: e };
  }
}

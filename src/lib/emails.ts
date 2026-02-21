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
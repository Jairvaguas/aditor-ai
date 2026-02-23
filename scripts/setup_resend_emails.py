import os
import re

def ensure_dir_exists(filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

def update_env():
    env_path = ".env.local"
    if not os.path.exists(env_path):
        return
    with open(env_path, "r", encoding="utf-8") as f:
        content = f.read()
    if "RESEND_FROM_EMAIL=" not in content:
        content += "\nRESEND_FROM_EMAIL=noreply@aditor-ai.com\n"
        with open(env_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated .env.local with RESEND_FROM_EMAIL")

def install_resend():
    print("Installing resend package...")
    os.system("npm install resend")

def create_emails_ts():
    filepath = "src/lib/emails.ts"
    ensure_dir_exists(filepath)
    content = """import { Resend } from 'resend';

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
                    <div style="${globalStyles.buttonContainer}">
                        <a href="https://www.aditor-ai.com/dashboard" style="${globalStyles.button}">Ir al dashboard</a>
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
                    <h1 style="${globalStyles.h1}">Suscripción Confirmada</h1>
                    <p style="${globalStyles.p}">
                        Tu plan <strong>${planContratado}</strong> ha sido activado satisfactoriamente.
                    </p>
                    <p style="${globalStyles.p}">
                        - <strong>Cuentas Incluidas:</strong> ${limiteCuentas} Ad Accounts<br>
                        - <strong>Próxima Renovación:</strong> ${proximaRenov}
                    </p>
                    <div style="${globalStyles.buttonContainer}">
                        <a href="https://www.aditor-ai.com/dashboard" style="${globalStyles.button}">Ir al dashboard</a>
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
                    <h1 style="${globalStyles.h1}">¡Tu auditoría está lista! 📊</h1>
                    <p style="${globalStyles.p}">
                        Nuestra inteligencia artificial ha analizado tus campañas. Tenemos resultados importantes para ti.
                    </p>
                    <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #1e293b; text-align: center;">
                        <p style="margin: 0; color: #94a3b8; font-size: 14px;">Resumen de Hallazgos</p>
                        <p style="margin: 10px 0 0 0; color: #cbd5e1; font-size: 15px;">Hemos detectado <strong>${hallazgosCount} hallazgos</strong> clave sobre tu ROAS, campañas en riesgo y nuevas oportunidades de escala.</p>
                    </div>
                    <div style="${globalStyles.buttonContainer}">
                        <a href="https://www.aditor-ai.com/dashboard/reporte/${auditId}" style="${globalStyles.button}">Ver reporte completo</a>
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
                        Este es tu resumen automatizado semanal para que estés al tanto de las métricas principales de tus campañas.
                    </p>
                    <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid #1e293b;">
                         <ul style="list-style: none; padding: 0; margin: 0; color: #cbd5e1; line-height: 1.8;">
                             <li>📈 <strong>Score Semanal:</strong> <span style="color: #FF6B6B">${score}/100</span></li>
                             <li>🚨 <strong>Oportunidades/Riesgos:</strong> ${numHallazgos} hallazgos</li>
                             <li>💸 <strong>Inversión Base:</strong> $${gasto} USD</li>
                             <li>🎯 <strong>ROAS Estimado:</strong> ${roas}x</li>
                         </ul>
                    </div>
                    <div style="${globalStyles.buttonContainer}">
                        <a href="https://www.aditor-ai.com/dashboard/reporte/${auditId}" style="${globalStyles.button}">Ver reporte completo</a>
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
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Created/Updated src/lib/emails.ts")

def inject_in_file(filepath, import_statement, function_call_pattern, inject_code, inject_after_pattern):
    if not os.path.exists(filepath):
        print(f"File {filepath} does not exist.")
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    changed = False
    
    # Check import
    if "sendWelcomeEmail" not in content and "sendSubscriptionActiveEmail" not in content and "sendAuditReadyEmail" not in content and "sendWeeklyAuditEmail" not in content:
        # Not imported at all, let's inject import after first import
        content = re.sub(r"^(import .*?\n)", r"\1" + import_statement + "\n", content, count=1)
        changed = True

    # Check function call
    if not re.search(function_call_pattern, content):
        content = re.sub(inject_after_pattern, r"\g<0>\n" + inject_code, content)
        changed = True

    if changed:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Injected email code into {filepath}")
    else:
        print(f"Email code already injected in {filepath}")

def main():
    print("Starting Resend emails setup (Idempotent)...")
    update_env()
    install_resend()
    create_emails_ts()

    # The file injections are already manually satisfied in the current codebase versions (based on grep).
    # Setting them up just in case to be fully robust and idempotent.
    inject_in_file(
        "src/app/api/webhooks/clerk/route.ts",
        "import { sendWelcomeEmail } from '@/lib/emails';",
        r"sendWelcomeEmail\(",
        "        await sendWelcomeEmail(primaryEmail, nombre);",
        r"if \(eventType === 'user.created'\) \{[\s\S]*?inserting profile.*?\}\r?\n"
    )

    inject_in_file(
        "src/app/api/payments/webhook/route.ts",
        "import { sendSubscriptionActiveEmail } from '@/lib/emails';",
        r"sendSubscriptionActiveEmail\(",
        """                    const accountsLimit = profile.ad_accounts_count || 1;
                    const nextPaymentTs = next_payment_date ? Math.floor(new Date(next_payment_date).getTime() / 1000) : undefined;
                    await sendSubscriptionActiveEmail(profile.email, reason || "Aditor AI Pro", accountsLimit, nextPaymentTs);""",
        r"if \(status === 'authorized' && profile && !profile.is_subscribed\) \{"
    )

    print("Setup complete.")

if __name__ == '__main__':
    main()

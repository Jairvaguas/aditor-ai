import os

def update_audit_whatsapp_notice():
    filepath = "src/lib/audit.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    target_1 = "   - Si destino es WHATSAPP/MESSENGER: analizar costo por conversación iniciada y estimar conversión offline"
    replace_1 = "   - Si destino es WHATSAPP/MESSENGER: analizar costo por conversación iniciada y estimar conversión offline\n   - IMPORTANTE sobre métricas de respuesta en WhatsApp: la métrica messaging_conversation_replied_7d de Meta solo cuenta respuestas enviadas desde la plataforma nativa de Meta. Muchos negocios usan automatizaciones externas (n8n, ManyChat, chatbots, WhatsApp Business API) que NO se reflejan en esta métrica. Si la tasa de respuesta parece extremadamente baja, NO asumir que el negocio no responde. En su lugar, señalar la discrepancia y recomendar verificar si tienen automatizaciones externas antes de concluir que hay un problema de atención."

    target_2 = "   - Si destino es WHATSAPP/MESSENGER: analizar conversaciones iniciadas como leads"
    replace_2 = "   - Si destino es WHATSAPP/MESSENGER: analizar conversaciones iniciadas como leads\n   - IMPORTANTE: misma nota sobre automatizaciones externas de WhatsApp. No asumir falta de atención si messaging_conversation_replied_7d es bajo."

    updated = False

    if target_1 in content and replace_1 not in content:
        content = content.replace(target_1, replace_1)
        updated = True
        print("Updated SALES target in audit.ts")

    if target_2 in content and replace_2 not in content:
        content = content.replace(target_2, replace_2)
        updated = True
        print("Updated LEADS target in audit.ts")

    if updated:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("File saved successfully.")
    else:
        print("No changes made. Targets might have already been updated or could not be found.")

if __name__ == "__main__":
    update_audit_whatsapp_notice()

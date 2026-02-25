# Directiva: Manejo de Errores y Timeouts en Auditoría (Vercel Hobby Plan)

## Objetivo
El Plan Hobby de Vercel tiene un hard limit de 10 segundos para Serverless Functions. La llamada a la IA de Anthropic en campañas grandes suele rozar o exceder este límite, devolviendo un error HTTP 504 (que devuelve HTML, no JSON). Esto ocasionaba que el frontend (`res.json()`) arrojara una excepción silenciosa no parseada. 

Debemos forzar el Dashboard para que, bajo ninguna circunstancia, el botón rebote al usuario hacia `/conectar`. En cambio, retenerlo, reportear en consola, y arrojar avisos manejables.

## Lógica Implementada
1. **Frontend (`AuditTriggerButton.tsx`)**:
   - Bloque de Try/Catch anidado específicamente para intentar el `.json()`. Si falla, deduce timeout y emite un `alert` local (sin redirección) para salvar el progreso del usuario en el panel.
   - Eliminados todos los redireccionamientos residuales excepto Éxito y Conversión.
2. **Backend (`api/audit/start/route.ts`)**:
   - Etiqueta de `console.log("DEBUG - Iniciando proceso de IA...")` inyectada inmediatamente antes de Anthropic para crear un checkpoint rastreable en el Log de Vercel.
   - Si la API falla, responder con `status: 500` pero incluyendo un objeto legible `{ error: 'audit_failed', message: error.message }`.

## Reglas Derivadas (SOP)
*Si la API de Meta no devuelve campañas*, el backend se aborta antes del timeout, respondiendo `no_campaign_data` y no consume saldo de IA ni tiempo límite.

# Directiva: Correos Transaccionales (Resend)

## Objetivo
Implementar envío de correos automatizados transaccionales utilizando `Resend` ante diferentes eventos de la plataforma (Registro, Pago, Auditoría generada, Auditorías Semanales) conservando la estética predefinida y la estructura limpia del proyecto.

## Entradas Requeridas
- `RESEND_API_KEY`: API Key configurada en el `.env.local`. Todos los correos deben validarla antes de enviarse para evitar fallos tontos.
- Parámetros de correo: `to`, `subject`, `react` o `html`.

## Salidas Esperadas
- Envíos exitosos provenientes del remitente `noreply@aditor-ai.com`.
- Correos construidos con HTML básico, colores `#0B1120` de fondo/texto principal y `#FF6B6B` para acentos.

## Lógica y Pasos
1. La librería base debe existir en `src/lib/emails.ts`. Exportando funciones modulares por cada tipo de email que espera recibir props tipadas en TypeScript.
2. El script de Python `scripts/setup_resend_emails.py` es el absoluto responsable de escribir esta librería y de INYECTAR la función asíncrona a los handlers existentes:
   - *Clerk Webhook* (`src/app/api/webhooks/clerk/route.ts`): en el evento `user.created`.
   - *Mercado Pago Webhook* (`src/app/api/payments/webhook/route.ts`): en el evento `payment.updated` cuando reporta *approved*.
   - *Auditoría Webhook/Manual*: en la función que completa el proceso en crudo de la IA.
   - *Cron*: en la función trigger periodica (o en su defecto un app/api/cron/route.ts nuevo).

## Trampas Conocidas (Edge Cases & Constraints)
- **Fallo de API Key**: Si `RESEND_API_KEY` no existe localmente, el SDK de Resend hace throw o falla silenciosamente, interrumpiendo un posible webhook si el envío no se atrapa en un catch.
  - *Prevención*: Envolver `resend.emails.send` en un `try-catch` para que los errores de resend no maten los Webhooks de pagos ni de la creación de usuario en base de datos.
- **Asincronía (await) en Next.js Serverless**: Asegurarse de retornar un objeto o estado después de enviar los correos o que las funciones se ejecuten y sean *await-eadas* correctamente.
- **Límites de envíos**: Solo se envían correos a dominios válidos.
- Las importaciones del servidor de correos solo deben usarse en componentes Server-Side (rutas de API).

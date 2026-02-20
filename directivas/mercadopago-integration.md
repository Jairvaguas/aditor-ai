# DIRECTIVA: INTEGRACION_MERCADOPAGO

> **ID:** 2026-02-20
> **Script Asociado:** N/A (Ejecución Directa de Agente)
> **Última Actualización:** 2026-02-20
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Integrar Mercado Pago Suscripciones en Aditor AI (Next.js 14 + Clerk + Supabase).
- **Criterio de Éxito:** Un usuario puede suscribirse mediante un botón de pago, el webhook de MP actualiza Supabase, y el dashboard verifica la suscripción activa o el periodo de prueba.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Variables de Entorno (.env.local):**
  - `MERCADOPAGO_ACCESS_TOKEN`
  - `MERCADOPAGO_PUBLIC_KEY`
  - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- **Contexto de Usuario:** `userId` de Clerk.

### Salidas (Outputs)
- **Artefactos Generados:**
  - `src/lib/mercadopago.ts`
  - `src/app/api/payments/create-subscription/route.ts`
  - `src/app/api/payments/webhook/route.ts`
  - `src/components/SubscribeButton.tsx`
  - `src/lib/checkSubscription.ts`
  - `src/app/subscribe/page.tsx`
- **Modificación de BD:** Tabla `users` en Supabase con campos `is_subscribed`, `subscription_id`, `trial_ends_at`.

## 3. Flujo Lógico (Algoritmo)
1. Instalar SDK `mercadopago`.
2. Añadir variables de entorno a `.env.local`.
3. Crear cliente MP en `lib/mercadopago.ts`.
4. Crear endpoint POST `/api/payments/create-subscription` (genera preapproval y devuelve init_point).
5. Crear endpoint POST `/api/payments/webhook` (recibe notificaciones, actualiza Supabase).
6. Modificar base de datos Supabase con nuevas columnas.
7. Crear componente UI `SubscribeButton`.
8. Crear middleware lógico `checkSubscription.ts`.
9. Proteger vista `Dashboard` verificando suscripción.
10. Crear vista `/subscribe` con beneficios y botón.

## 4. Herramientas y Librerías
- **Librerías NPM:** `mercadopago`
- **APIs Externas:** Mercado Pago, Supabase, Clerk

## 5. Restricciones y Casos Borde (Edge Cases)
- **Webhooks:** MP exige respuesta HTTP 200 siempre; de lo contrario reintenta.
- **Trial:** 7 días de trial, luego 185,000 COP/mes recurrentes (≈ $47 USD).
- **TypeScript:** Resolver errores en el mismo archivo.
- **Divisa de la Cuenta (CRÍTICO):** Las cuentas de Mercado Pago de Colombia solo aceptan suscripciones en COP (`currency_id: 'COP'`) y exigen montos superiores a un tope mínimo local. Intentar procesar en USD o con números bajos (ej. 47) causará error `Cannot operate between different countries` o `Invalid field -> auto_recurring.currency_id`. El monto se ajustó a 185,000 COP para compatibilidad.

## 6. Historial de Aprendizaje

| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 2026-02-20 | `Invalid field -> auto_recurring.currency_id` | La cuenta MP es de Colombia y rechaza cobros en USD o montos bajos como 47. | Se cambió la divisa a `COP` y el monto a `185000` en `create-subscription/route.ts`. |

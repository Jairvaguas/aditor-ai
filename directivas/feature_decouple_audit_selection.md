# Directiva: Separación Arquitectónica (Persistencia vs Auditoría)

## Objetivo
Desacoplar radicalmente la selección de la cuenta de la generación de la auditoría. El endpoint `select-account` se ha vuelto un cuello de botella debido a la dependencia síncrona de Meta Insights y Anthropic AI. 
A partir de ahora, elegir la cuenta publicitaria **sólo** actualiza Supremabase e inmediatamente enrumba al usuario hacia el `/dashboard`.

## Archivos a Modificar
- `src/app/api/auth/select-account/route.ts`

## Lógica Backend (API)
1. Extraer o mantener del código la lectura del payload (`adAccountId`, `currency`).
2. Mantener las validaciones Antifraude (Global Lock y Unique lock) y el `.upsert()` subsecuente en `profiles`.
3. **Purgado Radical:** Borrar de inmediato `getCampaignInsights(...)` y `generateAudit(...)`. Todo el bloque entre los comentarios `// 2. We already extracted token...` hasta justo antes de mandar el resultado.
4. Redoblar el éxito: Si el `.upsert()` finaliza sin prender alarmas, responder inmediatamente con un código HTTP `200` y payload: `{ success: true, redirectUrl: '/dashboard' }`. No hay `auditId` en este paso.
5. El Frontend (`AccountSelector.tsx`), que actualmente hace ciegamente un `router.push(data.redirectUrl)`, redirigirá entonces exitosamente al usuario al dashboard.

## Salida
- Script Python que modifique `route.ts`.
- Push a GitHub.

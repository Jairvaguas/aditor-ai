# Directiva: Reversión de Middleware y Saneamiento Definitivo de Insights (Meta)

## Objetivo
1. **Rollback Crítico (Middleware):** A pesar de la advertencia de depreciación en consola, la versión instalada de Clerk para este proyecto depende estructuralmente de `middleware.ts`. Renombrarlo a `proxy.ts` rompió las sesiones. Se debe revertir inmediatamente el archivo.
2. **Campos Seguros (Meta Graph API):** Para erradicar cualquier posibilidad de errores de tipo `OAuthException` o `100` ocasionados por solicitar campos derivados o deprecados (como `roas` o `purchase_roas` que a menudo requieren dependencias extra), se forzará una lista autorizada y 100% segura para la consulta de Insights.
3. **Redirección Frontend Explicita:** Garantizar que el endpoint responda con un explícito `redirectUrl: '/teaser?auditId=[ID]'` y que el frontend (`AccountSelector.tsx`) acate dicha orden directamente, delegando la responsabilidad de conocer la ruta al backend.

## Archivos a Modificar
- `src/proxy.ts` (Renombrar de vuelta a `src/middleware.ts`)
- `src/lib/meta-auth.ts`
- `src/app/api/auth/select-account/route.ts`
- `src/components/AccountSelector.tsx`

## Lógica Backend & Frontend
1. **`meta-auth.ts`**: Reemplazar la lista `fields` por el arreglo estricto proporcionado: `['campaign_name', 'adset_name', 'ad_name', 'spend', 'impressions', 'clicks', 'reach', 'actions']`.
2. **`select-account/route.ts`**: El `NextResponse.json` en caso de éxito ya no solo devuelve `success: true` y `auditId`, sino `redirectUrl: \`/teaser?auditId=${auditResult.id}\``.
3. **`AccountSelector.tsx`**: En lugar de hacer `router.push(\`/teaser?auditId=${data.auditId}\`)`, hacer `router.push(data.redirectUrl)`.

## Salida
- Ejecución de consola (git mv).
- Script Python que modifica las rutas.
- Push a GitHub.

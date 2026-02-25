# Directiva: Corrección de Consulta de Insights de Meta (ROAS vs Purchase ROAS)

## Objetivo
1. **Fix Crítico de Fields:** La API de Meta (v19.0) rechaza consultas que incluyan el campo `roas` de forma nativa en este nivel. Se reemplazará por `purchase_roas`, que es el campo válido para medir el retorno de conversión por defecto.
2. **Protección de Flujo:** Evitar que los pantallazos de carga (congelamientos) prosperen cuando Meta explota. El bloque de petición a Meta Insights será encapsulado en un `try/catch` específico dentro del endpoint, devolviendo una señal inteligible al frontend para una redirección segura en lugar de tronar la validación.

## Archivos a Modificar
- `src/lib/meta-auth.ts`
- `src/app/api/auth/select-account/route.ts`
- `src/components/AccountSelector.tsx`

## Lógica 
1. **En `meta-auth.ts`:** Sustituir `'roas'` por `'purchase_roas'` en el array de `fields` de la función `getCampaignInsights()`.
2. **En `select-account/route.ts`:** Rodear `await getCampaignInsights()` con un `try/catch`. Si Meta rechaza la petición, imprimir el error y retornar `NextResponse.json({ error: 'meta_api_error', details: ... })`.
3. **En `AccountSelector.tsx`:** Anexar un conector en el `if/else` gigante de manejo de errores: `if (data.error === 'meta_api_error') { router.push('/conectar?error=meta_api_error'); }`.

## Salida
- Script Python compilado.
- Git Push.

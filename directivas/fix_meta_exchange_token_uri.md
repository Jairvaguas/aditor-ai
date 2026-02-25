# Directiva: Corrección de redirect_uri en el intercambio de Token de Meta

## Objetivo
Actualizar la URL de redireccionamiento (`redirect_uri`) dentro de la función `exchangeCodeForToken` en `src/lib/meta-auth.ts`, para que coincida exactamente con la misma ruta autorizada (renombrada para eludir el middleware de Clerk).

## Entradas
- Archivo `src/lib/meta-auth.ts`

## Lógica
1. Abrir `src/lib/meta-auth.ts`.
2. Dentro de la función `exchangeCodeForToken`, ubicar la declaración de parámetros de OAuth (`const params = new URLSearchParams({...})`).
3. Cambiar `redirect_uri: \`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback\`,` a `redirect_uri: \`${process.env.NEXT_PUBLIC_APP_URL}/api/meta/callback\`,`.
4. Documentar en esta directiva que en Vercel la variable `NEXT_PUBLIC_APP_URL` debe ser exactamente `https://www.aditor-ai.com` sin slash final.

## Restricciones y Casos Borde
- Meta OAuth en su endpoint de intercambio de tokens exige que el parámetro `redirect_uri` sea *idéntico* al original usado al generar el *Code* en el frontend. De lo contrario fallará con un error de validación perimétrica.
- El usuario es responsable de verificar en Vercel y en Facebook Console que la URL coincida al byte.

## Salidas
- `src/lib/meta-auth.ts` parcheado.
- Cambios a GitHub.

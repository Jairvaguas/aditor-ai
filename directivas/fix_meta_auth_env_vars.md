# Directiva: Sincronización de Variables de Entorno y Hardcodeo de URI en Meta Auth

## Objetivo
Asegurar que el intercambio de tokens de Meta en `src/lib/meta-auth.ts` utilice los nombres exactos de variables de entorno configurados en Vercel, hardcodear la URI de redirección para evitar fallos por dominios dinámicos malformados (sin `www`), y añadir un log condicional para verificar que las credenciales existan en tiempo de ejecución.

## Entradas
- Archivo `src/lib/meta-auth.ts`

## Lógica
1. Ubicar la función `exchangeCodeForToken`.
2. Reemplazar la construcción dinámica de `redirect_uri` por la cadena estática exacta: `https://www.aditor-ai.com/api/meta/callback`.
3. Añadir inmediatamente antes del fetch a Meta: `console.log("Variables check:", { appId: !!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, secret: !!process.env.FACEBOOK_APP_SECRET });`
4. Confirmar que los parámetros `client_id` y `client_secret` estén apuntando inequívocamente a `NEXT_PUBLIC_FACEBOOK_APP_ID` y `FACEBOOK_APP_SECRET` respectivamente.

## Restricciones
- La URL estática `https://www.aditor-ai.com/api/meta/callback` es inamovible para la aplicación en producción. Si se necesita probar en local, el desarrollador deberá cambiarla manualmente a localhost o usar variables. Esta directiva asume enfoque estricto en el fallo de producción de Vercel.

## Salidas
- Archivo `src/lib/meta-auth.ts` modificado.
- Commit y push en GitHub.

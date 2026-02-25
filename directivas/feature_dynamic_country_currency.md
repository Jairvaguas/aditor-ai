# Directiva: Detección Dinámica de País y Moneda mediante Geolocalización IP (Vercel)

## Objetivo
Reemplazar la asignación estática de moneda y país durante la conexión de la cuenta publicitaria Meta. Implementar lógica para leer la cabecera `x-vercel-ip-country`, asignar `pais` y `moneda` basados en la ubicación del usuario, e incorporarlos en la tabla `profiles`.

## Archivos a Modificar
- `src/app/api/meta/callback/route.ts`

## Lógica Backend (API)
1. **Detección de Ubicación:** Extraer el país del usuario desde la variable de request `request.headers.get('x-vercel-ip-country')`.
2. **Asignación Condicional (Fallback Inteligente):**
   - Si es `'MX'`  -> `pais: 'MX'`, `moneda: 'MXN'`
   - Si es `'ES'`  -> `pais: 'ES'`, `moneda: 'EUR'`
   - Por defecto (incluyendo nulos, vacíos o `'CO'`) -> `pais: 'CO'`, `moneda: 'COP'`.
3. **Logueo Diagnóstico:** Imprimir explícitamente `console.log(\`DEBUG - Usuario detectado en: ${detectedCountry} - Asignando moneda: ${assignedCurrency}\`);` para auditoría visual en Vercel.
4. **Modificación de Upserts:** Añadir los campos resultantes `pais` y `moneda` en ambos bloques de `.upsert()` hacia Supabase.

## Salida
- Script Python modificador de rutas.
- Push a GitHub.

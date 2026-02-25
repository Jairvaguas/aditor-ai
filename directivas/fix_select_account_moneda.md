# Directiva: Resolución de Constraint "moneda" y Refinamiento de Logs

## Objetivo
1. **Fix Crítico de Moneda:** La tabla `profiles` espera la columna `moneda`, pero el endpoint de selección de cuenta estaba enviándole el token desactualizado o ignorándolo, o no pasándolo en el upsert.
2. **Fallback Inteligente:** Asegurar que si la moneda viene `undefined`, se asigne `'COP'` (o `'USD'`) para que la base de datos no rechace el registro.
3. **Log de Error Real:** Cambiar el log de Vercel para que, si el upsert vuelve a fallar, imprima el `JSON.stringify(profileError)` completo, exponiendo la columna exacta que falla.

## Archivos a Modificar
- `src/app/api/auth/select-account/route.ts`

## Lógica Backend (API)
1. Extraer `currency` del payload del request y hacer un fallback por defecto a `'COP'`.
2. Incluir explícitamente `moneda: currency || 'COP'` en el objeto de `.upsert()`.
3. Mejorar el bloque de manejo del `profileError` para que imprima `JSON.stringify(profileError)` además del mensaje y el código.

## Salida
- Script Python que modifica la API.
- Git Push.

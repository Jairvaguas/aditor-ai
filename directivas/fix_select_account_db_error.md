# Directiva: Depuración Detallada y Manejo de Conflictos (Unique Constraints) en Selección de Cuenta

## Objetivo
Resolver correctamente los conflictos de base de datos introducidos por la reciente restricción de unicidad (`UNIQUE CONSTRAINT`) sobre la columna `selected_ad_account_id`. La API debe ser capaz de interceptar el código de error SQL `23505` (violación de unicidad) y devolver una respuesta amigable para el frontend, a la vez que se blinda el token de Meta existente durante el Upsert añadiéndolo explícitamente al payload.

## Archivo Objetivo
- `src/app/api/auth/select-account/route.ts`

## Lógica Backend (API)
1. **Preservación de Token en Upsert:** En el payload del `.upsert()` (`// 1. Save selected account...`), agregar la propiedad `meta_access_token: currentProfile.meta_access_token`. Esto asegura de forma 100% determinista que el upsert no intente volcar un valor nulo en caso de reconstruir la fila.
2. **Logg Dinámico & Catch de `23505`:** Reemplazar el bloque `if (profileError)` por una inspección profunda:
   - Imprimir inmediatamente: `console.error(\`DEBUG - Error de Persistencia: ${profileError.message} - Código: ${profileError.code}\`);`
   - Si `profileError.code === '23505'` (o si el mensaje contiene "unique constraint"), devolver `NextResponse.json({ error: 'account_claimed_by_another' }, { status: 409 })`.
   - Si es otro error, mantener el status 500 estándar.

## Salida
- Script Python de parcheo.
- Git Push.

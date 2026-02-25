# Directiva: Prevención de Violaciones de Esquema (Schema Constraints) en Upsert

## Objetivo
Evitar que Supabase rechace el comando `.upsert()` en el callback de Meta cuando intenta crear un registro nuevo para un usuario que aún carece de fila en la tabla `profiles`. La falla ocurre porque Supabase exige valores para columnas como `email` y `nombre` si el esquema estipula `NOT NULL`.

## Entradas
- Archivo `src/app/api/meta/callback/route.ts`

## Lógica
1. **Valores por defecto:** Al objeto enviado en ambos `.upsert()` (`meta_access_token` y más adelante `selected_ad_account_id`), se añadirán de forma incondicional campos dummy para los datos obligatorios, ej: `email: 'pending@aditor-ai.com'`, `nombre: 'Usuario Meta'`.
   *(Nota: Como funciona el Upsert en Supabase, si la fila ya existe, actualizará estas columnas también, a no ser que especifiquemos un parche más avanzado, pero para este MVP destrabará el flujo. Lo ideal sería que la base de datos permita nulos o que el webbook de Clerk provea la data antes).*
2. **Registro avanzado de Errores (Logging):** Modificar el bloque de manejo de `dbError` para que imprima explícitamente:
   - `dbError.message`
   - `dbError.details`
   - `dbError.hint`
   Esto permitirá una lectura instantánea en Vercel sobre *cuál* restricción específica rebotó el insert (Llave Foránea, Required Column, Validación RLS).
3. **Mover el check de error:** El bloque `if (dbError)` original estaba posicionado artificialmente lejos de la primera llamada a la DB. Se debe evaluar inmediatamente para cortar el script de forma segura.

## Salidas
- Script Python que modifica y comitea `route.ts`.
- Push a la rama principal (main).

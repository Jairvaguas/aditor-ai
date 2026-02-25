# Directiva: Corrección de Escritura en Base de Datos (perfiles) post-OAuth

## Objetivo
Solucionar el error de base de datos (`db_error`) que ocurre en el callback de Meta OAuth y que impide guardar el token de acceso.

## Entradas
- Archivo `src/app/api/auth/callback/route.ts`

## Lógica
1. Modificar los logs existentes o añadir nuevos para depurar el error de la base de datos detalladamente:
    - Imprimir `=== DB ERROR ===`
    - Imprimir el `userId` recibido.
    - Imprimir el `JSON.stringify` del error de la DB.
2. Modificar la consulta a Supabase que almacena el `meta_access_token` y `selected_ad_account_id`.
    - En lugar de apuntar a la columna `id` (que es el primary key UUID interno de Supabase), debe usar la columna `clerk_user_id`, ya que el `userId` provisto por Clerk se guarda bajo ese nombre en la tabla `profiles` según lo visto en el Webhook de Clerk.

## Restricciones y Casos Borde
- Es crítico que todos los `.eq('id', clerkUserId)` que referencien `profiles` se cambien a `.eq('clerk_user_id', clerkUserId)`.
- Si esto no se cumple, la DB de Supabase ignora el update (error `row not found` o fallo silencioso), desencadenando el `db_error`.

## Salidas
- `src/app/api/auth/callback/route.ts` corregido.
- Push a GitHub.

# Directiva: Usar Upsert para Guardar el Meta Access Token

## Objetivo
Evitar el error "db_profile_not_found" al persistir el Meta Access Token en la base de datos de Supabase. Esto se logra modificando el método `.update()` por un `.upsert()`, garantizando que si el perfil no existe, el sistema lo cree pasándole la clave foránea `clerk_user_id`.

## Entradas
- Archivo `src/app/api/meta/callback/route.ts`

## Lógica
1. Ubicar la llamada a `supabaseAdmin.from('profiles').update(...)`.
2. Intercambiar la función por `.upsert({ clerk_user_id: clerkUserId, meta_access_token: accessToken }, { onConflict: 'clerk_user_id' })`.
3. Conservar el `.select()` y la validación de que devuelva datos.
4. Actualizar el log para que detalle que se intentó un "upsert".

## Restricciones
- La tabla `profiles` debe tener `clerk_user_id` configurado como clave primaria o tener un constraint de unicidad (UNIQUE) para que la cláusula `onConflict` funcione adecuadamente con la sintaxis de Supabase.
- No tenemos el correo electrónico en este payload de callback porque viene de un flujo de OAuth externo y el scope de Facebook no lo pide (ni se conecta a la cuenta del usuario de Clerk a nivel email en esta instancia específica). Por ende, insertaremos un perfil básico con el ID para satisfacer la restricción. El Webhook de Clerk idealmente debería llenar el resto de la fila después o de antemano.

## Salidas
- Código de `route.ts` parcheado.
- Repositorio actualizado.

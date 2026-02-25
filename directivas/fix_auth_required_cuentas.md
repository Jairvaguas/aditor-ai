# Directiva: Corrección de Redirección auth_required en Selección de Cuentas

## Objetivo
Eliminar el error engañoso `?error=auth_required` y corregir el origen real del problema: La página `/conectar/cuentas` estaba buscando el token en la tabla y columna equivocada, dado que anteriormente migramos la inserción del token a la tabla `profiles`.

## Entradas
- Archivo `src/app/conectar/cuentas/page.tsx`.

## Lógica
1. **Identificación del problema:** En el callback guardamos el token en `profiles` -> `meta_access_token`. Pero la página `/conectar/cuentas` estaba intentando leerlo desde `connected_accounts` -> `access_token` usando `userId`. Al no encontrarlo, lanzaba `auth_required`.
2. **Refactorización de Búsqueda de Token:** 
   - Cambiar la consulta de Supabase para apuntar a la tabla `profiles`.
   - Seleccionar `meta_access_token`.
   - Filtrar usando `eq('clerk_user_id', userId)`.
3. **Control de Errores y Logging:**
   - Si la consulta falla o el token no existe, imprimir en servidor: `console.error("DEBUG - Fallo en token exchange:", { error, clerkUserId: userId })`.
   - Cambiar la redirección de error a `redirect('/conectar?error=token_exchange_failed')`. 
4. **Fix ruta login obsoleta:** Cambiar la redirección inicial de Next Clerk de `/sign-in` a `/login` para consistencia.

## Salida
- Archivo corregido.
- Push a GitHub.

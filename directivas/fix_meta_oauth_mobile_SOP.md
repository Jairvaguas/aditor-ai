# FIX: META OAUTH MÓVIL (REDIRECT Y PERSISTENCIA DE ESTADO)

## OBJETIVO
Cambiar el flujo de conexión de Meta de un `popup` a un `redirect` completo para evitar bloqueos en iOS Safari y navegadores in-app (Instagram/Facebook). Además, persistir el `state` en la base de datos de Supabase para asegurar que no se pierda el `clerkUserId` durante el proceso de redirección.

## ENTRADAS
1. Tabla de Supabase: `meta_oauth_states`
2. Endpoint de inicialización: `src/app/api/auth/meta-connect-init/route.ts`
3. Callback existente: `src/app/api/meta/callback/route.ts`
4. Frontend de conexión: `src/app/conectar/page.tsx`

## SECUENCIA LÓGICA
1. **Paso 1: Supabase DB**
   - Crear tabla `meta_oauth_states` con UUID, `state_token`, `clerk_user_id`, expiración de 15 min y flag `used`.
   - Indexar `state_token`.
2. **Paso 2: Inicialización (API)**
   - Crear ruta POST `/api/auth/meta-connect-init`.
   - Obtener `userId` de Clerk.
   - Generar `stateToken` y guardarlo en Supabase `meta_oauth_states`.
   - Construir y devolver la URL de redirección de Meta.
3. **Paso 3: Callback**
   - Modificar `/api/meta/callback`.
   - En lugar de usar `state` directamente como `clerkUserId`, hacer una consulta a `meta_oauth_states` para obtener el `clerk_user_id` asociado al `state`.
   - Validar errores (no existe, expirado, ya usado).
   - Marcar el estado como usado.
4. **Paso 4: Frontend (`/conectar`)**
   - Añadir detección de In-App Browser (`isInAppBrowser()`).
   - Mostrar banner de advertencia si está en un In-App Browser (recomendando Safari/Chrome externo).
   - Cambiar la lógica del botón "Conectar con Meta" para que haga un POST a la nueva ruta y luego asigne `window.location.href = redirectUrl` en lugar de abrir un popup.

## RESTRICCIONES Y CASOS BORDE
- **In-App Browsers:** Pueden seguir dando problemas con cookies cross-site en algunos casos, por lo que el banner de aviso de "Abrir en navegador externo" es vital.
- **Expiración de Estado:** Asegurarse de validar `expires_at` para prevenir ataques o estados viejos en caching.
- **Entorno Vercel:** NEXT_PUBLIC_APP_URL debe ser exacto sin slash final para construir la redirect URI de forma segura.
- **Entornos Vercel Variables:** Asegurarse de usar `NEXT_PUBLIC_FACEBOOK_APP_ID` y `FACEBOOK_APP_SECRET` consistentemente en todo el flujo OAuth, en vez de META_APP_ID.
- **Clerk v5:** `auth()` es asíncrono. Debes usar siempre `await auth()` para extraer el `userId`.
- **Móvil Chrome Android location mapping:** Algunas veces `window.location.href` falla silenciosamente tras promesas en navegadores móviles para el flujo de OAuth por cuestiones de seguridad de popup/estado, impidiendo enrutar aunque el backend envuelve un HTTP 200 válido. Para redirigir con precisión el `redirectUrl` usar `window.location.replace()` junto a payloads con logs de consola y fallos atrapados exhaustivamente sobre el UI.

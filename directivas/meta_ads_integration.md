# Directiva: Integración Meta Ads API

## Objetivo
Implementar el flujo de autenticación OAuth con Facebook (Meta) para obtener acceso a las cuentas publicitarias del usuario y guardarlas en Supabase.

## Alcance
1.  **Server-side OAuth**: Rutas API para iniciar login y manejar callback.
2.  **Persistencia**: Guardar `access_token` y `facebook_user_id` en tabla `connected_accounts`.
3.  **Lectura**: Endpoint para listar cuentas publicitarias disponibles.

## Rutas a Implementar
- `GET /api/auth/facebook`: Inicia el flujo redirigiendo a Facebook.
  - Permisos: `ads_read`, `business_management`.
  - State: Debería usarse para seguridad (CSRF), aunque para MVP se puede simplificar o usar un valor aleatorio simple validado en cookie.
- `GET /api/auth/callback`: Recibe `code`.
  - Intercambia `code` por `access_token` (Long-lived si es posible, o Short-lived para MVP).
  - Llama a `me?fields=id,name` de Graph API para obtener ID de usuario de FB.
  - Guarda/Actualiza en Supabase `connected_accounts` vinculado al `user_id` de Clerk (obtener user de `auth()` de Clerk).
  - Redirige al frontend (ej: `/dashboard` o `/conectar`).
- `GET /api/ad-accounts`:
  - Obtiene el token de la DB para el usuario actual.
  - Llama a `me/adaccounts?fields=name,account_id,currency` de Graph API.
  - Retorna lista de cuentas.

## Variables de Entorno Requeridas
- `NEXT_PUBLIC_FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `NEXT_PUBLIC_APP_URL` (para redirect_uri)

## Restricciones
- **Seguridad**: El `access_token` NUNCA debe llegar al cliente (navegador). Solo el servidor lo maneja.
- **Base de Datos**: Usar `connected_accounts` table.
- **Tipos**: Asegurar tipos correctos para respuestas de Meta.
- **Frontend / Componentes**: Nota: No usar `onClick` en Server Components porque causa error de ejecución en Next.js. En su lugar, si el botón de login en `/conectar` requiere interactividad, usar `"use client";` al inicio del archivo. Si no se necesita interactividad, usar `<Link href="/api/auth/facebook">`.

## Flujo de Datos
1. User -> `/api/auth/facebook` -> Meta Login
2. Meta -> `/api/auth/callback?code=...` -> Server
3. Server -> Meta (Exchange Code) -> Token
4. Server -> Supabase (Upsert Token)
5. Server -> User (Redirect)
6. User -> `/api/ad-accounts` -> Server -> Supabase (Get Token) -> Meta (Get Accounts) -> User (JSON)

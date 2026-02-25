# Directiva: Flujo de Autenticación de Meta y Clerk en /api/auth/callback

## Objetivo
Corregir el flujo de redirección y almacenamiento de tokens en el callback de Meta OAuth (`src/app/api/auth/callback/route.ts`), solventando el problema de pérdida de sesión de Clerk durante la redirección externa.

## Entradas
- Archivo `src/app/conectar/page.tsx`
- Archivo `src/app/api/auth/callback/route.ts`

## Lógica
1.  **Frontend (`/conectar/page.tsx`):**
    -   Importar y usar `useAuth()` de `@clerk/nextjs`.
    -   Modificar la URL de redirección a Meta para incluir `&state=${userId}` en lugar de un state fijo o vacío.
    -   Si el `userId` no está presente, tal vez el usuario deba ser redirigido a login antes de intentar conectar (aunque el botón debe estar protegido).
2.  **Backend (`/api/auth/callback/route.ts`):**
    -   Obtener el código de Meta del param `code`.
    -   En lugar de verificar sesión de Clerk con `auth()`, obtener el `userId` desde el parámetro `state` de la URL (`searchParams.get('state')`).
    -   Si el `userId` en `state` es nulo o vacío, la sesión se perdió o inició mal; redirigir a `/login?redirect=/conectar`.
    -   Intercambiar código por token con `exchangeCodeForToken(code)`.
    -   Guardar el token en Supabase en la tabla `profiles` para el `userId` extraído del `state`, junto con el `selected_ad_account_id`.
    -   Redirigir a `/conectar/cuentas`.

## Restricciones y Casos Borde
-   **CRÍTICO:** `auth()` de Clerk dentro de un Route Handler falla (devuelve null) tras un callback externo de OAuth (como el de Meta) porque las cookies de sesión del cliente a veces no se envían o se pierden en el redirect cross-domain bajo ciertas configuraciones. Por ende, la única forma de relacionar el callback con el usuario de Clerk es pasando el `userId` en el parámetro `state` de OAuth.
-   Asegurarse de que `useAuth` esté importado en el cliente (`use client`).
-   La URL en `src/app/conectar/page.tsx` debe construirse con backticks (template literals) para inyectar correctamente la variable.

## Salidas
-   `src/app/conectar/page.tsx` modificado.
-   `src/app/api/auth/callback/route.ts` modificado.
-   Push a GitHub con los cambios.

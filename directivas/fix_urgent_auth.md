# Directiva: Correcciones Urgentes de Autenticación (Middleware y Conectar)

## Objetivo
1. Proteger la ruta `/conectar/cuentas` en el middleware de Clerk (no debe ser pública).
2. Asegurar que el botón de "Conectar con Facebook" en `/conectar` solo se muestre a usuarios autenticados. Si no lo están, redirigir al login.
3. Recordar la configuración de variables de entorno de Clerk en Vercel.

## Entradas
- `src/middleware.ts`
- `src/app/conectar/page.tsx`

## Lógica
1. **Middleware (`src/middleware.ts`)**:
   - Actualmente `/conectar(.*)` está marcado como público, lo cual expone `/conectar/cuentas`.
   - Modificar las rutas para hacer solo `/conectar` (exacto) público, o remover `(.*)` y gestionar el acceso a `/conectar/cuentas` para que caiga en la protección por defecto `auth.protect()`.
2. **Frontend (`src/app/conectar/page.tsx`)**:
   - Usar `isLoaded` y `userId` de `useAuth()`.
   - Añadir un `useEffect` que, si `isLoaded` es true y `!userId`, redirija a `/login?redirect=/conectar` (usando `router.push('/login?redirect=/conectar')`).
   - Mostrar un estado de carga mientras se verifica el usuario, garantizando que el botón de Facebook solo es clickeable con un `userId` válido (para no mandar `state=null`).
3. **Variables Vercel**:
   - Dejar constancia formal de que en Vercel deben configurarse:
     `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login`
     `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/registro`
     `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`

## Restricciones y Casos Borde
- En el matcher de `isPublicRoute`, si cambiamos `'/conectar(.*)'` a `'/conectar'`, Next.js tratará de hacer coincidir explícitamente la raíz. Dado que el botón de FB requiere usuario logueado en base a este requerimiento de hoy, en realidad la página `/conectar` misma ya NO puede ser tan "pública" de cara a interacción. 
- *Aclaración:* El usuario pide: "verificar que el botón solo aparezca si el usuario ya tiene sesión... Si no tiene sesión, redirigir primero al login". Por lo tanto, manejaremos esta protección a nivel cliente en `page.tsx` para una redirección suave, o bien en middleware directamente. Se implementará a nivel cliente como se pidió ("redirigir primero al login y luego volver").
- Las variables de Vercel son responsabilidad del usuario en el dashboard.

## Salidas
- `src/middleware.ts` actualizado (quitar `(.*)` de `/conectar` si es posible, o ajustar rutas).
- `src/app/conectar/page.tsx` actualizado con redirección.
- Script de python que hace push.

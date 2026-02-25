# Directiva: Corrección de Claves de Clerk en Producción y Migración de Props

## Objetivo
1. Asegurar que el entorno de producción en Vercel utilice las claves "Live" (producción) de Clerk en lugar de las "Test" (desarrollo).
2. Corregir la advertencia de obsolescencia (deprecation) de las utilidades de redirección de Clerk, migrando de `afterSignInUrl` a `fallbackRedirectUrl`.

## Entradas
- Panel de control de Vercel (Variables de entorno).
- Panel de control de Clerk (API Keys de Producción).
- Archivos `.env.local`, `src/app/login/[[...rest]]/page.tsx`, `src/app/registro/[[...rest]]/page.tsx` o `layout.tsx`.

## Lógica
1. **Verificación de Claves (Vercel):**
   - El usuario debe configurar `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` con un valor que empiece por `pk_live_`.
   - El usuario debe configurar `CLERK_SECRET_KEY` con un valor que empiece por `sk_live_`.
   - **Restricción:** Si las variables empiezan por `pk_test_` o `sk_test_`, Clerk operará en modo de desarrollo, solicitando URLs diferentes y causando disrupción en el flujo de producción.

2. **Actualización de Código:**
   - Reemplazar las variables de entorno antiguas `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` y relacionadas en el archivo local `.env.local` a sus equivalentes modernos: `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`.
   - En el archivo `src/app/login/[[...rest]]/page.tsx` y `registro`, si se está utilizando redirección forzada, cambiar las propiedades acordes a la versión de Clerk V5 (usar `fallbackRedirectUrl` donde el usuario indicó el error de `afterSignInUrl`).

## Salidas
- Documentación y advertencia clara para el administrador de Vercel.
- Archivos actualizados en el repositorio y push a la rama principal.

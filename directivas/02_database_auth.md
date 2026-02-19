# Directiva: Configuración de Base de Datos y Autenticación

## Objetivo
Configurar el entorno local, los esquemas de base de datos de Supabase y el middleware de autenticación de Clerk para Aditor AI.

## Entradas
- Claves de API de Clerk (Publishable y Secret) y URL de Supabase proporcionadas por el usuario.
- Esquemas SQL definidos para `profiles`, `connected_accounts`, `auditorias`, `audit_logs`.
- Rutas públicas definidas para el middleware.

## Pasos de Ejecución
1.  **Configuración de Variables de Entorno (.env.local):**
    - Verificar si existe `.env.local`.
    - Crear o actualizar con las claves proporcionadas.
    - **Importante:** Dejar marcadores claros para las claves faltantes (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
2.  **Generación de Esquema SQL (supabase/schema.sql):**
    - Crear directorio `supabase/` si no existe.
    - Generar archivo `schema.sql` con las sentencias `CREATE TABLE` exactas proporcionadas.
3.  **Configuración de Middleware (src/middleware.ts):**
    - Generar `src/middleware.ts`.
    - Configurar `clerkMiddleware` para proteger todas las rutas excepto las públicas: `/`, `/conectar`, `/teaser`, `/registro`, `/api/meta/callback`.
    - Asegurar que coincida con la versión instalada de `@clerk/nextjs`.

## Restricciones y Advertencias
- **NO** intentar conectar a Supabase automáticamente si faltan las claves `SERVICE_ROLE_KEY`. En su lugar, generar el archivo SQL e instruir al usuario para correrlo en el Editor SQL de Supabase.
- Asegurar que los tipos de datos en SQL coincidan con los requerimientos (UUID, JSONB, Timestamps).
- El middleware debe ser compatible con Next.js App Router (versión 6 requiere `async (auth, req)` y `await auth.protect()`).
- **Scripts Python:** Al generar archivos en la raíz, verificar `os.path.dirname(path)` antes de llamar a `os.makedirs()`, ya que devuelve una cadena vacía y causa error en Windows.

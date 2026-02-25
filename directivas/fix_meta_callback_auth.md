# Directiva: Corrección de validaciones de sesión en Meta Callback

## Objetivo
Reforzar la ruta del callback de Meta (`src/app/api/meta/callback/route.ts`) para que dependa 100% del parámetro `state` enviado desde el frontend como validación del `clerkUserId`. También se mejorará el registro de errores para diagnosticar parámetros faltantes y certificar la redirección final.

## Entradas
- Archivo `src/app/api/meta/callback/route.ts`.

## Lógica
1. Eliminar la importación no utilizada de `auth` desde `@clerk/nextjs/server`.
2. Reemplazar la validación `if (!code)` por una validación estricta conjunta: `if (!code || !state)`.
3. Si falta alguno, imprimir un log de error explícito (`console.error("Missing params:", { code, state });`) antes de hacer el redirect.
4. Asignar explícitamente `const clerkUserId = state;` o `userId = state;` en base a la lógica existente.
5. Asegurar que el redirect por defecto al final del bloque sea a `${process.env.NEXT_PUBLIC_APP_URL}/conectar/cuentas`.

## Restricciones y Casos Borde
- No intentar invocar `auth()` bajo ninguna circunstancia en este controlador, ya que Clerk pierde el contexto de sesión nativo al volver de una redirección externa (Meta) en un subdominio o contexto cruzado.
- El log explícito permitirá aislar en Vercel por qué el `state` está llegando vacío (si es que la URL se está malformando en el frontend).

## Salidas
- Código modificado.
- Commit y push en GitHub.

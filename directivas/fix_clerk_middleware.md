# Directiva: Desbloqueo de Callback de OAuth en Middleware de Clerk

## Objetivo
Agregar la ruta del callback de autenticación (`/api/auth/callback`) a la lista de rutas públicas en `src/middleware.ts` para que Clerk no bloquee las respuestas externas de Meta OAuth.

## Entradas
- Archivo `src/middleware.ts`.

## Lógica
1. Leer el archivo `src/middleware.ts`.
2. Buscar la declaración de `createRouteMatcher` que define las rutas públicas (`isPublicRoute`).
3. Añadir `'/api/auth/callback(.*)'` al arreglo de rutas públicas.
4. Guardar archivo, hacer commit y push a GitHub.

## Restricciones y Casos Borde
- El middleware de Clerk por defecto bloquea cualquier ruta que no esté explícitamente marcada como pública si se llama a `auth.protect()` de forma general.
- Como la respuesta final del OAuth viene de un servidor externo (Meta) sin las cookies de sesión del navegador incrustadas en el redirect inicial (o por cross-domain privacy), Clerk rechaza la petición.
- Es vital usar el wildcard `(.*)` si la ruta recibe parámetros GET para el code, state, error, etc, aunque el matcher de Clerk también maneje query params, es la convención seguida en ese archivo.

## Salidas
- `src/middleware.ts` modificado.
- Commit y push exitoso.

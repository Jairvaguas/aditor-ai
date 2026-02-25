# Directiva: Depuración del enlace de Meta OAuth en /conectar

## Objetivo
Agregar un log (`console.log`) en el frontend justo antes de hacer la redirección a Meta OAuth para inspeccionar la URL exacta que está generando. Además, establecer una medida preventiva o comprobación por si el `userId` de Clerk es `null` o indefinido en ese preciso momento (por ejemplo, debido a una carrera o estado del hook).

## Entradas
- Archivo `src/app/conectar/page.tsx`

## Lógica
1. Modificar la función `onClick` del botón "Conectar con Facebook".
2. Asignar el `userId` a una variable temporal (ej. `authState`), y si `userId` es falso, nulo o vacío, asignarle el valor `"test_fallback_id"`.
3. Construir la cadena `metaOAuthUrl` con los parámetros y el `authState`.
4. Imprimir `META OAUTH URL:` y la url.
5. Inyectar `metaOAuthUrl` a `window.location.href`.
6. Guardar, hacer commit y push a GitHub.

## Restricciones y Casos Borde
- El `userId` no debiese ser `null` puesto que la página entera está protegida por un spinner que espera a que `isLoaded` sea `true` y `userId` exista. Sin embargo, para aislar el error que el desarrollador reporta, el fallback de `"test_fallback_id"` es útil.
- Los logs aparecerán en la consola del navegador del usuario (que el desarrollador revisará).

## Salidas
- `src/app/conectar/page.tsx` actualizado.
- Push a GitHub.

# Directiva: Integración directa de Meta OAuth en /conectar

## Objetivo
El botón "Conectar con Facebook" en la página `/conectar` (archivo `src/app/conectar/page.tsx`) debe redirigir directamente al OAuth de Meta para solicitar `ads_read`, sin pasar por el login interno (por ejemplo, de Clerk).

## Entradas
- Archivo `src/app/conectar/page.tsx`
- URL de OAuth esperada: `https://www.facebook.com/dialog/oauth?client_id=1559690031775292&redirect_uri=https://www.aditor-ai.com/api/auth/callback&scope=ads_read&response_type=code`

## Lógica
1. Leer el archivo `src/app/conectar/page.tsx`.
2. Buscar dentro del evento `onClick` del botón la asignación a `window.location.href`.
3. Reemplazar la ruta `/api/auth/facebook` por la URL de Meta OAuth directa.
4. Hacer commit y push de los cambios al repositorio.

## Restricciones y Casos Borde
- El `client_id` debe ser el provisto: `1559690031775292`.
- El esquema `scope=ads_read` debe especificarse.

## Salidas
- `src/app/conectar/page.tsx` modificado correctamente.
- GitHub actualizado (push).

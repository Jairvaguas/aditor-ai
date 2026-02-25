# Directiva: Depuración avanzada de Supabase y Callback de Meta

## Objetivo
Agregar trazabilidad exacta si el problema es que el token no se pudo obtener con Meta o si el token se obtuvo pero falló su guardado en la base de datos (por falta de perfil de usuario u otro motivo).

## Entradas
- Archivo `src/app/api/meta/callback/route.ts`

## Lógica
1. Modificar la consulta `update` en Supabase para concatenar `.select()` y recuperar la data modificada. Si el arreglo de vuelta está vacío, significa que el usuario (clerk_user_id) no existe en la tabla `profiles`.
2. Lanzar un log claro e interrumpir el flujo redirigiendo a `?error=db_profile_not_found` si el perfil no existía, para que el desarrollador no se confunda con fallos de Meta.
3. Añadir Logs enriquecidos si hay un error en la captura del token (Graph API).

## Salidas
- Código modificado y push a GitHub.

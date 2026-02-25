# Directiva: Refinamiento de Unicidad (Permitir Re-Vinculación y Limpiar Logs)

## Objetivo
Resolver los bloqueos (falsos positivos) del error `account_already_in_use` al intentar seleccionar una cuenta y asegurar que los logs evidencien si el rechazo es legítimo (Fraude) o un fallo subyacente de la consulta de base de datos.
Se permitirá expresamente que si la cuenta publicitaria ya pertenece legalmente al usuario actual (`clerk_user_id`), el endpoint corone con éxito permitiendo regenerar la auditoría en lugar de bloquearse.

## Archivo Objetivo
- `src/app/api/auth/select-account/route.ts`

## Lógica a Implementar
1. Añadir el manejo explícito de `globalCheckError` en lugar de ignorarlo. Si hay un error al buscar, arrojar respuesta 500 y un log que diga `DEBUG - Error de BD en verificación de unicidad global`.
2. Actualizar el log de advertencia en caso de colisión a: `DEBUG - Bloqueo por Conflicto de Usuario (Fraude): Account X ya pertenece a Y. Intento por Z`.
3. Reiterar en comentarios la permisividad para la validación: si el usuario ya posee el anclaje, el filtro `.neq('clerk_user_id', clerkUserId)` asegura que la lista quede en tamaño cero y el flujo avance sin estorbos hacia la generación del Audit.

## Salida
- Script Python.
- Push a GitHub.

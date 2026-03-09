# Directiva: Fix Trial Ends At en Registro de Usuarios Nuevos

## Objetivo
Agregar el campo `trial_ends_at` al momento de insertar un nuevo perfil en la tabla `profiles` desde el webhook de Clerk cuando se dispara el evento `user.created`.

## Archivos a Modificar
- `src/app/api/webhooks/clerk/route.ts`

## Lógica Esperada
1. En el evento `user.created`, dentro del archivo `route.ts`, ubicar la llamada a `getSupabaseAdmin().from('profiles').insert(...)`.
2. Agregar la propiedad `trial_ends_at` con el valor `new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()` al objeto que se inserta.
3. Esto asegurará que todos los usuarios que se registren por primera vez tengan un periodo de prueba de 7 días.

## Casos Borde y Restricciones
- Solo modificar el objeto de inserción, no alterar otras partes del webhook ni cambiar la lógica de verificación o de emails.

## Pasos del Script
1. Leer el contenido de `src/app/api/webhooks/clerk/route.ts`.
2. Buscar el bloque de código `.insert({` correspondiente al evento `user.created`.
3. Reemplazar el bloque con la nueva definición agregando `trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()`.
4. Escribir los cambios en el archivo.

# Directiva: Saneamiento de Perfiles Duplicados y Restricción de Unicidad (Ad Accounts)

## Objetivo
Corregir los conflictos producidos cuando un usuario se registra nuevamente o se cruzan IDs de Clerk, fusionando el registro en la base de datos `profiles` antes de intentar el Upsert del token de Meta. Además, se definirá una instrucción clara para añadir la restricción de integridad a nivel SQL en la tabla `profiles`.

## Archivos a Modificar
- `src/app/api/meta/callback/route.ts`

## Lógica Backend (API)
1. **Extracción de Datos de Clerk:** Instanciar dinámicamente el `clerkClient` para obtener el `userEmail` real del usuario usando su `clerk_user_id`.
2. **Fusión de Conflictos (Merge):** Antes de cualquier inserción o actualización, preguntar a Supabase si ya existe una fila `where email == userEmail && clerk_user_id != user_id_actual`.
   - Si existe, ejecutar un `.update({ clerk_user_id: user_id_actual })` sobre esa vieja fila.
   - De este modo, la fila recobra su pertenencia al usuario y el `.upsert()` subsecuente funcionará a la perfección sin generar un perfil duplicado.
3. Usar el email real recuperado de Clerk en lugar del fallback estático en el cuerpo de todos los Upserts.

## Operación de Base de Datos Manual (Atención Usuario)
Dado que no tenemos acceso a tus migraciones automatizadas de Supabase, debes **ejecutar el siguiente comando SQL en tu panel de Supabase (SQL Editor)** para cumplir tu segundo requerimiento (la restricción de unicidad):

```sql
ALTER TABLE profiles
ADD CONSTRAINT unique_selected_ad_account UNIQUE (selected_ad_account_id);
```
*(Nota: Asegúrate de que no haya cuentas duplicadas actualmente en esa columna antes de correrlo, o el motor PostgresSQL rechazará la creación de la restricción).*

## Salidas
- Script Python que modifique `route.ts`.
- Push a GitHub.

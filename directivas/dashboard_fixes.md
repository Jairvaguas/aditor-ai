# Dashboard Fixes

## 1. Contexto del Problema
El dashboard presenta 4 issues reportados:
1. Las métricas globales muestran "--" porque no coinciden las etiquetas XML parseadas con las generadas por Claude (ej. `<metricas_globales>` vs `<resumen_ejecutivo>`).
2. Los nombres de campañas guardan el ID en lugar del campo `name` en la integración con Meta.
3. Las filas de campañas no son clickeables en el dashboard.
4. Falta la sección de listado histórico de auditorías en `/dashboard/auditorias`.

## 2. Objetivos
- Arreglar el parser XML para que encuentre las métricas generadas por Claude.
- Modificar la obtención del nombre de campaña desde Meta API en `meta-auth.ts`.
- Agregar navegación onClick a las filas de la tabla de campañas.
- Crear la página de histórico de auditorías.

## 3. Restricciones y Casos Borde
- El XML raw debe revisarse para ver los tags exactos que Anthropic genera. En este caso se buscará en el código de parser actual y en el prompt qué tag se usa (`<resumen_ejecutivo>`, `<metricas_cuenta>`, etc.).
- La API de Meta devuelve un objeto ID para las campañas (ej. `[id]|[objective]|...`). Hay que mapear o extraer explícitamente el nombre (`name`) desde la respuesta a `/act_{account_id}/campaigns?fields=id,name,status...`.
- El enrutamiento de Next.js se debe hacer con `useRouter` para hacer clickeables las filas de Tailwind/React.
- Las tablas en Supabase deben ser consultadas por auditorías ordenadas `created_at` DESC para la nueva página.

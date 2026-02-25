# Directiva: Sincronización Final de Selección de Cuentas (Profiles y Upsert)

## Objetivo
Resolver el error `selection_failed` durante la fase de análisis de cuenta originado por inconsistencias arrastradas de la refactorización de tablas de base de datos.
Se reescribirá el endpoint de selección para que trabaje exclusivamente con la tabla `profiles` e incorpore rutinas seguras de inserción condicional (Upsert) con control avanzado de errores.

## Entradas
- `src/components/AccountSelector.tsx`
- `src/app/api/auth/select-account/route.ts`

## Lógica

### 1. Endpoint API (select-account/route.ts)
- Reemplazar la aserción insegura `.update({ selected_ad_account_id })` por `.upsert()` con los fallbacks mandatorios de esquema (`email`, `nombre`) y rastreo manual del `dbError` equivalente al usado en el callback.
- **Obtención de Token:** Eliminar la consulta a la obsoleta tabla `connected_accounts`. En su lugar, extraer `meta_access_token` consultando a la misma tabla `profiles`.
- Requerir `currency` directamente desde el payload del frontend en lugar de la BD, dado que la cuenta seleccionada ya provee esta información originaria de Meta.

### 2. Frontend de Selección (AccountSelector.tsx)
- Ampliar el payload mandado al endpoint incluyendo `currency` buscándola dinámicamente según el ID clickeado.

## Salidas
- Código de API y Frontend reparados.
- Commit y Push a GitHub.

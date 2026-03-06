# Directiva: Soporte Multi-Cuenta Publicitaria (Fase 2)

## Objetivo
Agregar un conmutador de cuentas (Dropdown) en la UI del Dashboard, filtrar las auditorías por cuenta seleccionada de Meta y actualizar el trabajo programado mensual/semanal (Cron) para que genere auditorías para TODAS las cuentas vinculadas que tenga el usuario.

## Entradas
- Nuevo: `src/components/AccountSwitcher.tsx`
- `src/app/dashboard/page.tsx`
- `src/lib/audit.ts`
- `src/app/api/cron/weekly-audit/route.ts`

## Salidas
Los cuatro archivos actualizados o creados con la nueva lógica proveída.

## Lógica y Pasos
1. **Paso 1:** Crear `AccountSwitcher.tsx`.
2. **Paso 2:** En la página del dashboard (`page.tsx`), hacer el `import` y consultar `connected_accounts`. Cambiar el query genérico de la bitácora (`lastAudit`) para filtrarlo por `ad_account_id`.
3. **Paso 3:** En la libreta de auditorías (`audit.ts`), insertar el `ad_account_id` para vincular cada XML en BD a su cuenta específica, utilizando del perfil si `campaigns` no se provee.
4. **Paso 4:** En el trabajo programado (`weekly-audit/route.ts`), iterar para cada usuario en toda su lista de cuentas vinculadas y activadas, llamando a generateAudit independientemente para cada cuenta.
5. **Paso 5:** Push al repositorio de Git para culminar la Fase 2.

## Restricciones y Notas
- Evitar truncar copys o importaciones de NextJS. 
- Enviar múltiples componentes para un loop en el cron puede causar timeouts, para futuros pasos se deberá modularizar las Requests del CRON si la lista crece.

# Directiva: Flujo de Redirección Post-Auditoría

## Objetivo
El usuario logeado en el Dashboard que activa el botón "Iniciar Auditoría", genera su propio reporte autenticado. Por error tipográfico en la migración del Zero-State, la API estaba devolviendo la URL `/teaser?auditId=...` en lugar de `/reporte/[id]`. Dado que `/teaser` posee lógicas agresivas de redirección a `/conectar` si faltan parámetros, esto causaba un loop de expulsiones indebidas.

## Resolución
1. Se modificó el endpoint `src/app/api/audit/start/route.ts`.
2. El campo `redirectUrl` del JSON de retorno exitoso ahora apunta al layout autenticado: `/reporte/${auditResult.id}`.
3. El frontend  `<AuditTriggerButton />` ejecuta `router.push('/reporte/...');` nativamente sin problemas.

## Comprobación
Los usuarios logeados nunca deben ser expulsados a `/conectar` si ya poseen un `meta_access_token` validado y ya generaron el XML.

# Directiva: Mejorar datos de Meta API y prompt de auditoría

## Objetivo
Actualizar la extracción de datos de la API de Meta y el prompt del LLM para soportar múltiples objetivos de campaña (Sales, Leads, Traffic, etc.) y destinos (Website, WhatsApp, etc.), no solo E-commerce.

## Archivos a Modificar
1. `src/lib/meta-auth.ts`: Reemplazar la función `getCampaignInsights` para incluir métricas adicionales (objetivo, destination_type, optimization_goal, ctr, cpm, cpc, frequency, etc.).
2. `src/lib/audit.ts`: 
   - Reemplazar el `SYSTEM_PROMPT` para contemplar reglas por objetivo y destino de campaña.
   - Reemplazar el `userPrompt` dentro de `generateAudit` para enviar las nuevas reglas, benchmarks adaptados y remover la sección `<hooks_sugeridos>` del XML.

## Pasos de Ejecución
1. Leer `src/lib/meta-auth.ts` y reemplazar la implementación de `getCampaignInsights`.
2. Leer `src/lib/audit.ts` y reemplazar `SYSTEM_PROMPT` y el bloque `userPrompt`.
3. Realizar `git add`, `git commit` y `git push`.

## Restricciones y Casos Borde
- El formato XML de respuesta es crítico, no se debe alterar la estructura más allá de quitar `<hooks_sugeridos>`.
- Las métricas adsets se obtienen agrupando por `campaign_id`.
- Se requiere parsear correctamente los values para calcular el ROAS.
- No romper las firmas de las funciones exportadas.

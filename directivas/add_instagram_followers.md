# Directiva: Agregar métrica de seguidores de Instagram a la auditoría

## Objetivo
Agregar métricas de "follows" (seguidores) a la respuesta de Meta API en el análisis de campañas de Ads, y actualizar los prompts de auditoría para reportar y evaluar el costo por seguidor, especialmente en campañas de Growth/Engagement.

## Archivos a Modificar
1. `src/lib/meta-auth.ts`: Extraer acciones de "follow", "page_engagement" o "like" para calcular `follows` y `cost_per_follower`, agregándolos a la salida de `getCampaignInsights`.
2. `src/lib/audit.ts`: 
   - En `SYSTEM_PROMPT`: Actualizar la sección `OUTCOME_ENGAGEMENT` para incluir el análisis y el benchmark de costo por seguidor.
   - En `userPrompt`: Agregar el benchmark de costo por seguidor para campañas de ENGAGEMENT/AWARENESS.

## Pasos de Ejecución
1. Leer `src/lib/meta-auth.ts` e inyectar el código de extracción de followers en `getCampaignInsights`.
2. Leer `src/lib/audit.ts` y modificar con expresiones regulares (o reemplazo de texto) tanto el `SYSTEM_PROMPT` como el `userPrompt`.
3. Validar sintaxis.
4. Realizar `git add`, `git commit` y `git push` a github.

## Restricciones y Casos Borde
- El costo por seguidor solo debe de calcularse cuando `spend > 0` y `follows > 0`.
- Ambos cambios en los prompts (`SYSTEM_PROMPT` y `userPrompt`) deben mantener el formato actual.

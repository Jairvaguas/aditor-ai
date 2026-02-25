# Directiva: Prevención de Markdown de Claude y Extracción de Datos Pre-Inserción

## Objetivo
El LLM (Claude) a veces devuelve el bloque XML envuelto en etiquetas Markdown (\`\`\`xml ... \`\`\`), o con texto introductorio, lo que corrompe el parseo Regex subsecuente en el Dashboard y provoca que devuelva métricas vacías. Tras intentar un replace simple, fue necesario escalar a una solución más agresiva.

## Resolución Definitiva
1. **System Prompt Estricto:** Se añadieron instrucciones CRÍTICAS obligando a que la respuesta inicie con `<?xml version="1.0" encoding="UTF-8"?>` y prohibiendo explícitamente los backticks.
2. **Sanitizer Agresivo:** En `src/lib/audit.ts`, la variable `cleanXml`:
   - Corta agresivamente cualquier cosa *antes* de la declaración `<?xml`.
   - Remueve bloques de markdown o backticks sueltos.
   - Aplica un fallback final de indexación mediante `cleanXml.indexOf('<?xml')`.
3. **Guardado Total:** Pasamos a `.insert({})` las columnas explícitas `score` y `hallazgos_count`, y sobreescribimos `xml_raw` con el `cleanXml`.

## Restricciones
- Nunca confiar en que Claude devolverá XML puro sin prefijos, incluso con system prompts agresivos. Siempre ejecutar un Sanitizer `substring(xmlStart)` antes de guardar.

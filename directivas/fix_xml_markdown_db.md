# Directiva: Prevención de Markdown de Claude y Extracción de Datos Pre-Inserción

## Objetivo
El LLM (Claude) a veces devuelve el bloque XML envuelto en etiquetas Markdown (\`\`\`xml ... \`\`\`), lo que corrompe el parseo Regex subsecuente en el Dashboard y provoca que devuelva métricas en `$0` o `--`. Adicionalmente, era conveniente extraer el Score y el Total de Hallazgos en frío antes de insertar a Supabase para tener metadata directamente en columnas de la tabla.

## Resolución
1. **Limpieza (Sanitización):** En `src/lib/audit.ts`, la variable `cleanXml` remueve los backticks y salos de línea \`replace(/```xml\n?/g, '')\` antes de interactuar con ella.
2. **Metadata en Frío:** Usando `cleanXml.match(...)` capturamos `<valor>(\d+)<\/valor>` y la repetición global de `<hallazgo ` para obtener el contador.
3. **Guardado Total:** Pasamos a `.insert({})` las columnas explícitas `score` y `hallazgos_count`, y sobreescribimos `xml_raw` con el `cleanXml`. Además, se envía `clerk_user_id` para garantizar alineamiento con el fetch del Dashboard.

## Restricciones
- Nunca inyectar `xml_raw` directamente desde la respuesta del AI sin pasar por el sanitizer de Markdown.

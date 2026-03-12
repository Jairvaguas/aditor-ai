# DIRECTIVA: ADD_WHATSAPP_AUTOMATION_NOTICE

> **ID:** 2026-03-12_ADD_WA_NOTICE
> **Script Asociado:** `scripts/add_whatsapp_automation_notice.py`
> **Última Actualización:** 2026-03-12
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Añadir una nota importante en el prompt del sistema de la auditoría (`src/lib/audit.ts`) advirtiendo al LLM sobre la métrica `messaging_conversation_replied_7d` y el uso potencial de automatizaciones externas en WhatsApp por parte de los clientes.
- **Criterio de Éxito:** Las notas sobre automatizaciones externas en WhatsApp están añadidas correctamente a las secciones de OUTCOME_SALES y OUTCOME_LEADS del `SYSTEM_PROMPT` en `src/lib/audit.ts`.

## 2. Especificaciones de Entrada/Salida (I/O)
- **Archivos Fuente:**
  - `src/lib/audit.ts`

## 3. Flujo Lógico (Algoritmo)
1. Abrir `src/lib/audit.ts`.
2. Buscar la línea `   - Si destino es WHATSAPP/MESSENGER: analizar costo por conversación iniciada y estimar conversión offline` y agregar el warning justo después.
3. Buscar la línea `   - Si destino es WHATSAPP/MESSENGER: analizar conversaciones iniciadas como leads` y agregar el warning sintético justo después.
4. Guardar archivo.

## 4. Herramientas y Librerías
- **Librerías Python:** `os`.

## 5. Restricciones y Casos Borde (Edge Cases)
- La indentación en el prompt es importante, asegurarse de no romper el string template original (`` `...` ``).

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| N/A | N/A | N/A | N/A |

# DIRECTIVA: UPDATE_AUDIT_MAX_TOKENS

> **ID:** 2026-03-12_UPDATE_MAX_TOKENS
> **Script Asociado:** `scripts/update_audit_max_tokens.py`
> **Última Actualización:** 2026-03-12
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Aumentar el límite de tokens (`max_tokens`) en la llamada a la API de Anthropic (Claude) durante la generación de la auditoría.
- **Criterio de Éxito:** El archivo `src/lib/audit.ts` tiene configurado `max_tokens: 6000` en lugar de `max_tokens: 4000`.

## 2. Especificaciones de Entrada/Salida (I/O)
- **Archivos Fuente:**
  - `src/lib/audit.ts`

## 3. Flujo Lógico (Algoritmo)
1. Abrir `src/lib/audit.ts`.
2. Buscar la cadena `max_tokens: 4000`.
3. Reemplazarla por `max_tokens: 6000`.
4. Guardar archivo.

## 4. Herramientas y Librerías
- **Librerías Python:** `os`.

## 5. Restricciones y Casos Borde (Edge Cases)
- Asegurarse de reemplazar solo la configuración pertinente en la llamada a `client.messages.create`.

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| N/A | N/A | N/A | N/A |

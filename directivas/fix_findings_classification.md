# DIRECTIVA: FIX_FINDINGS_CLASSIFICATION

> **ID:** 2026-03-12_FIX_FINDINGS
> **Script Asociado:** `scripts/fix_findings_classification.py`
> **Última Actualización:** 2026-03-12
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Actualizar la lógica de clasificación de hallazgos en la vista de reportes (`src/app/reporte/[id]/page.tsx`) y en los tabs (`src/components/FindingsTabs.tsx`) para usar un filtro más amplio que contemple los tipos dinámicos generados por la IA y la urgencia del hallazgo.
- **Criterio de Éxito:** Los hallazgos se agrupan en Críticos, Oportunidades y Alertas basándose tanto en la variable `tipo` como en `urgencia`.

## 2. Especificaciones de Entrada/Salida (I/O)
- **Archivos Fuente:**
  - `src/app/reporte/[id]/page.tsx`: Modificar la separación inicial de variables `criticalFindings`, `opportunityFindings` y `warningFindings`.
  - `src/components/FindingsTabs.tsx`: Ajustar la interfaz `Finding` y las funciones `getCategoryStyles` y `getCategoryIcon`.

## 3. Flujo Lógico (Algoritmo)
1. **Paso 1:** Reemplazar los filtros de `criticalFindings`, `opportunityFindings` y `warningFindings` en `page.tsx`.
2. **Paso 2:** En `FindingsTabs.tsx`, agregar `urgencia?: string` a la interfaz `Finding`.
3. **Paso 3:** Actualizar `getCategoryStyles` e `getCategoryIcon` para que reciban todo el objeto `finding` y apliquen la lógica robusta, cayendo en *warning* si no es crítico u oportunidad.
4. **Paso 4:** Buscar y reemplazar en `FindingsTabs.tsx` el paso de `finding.category` a las funciones, pasándoles simplemente `finding`.

## 4. Herramientas y Librerías
- **Librerías Python:** `os`.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Caso Borde:** Un hallazgo no categorizado debe caer por defecto en 'warnings' (Alerta).
- La lógica debe considerar ambos campos, pero darle prioridad a `urgencia` (si es ALTA o CRÍTICA, siempre es crítico).

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| N/A | N/A | N/A | N/A |

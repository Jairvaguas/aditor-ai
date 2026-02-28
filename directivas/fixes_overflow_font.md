# DIRECTIVA: FIXES_OVERFLOW_FONT

> **ID:** 2026-02-28-02
> **Script Asociado:** `scripts/fixes_overflow_font.py`
> **Última Actualización:** 2026-02-28
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo 1:** Evitar que el título de la campaña (hallazgos) rompa el layout en `/reporte/[id]`. Añadiendo propiedades de `word-break` CSS integradas de Tailwind (`break-all overflow-hidden text-ellipsis`).
- **Objetivo 2:** Eliminar la persistencia de la clase dura `font-syne` en cualquier rincón del proyecto. Remplazándola globalmente por `font-display`, asegurando que `Plus_Jakarta_Sans` reine uniformemente, mitigando bugs visuales causados por utilidades Tailwind obsoletas.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- Archivos a modificar: `src/app/reporte/[id]/page.tsx`.
- Todos los `.tsx` y `.ts` dentro de `src/` que contengan textualmente `font-syne`.

### Salidas (Outputs)
- H4 modificado en reporte conteniendo `break-all overflow-hidden text-ellipsis`.
- Archivos purgados de `font-syne` remplazados globalmente por `font-display`.

## 3. Flujo Lógico (Algoritmo)

1. **Parcheo de Reporte:** Reemplazar explícitamente el `<h4 className="font-bold text-base mb-2">{finding.campana_nombre}</h4>` agregándole las utilerías de quiebre de palabra por desbordamiento.
2. **Purgado de Font:** 
   - Iterar recursivamente sobre el árbol de directorios de `src/`.
   - Si un archivo posee la cadena `font-syne`, sustituirla por `font-display`.
   - Escribir cambios al disco.

## 4. Herramientas y Librerías
- Python Nativo, `os`, `re`.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Riesgo:** Alterar indirectamente variables necesarias en css o font loading. Confiamos en esto dado que ya reemplazamos las vars `--font-syne` por `--font-display` y la exportación local funciona. Simplemente estamos puliendo clases HTML pasadas por alto.

## 6. Historial de Aprendizaje (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 28/02 | Texto desborda bounds en el DOM de Reportes | Falta de restricción de corte en nombres de campañas muy largos. | Utility classes `break-all` en Tailwind. |
| 28/02 | Posibles layouts todavía usando Syne | Clases hardcodeadas como `font-syne` regadas por el repo obviadas por el reemplazo base de la directiva anterior. | Purga masiva con Python en toda la carpeta src. |

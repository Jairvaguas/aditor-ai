# DIRECTIVA: UPDATE_FONT_PLUS_JAKARTA

> **ID:** 2026-02-28-01
> **Script Asociado:** `scripts/update_font_plus_jakarta.py`
> **Última Actualización:** 2026-02-28
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Migrar la tipografía principal H1/H2 de `Syne` a `Plus Jakarta Sans` en toda la página de aterrizaje (landing).
- **Criterio de Éxito:** La fuente `Plus Jakarta Sans` es importada correctamente en `src/app/layout.tsx`, configurada bajo CSS variable `--font-display`, y todos los títulos de la landing implementan el peso 700/800 de dicha fuente.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- Archivos afectados: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`.

### Salidas (Outputs)
- Modificación en el AST/Text de `layout.tsx` importando `Plus_Jakarta_Sans` en lugar de `Syne`.
- `globals.css` actualizado con el mapper `var(--font-display)`.
- `page.tsx` comprobado para asegurar que los Headings aún tienen la clase CSS `.font-display`.

## 3. Flujo Lógico (Algoritmo)

1. **Reescribir layout.tsx:**
   - Detectar la iteración de Syne y mutar a `Plus_Jakarta_Sans`.
   - Cambiar inicialización de constante `syne` a `plusJakarta`.
   - Cambiar argumentos del hook `cn()` en el body para inyectar `plusJakarta.variable`.
2. **Reescribir globals.css:**
   - Sustituir globalmente la cadena `--font-syne` por `--font-display`. Esto arreglará automáticamente tanto las etiquetas base H1-H6 como la clase CSS utilitaria `.font-display`.
3. **Verificar page.tsx:**
   - Al igual que en tareas anteriores, verificar con Regex que todo tag H1 y H2 lleve la clase `.font-display`. Insertarla si falta.

## 4. Herramientas y Librerías
- Regex y I/O estándar de Python.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Peso de Fuente:** La fuente de Jakarta Sans debe descargarse con weights ['700', '800'].

## 6. Historial de Aprendizaje (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 28/02 | N/A | N/A | N/A |

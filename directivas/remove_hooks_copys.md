# DIRECTIVA: REMOVE_HOOKS_COPYS

> **ID:** 2026-02-27-02
> **Script Asociado:** `scripts/remove_hooks_copys.py`
> **Última Actualización:** 2026-02-27
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Eliminar la característica "Generación de hooks y copys optimizados" de la lista de features o beneficios en los componentes de la aplicación.
- **Criterio de Éxito:** La cadena de texto "hooks y copys" ya no existe en los archivos objetivo (`src/components/DynamicPricingForm.tsx`, `src/app/subscribe/page.tsx`, `src/app/page.tsx`).

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Archivos Fuente:**
  - `src/components/DynamicPricingForm.tsx`
  - `src/app/subscribe/page.tsx`
  - `src/app/page.tsx`

### Salidas (Outputs)
- **Artefactos Generados:**
  - Los archivos fuente modificados sin los bloques `<li>` que contienen "Generación de hooks y copys optimizados" o líneas equivalentes.
- **Retorno de Consola:** Imprime el conteo de apariciones eliminadas por archivo.

## 3. Flujo Lógico (Algoritmo)

1. **Iterar Archivos Objetivo:**
   - Construir rutas absolutas a `src/components/DynamicPricingForm.tsx`, `src/app/subscribe/page.tsx`, `src/app/page.tsx`.
   - Si no existe el archivo, advertir  y saltar.
   - Leer contenido del archivo.
   
2. **Eliminación con Expresiones Regulares:**
   - Buscar y eliminar bloques enteros `<li>...Generación de hooks y copys optimizados...</li>`.
   - Si no se encontró bloque `<li>`, buscar simplemente la línea de texto y eliminarla.
   - Si hubo modificaciones, sobreescribir archivo.

3. **Verificación:**
   - Corroborar si quedan coincidencias extra.

## 4. Herramientas y Librerías
- **Librerías Python:** `os`, `re`.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Multi-línea:** En React (TSX), la línea de texto a menudo está envuelta en etiquetas JSX, por lo que es preferible eliminar la etiqueta contenedora `<li>` completa usando un regex multilínea.
- **Ausencia:** Puede que el archivo como `page.tsx` ya no contenga esa cadena en hardcode porque usa i18n (`t('perkX')`). El script debe manejar elegantemente las ocurrencias nulas sin fallar.

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 27/02 | N/A | N/A | N/A |

## 7. Ejemplos de Uso
```bash
python scripts/remove_hooks_copys.py
```

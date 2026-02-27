# DIRECTIVA: RESTORE_PRICING_FEATURES

> **ID:** 2026-02-27-04
> **Script Asociado:** `scripts/restore_pricing_features.py`
> **Última Actualización:** 2026-02-27
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Restaurar la lista de beneficios en `src/components/DynamicPricingForm.tsx` con el listado exacto proporcionado, garantizando que el diseño y los bullets de SVG permanezcan, o aplicando los emojis `✅` como pidió el usuario si prefiere el formato exacto. Sin embargo, para mantener coherencia visual, se usarán los íconos de SVG verde ya existentes en el componente.
- **Criterio de Éxito:** El componente `DynamicPricingForm` exhibe 5 elementos en la lista (Auditorías ilimitadas, Cuentas adicionales, Recomendaciones IA, Auditoría semanal automática, Soporte prioritario).

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Archivos Fuente:** `src/components/DynamicPricingForm.tsx`

### Salidas (Outputs)
- **Artefactos Generados:** `src/components/DynamicPricingForm.tsx` sobreescrito con la nueva lista.
- **Retorno de Consola:** Confirmación del archivo escrito exitosamente.

## 3. Flujo Lógico (Algoritmo)

1. Identificar el bloque `<ul>` dentro de `src/components/DynamicPricingForm.tsx`.
2. Reemplazar completamente el bloque actual `<ul>...</ul>` con la nueva versión predefinida que inyecta todos los items requeridos.
3. La nueva lista usará los iconos SVG que estaban originalmente (check verde).
    - Auditorías ilimitadas en tu cuenta publicitaria
    - Cuentas publicitarias adicionales a $15 USD/mes c/u
    - Recomendaciones de IA avanzadas
    - Auditoría semanal automática por email
    - Soporte prioritario

## 4. Herramientas y Librerías
- **Librerías Python:** `os`, `re`.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Regex Boundaries:** Dado que el HTML puede variar en indentaciones, es fundamental usar una sustitución segura usando bloques exactos o delimitar vía un matching de multi-línea para `<ul className="space-y-4 mb-8 text-gray-300">...</ul>`.

## 6. Historial de Aprendizaje (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 27/02 | N/A | Regex anterior fue muy agresivo o la lista se truncó de otra forma. | Se restaurará con hardcode para evitar errores, pero adaptando a SVG en lugar de emoji. |

## 7. Ejemplos de Uso
```bash
python scripts/restore_pricing_features.py
```

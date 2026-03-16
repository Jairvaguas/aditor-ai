---
description: Rediseño de la sección de pricing con dos planes (Básico y Pro) y selector de cuentas.
---

# Directiva: Rediseño de Pricing - Dos Planes (Básico y Pro)

## Objetivo
Reemplazar el plan único ($47) por un formato de dos planes lado a lado:
- Básico: $24/mes
- Pro: $39/mes

## Reglas
1. **Componente DynamicPricingForm**: Mostrar dos planes usando grid (Básico a la izquierda, Pro a la derecha).
2. **Selector de cuentas**: Añadir un dropdown al final del componente para sumar cuentas adicionales (de 1 a 5).
3. **Lógica de precios**: `precio = precioBase + (cuentas - 1) * 15`.
4. **Traducciones**: Reemplazar claves `messages/es.json` y `messages/en.json` (sección Landing) para que usen claves unificadas (`pricingTitle`, `pricingSubtitle`, `pricingCta`) y eliminar aquellas que antes iteraban beneficios (porque ahora están hardcoded en el frontend).

## Pasos de Ejecución
1. Escribir script o modificar código manual para `DynamicPricingForm.tsx`.
2. Actualizar los archivos `.json` con el texto correcto.
3. Hacer Git Commit y Push de los cambios.

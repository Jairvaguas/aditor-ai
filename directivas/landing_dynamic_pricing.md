# DIRECTIVA: LANDING_DYNAMIC_PRICING

> **ID:** 2026-02-27
> **Script Asociado:** `scripts/landing_dynamic_pricing.py`
> **Última Actualización:** 2026-02-27
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Reemplazar el bloque estático de precios en la página de inicio (`src/app/page.tsx`) por el componente dinámico `DynamicPricingForm` que ya se usa en `/subscribe`.
- **Criterio de Éxito:** La landing page muestra el selector de cuentas con precios dinámicos y el botón "Iniciar prueba gratis" redirige a `/conectar` en lugar de ir al checkout directamente.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Archivos Fuente:**
  - `src/app/page.tsx`: Landing page principal.
  - `src/components/DynamicPricingForm.tsx`: Componente de precios dinámicos.

### Salidas (Outputs)
- **Artefactos Generados:**
  - `src/app/page.tsx` modificado.
  - `src/components/DynamicPricingForm.tsx` modificado.
- **Retorno de Consola:** Imprime "Modificaciones realizadas con éxito." al finalizar.

## 3. Flujo Lógico (Algoritmo)

1. **Actualizar DynamicPricingForm:**
   - Leer `src/components/DynamicPricingForm.tsx`.
   - Añadir la propiedad opcional `isLanding?: boolean` a `DynamicPricingFormProps`.
   - Añadir el import de `Link` (`next/link`).
   - Modificar la firma del componente para aceptar `isLanding`.
   - Modificar el renderizado del botón de llamada a la acción (CTA) para que, si `isLanding` es `true`, renderice un `Link` hacia `/conectar` con el texto "Iniciar prueba gratis". De lo contrario, dejar el comportamiento original con `SubscribeButton`.
   - Guardar los cambios.

2. **Actualizar page.tsx:**
   - Leer `src/app/page.tsx`.
   - Importar `DynamicPricingForm`.
   - Cambiar la firma de `Home` de `export default function Home()` a `export default async function Home()` para permitir la obtención de la tasa de cambio (`copRate`).
   - Cambiar `useTranslations` por `await getTranslations` e importarlo de `next-intl/server`.
   - Añadir la lógica de fetch para obtener la tasa de cambio USD/COP, con fallback a 185000 (basado en $47 USD).
   - Reemplazar la sección estática de "5. Precios" insertando el `<DynamicPricingForm copRate={estimatedCop / 47} isLanding={true} />`.
   - Guardar los cambios.

## 4. Herramientas y Librerías
- **Librerías Python:** `os`, `re`.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Componentes de Servidor vs Cliente:** `page.tsx` usa traducciones, al volverlo asíncrono se debe usar `getTranslations` de `next-intl/server` en lugar de `useTranslations` de `next-intl`, ya que este último solo es para componentes síncronos o de cliente en Next.js App Router (o requiere configuración especial si es un server component, pero `getTranslations` es más seguro en async components).
- **Importaciones Duplicadas:** Asegurar no insertar importaciones dobles.

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 27/02 | N/A | N/A | N/A |

## 7. Ejemplos de Uso
```bash
python scripts/landing_dynamic_pricing.py
```

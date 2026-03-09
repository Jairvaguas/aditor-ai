# DIRECTIVA: META_CONVERSIONS_API

> **ID:** 2026-03-09
> **Script Asociado:** `scripts/meta_conversions_api.py`
> **Última Actualización:** 2026-03-09
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Implementar el envío de 6 eventos a Meta Conversions API (server-side) y Pixel (client-side) en la aplicación Next.js.
- **Criterio de Éxito:** Todos los endpoints y el layout envían eventos válidos sin causar errores de compilación o ejecución.

## 2. Especificaciones de Entrada/Salida (I/O)
### Entradas (Inputs)
- **Archivos Fuente:**
  - `src/lib/meta-pixel.ts` (NUEVO)
  - `src/app/api/webhooks/clerk/route.ts`
  - `src/app/api/meta/callback/route.ts`
  - `src/app/api/auth/select-account/route.ts`
  - `src/app/api/payments/create-subscription/route.ts`
  - `src/app/api/payments/webhook/route.ts`
  - `src/app/layout.tsx`

### Salidas (Outputs)
- **Artefactos Generados:**
  - Código modificado in situ mediante secuencias de reemplazo.

## 3. Flujo Lógico (Algoritmo)
1. **Inicialización:** Localizar el directorio base `AditorAI`.
2. **Creación:** Generar `src/lib/meta-pixel.ts` con la función `sendMetaEvent`.
3. **Inyección en Clerk Webhook:** Agregar evento `Lead` después de inserción en base de datos.
4. **Inyección en Meta Callback:** Agregar evento `CompleteRegistration` antes de redirección.
5. **Inyección en Select Account:** Agregar evento `StartTrial` antes de retorno JSON de éxito final.
6. **Inyección en Create Subscription:** Agregar evento `InitiateCheckout`.
7. **Inyección en Webhook MP:** Agregar evento `Purchase` en confirmación de pago.
8. **Inyección en Layout:** Insertar script de pixel de cliente para `ViewContent` (`PageView`).

## 4. Herramientas y Librerías
- **Librerías Python:** `os`, `pathlib`
- **APIs Externas:** Meta Graph API v19.0.

## 5. Restricciones y Casos Borde
- **Imports duplicados:** El script de inyección debe verificar si `sendMetaEvent` ya fue importado antes de agregarlo, previniendo errores de compilación en Next.js.
- **Formateo de JSX:** El script del pixel en el layout debe ser envuelto apropiadamente usando `<Script>` y `<noscript>` sin romper la sintaxis TSX.

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|

## 7. Ejemplos de Uso
```bash
python scripts/meta_conversions_api.py
```

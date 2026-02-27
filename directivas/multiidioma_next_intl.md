# DIRECTIVA: MULTIIDIOMA_NEXT_INTL

> **ID:** 2026-02-27
> **Script Asociado:** `scripts/multiidioma_next_intl.py`
> **Última Actualización:** 2026-02-27
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Implementar soporte multiidioma (Español e Inglés) usando `next-intl` sin usar rutas separadas (ej. no usar `/en/dashboard`), manteniendo el idioma preferido en `localStorage` y actualizando la UI de Next.js mediante un Client Provider o equivalente global.
- **Criterio de Éxito:** La app se puede cambiar de idioma desde un selector en el header del Dashboard y de la Landing, mostrando banderas 🇪🇸/🇺🇸, y los textos cambian dinámicamente.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Archivos de Traducción:** `messages/es.json` y `messages/en.json` (A ser creados y mostrados al usuario primero).
- **Archivos TSX a modificar:** 
  - `src/app/conectar/page.tsx`
  - `src/app/dashboard/page.tsx`
  - `src/app/reporte/[id]/page.tsx`
  - `src/app/page.tsx`
  - `src/app/registro/page.tsx`
  - `src/app/teaser/page.tsx`

### Salidas (Outputs)
- **Modificaciones:** Componentes refactorizados para usar `useTranslations` de `next-intl`.
- **Selector de Idioma:** Componente visual para cambiar de idioma.

## 3. Flujo Lógico (Algoritmo)

1. **Extracción y Traducción:** Leer los TSX objetivo, extraer textos en duro y formular los JSON de idiomas. Mostrar al usuario para aprobación.
2. **Configuración de `next-intl`:** 
   - Instalar `npm install next-intl`.
   - Como no se usará App Router con prefijos (como `/en/`), se configurará `next-intl` invocándolo desde un `NextIntlClientProvider` a nivel del Root Layout o similar, cargando directamente los mensajes basados en el idioma actual (o un contexto local).
3. **Refactor de Componentes:** 
   - Reemplazar textos estáticos por `t('clave')`.
4. **Selector de Idioma:**
   - Crear componente que lea/escriba `localStorage` (o estado global) para almacenar el idioma, y provoque un re-render pasando el nuevo idioma al Provider.

## 4. Herramientas y Librerías
- **Librerías Permitidas:** `next-intl`

## 5. Restricciones y Casos Borde (Edge Cases)
- **Restricción de Rutas:** NO usar rutas separadas como `/en/dashboard`. El cambio debe ser in-situ. Esto requiere un manejo particular de `next-intl` donde se pasa el `locale` y `messages` al `NextIntlClientProvider` dinámicamente en el lado del cliente o manejado vía un contexto que re-solicite los mensajes.
- **Local Storage:** Next.js Server Components no pueden acceder a `localStorage`. Por lo tanto, el idioma inicial en el servidor podría ser por defecto el español, hasta que el componente cliente hidrate y cambie al idioma guardado si es distinto.

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 2026-02-27 | `Error: Couldn't find next-intl locale because no request config was provided` durante `next build` (prerendering estático). | Al no usar rutas internacionalizadas nativas (`/[locale]/`), Next.js no detecta la configuración local del request de forma automática para exportes estáticos si no configuramos el archivo `next.config.ts` con el plugin de `next-intl`. | Integrar `createNextIntlPlugin()` de `next-intl/plugin` en `next.config.ts` envolviendo la configuración, de modo que `src/i18n/request.ts` sea interpretado globalmente en tiempo de build y runtime. |
## 7. Ejemplos de Uso
_Por definir._

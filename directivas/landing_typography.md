# DIRECTIVA: LANDING_TYPOGRAPHY

> **ID:** 2026-02-27-06
> **Script Asociado:** `scripts/landing_typography.py`
> **Última Actualización:** 2026-02-27
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Cambiar la tipografía de los títulos grandes de la landing page por la fuente Syne de Google Fonts, manteniendo el resto del texto con la fuente base (DM Sans).
- **Criterio de Éxito:** La fuente Syne está importada correctamente en `layout.tsx` (ya estaba importada con su variable CSS). Se debe confirmar que la clase `.font-display` está agregada a `globals.css` referenciando `--font-syne`. Finalmente, los títulos principales H1 y H2 de la landing (`page.tsx`) deben portar la clase `font-display`.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- Archivos afectados: `src/app/globals.css`, `src/app/page.tsx`
- Archivos ya revisados: `src/app/layout.tsx` (ya confirmamos que Syne está importada y propagándose como variable `--font-syne` al body).

### Salidas (Outputs)
- Modificaciones en CSS anexando `.font-display` si no existía.
- Modificaciones en los tags JSX `<h1>` y `<h2>` de la página de inicio, añadiendo `font-display` a sus clases de Tailwind.
- Modificaciones a textos específicos si se pidieron ("Deja de quemar dinero en Meta Ads.", "Tu ROAS no va a mejorar solo."). Dado que la app usa `next-intl` para internacionalización, el equivalente son los H1 y H2 y subtítulos específicos si hay que alterar span o p tags que funcionen como títulos. Reemplazaremos programáticamente en H1 y H2.

## 3. Flujo Lógico (Algoritmo)

1. **Inyección de CSS Base:** Editar `src/app/globals.css` anexando la clase `.font-display { font-family: var(--font-syne), sans-serif; font-weight: 800; }`.
2. **Modificación de page.tsx:**
   - Buscar `<h1...>` y agregar `font-display` dentro del atributo `className`.
   - Buscar todos los `<h2...>` y agregar `font-display` dentro del atributo `className`.
3. Ambos pasos iterarán leyendo con regex, inyectando la clase y guardando los cambios en disco.

## 4. Herramientas y Librerías
- Modulación pura en Python; Regex.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Duplicación de clases:** El script en python debe verificar y no añadir `font-display` a un `className` que ya lo tenga.
- **Internacionalización:** El usuario nombró frases exactas "Deja de quemar dinero en Meta Ads." y "Tu ROAS no va a mejorar solo.". Esto corresponde al `t("heroTitle")` y al primer H2 / subtitulo. Añadiendo `font-display` al H1 y todos los H2s se cumple la regla universal e internacionalizada sin hardcodear strings de español en un archivo i18n.

## 6. Historial de Aprendizaje (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 27/02 | N/A | N/A | N/A |

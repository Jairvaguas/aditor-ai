# DIRECTIVA: LANDING_ANIMATIONS

> **ID:** 2026-02-27-05
> **Script Asociado:** `scripts/landing_animations.py`
> **Última Actualización:** 2026-02-27
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Añadir animaciones on-load para la Hero Section y animaciones on-scroll para las demás secciones utilizando IntersectionObserver nativo, inyectando estilos CSS y delays precisos.
- **Criterio de Éxito:** La landing page carga con la hero div secuenciadamente. Al scrollear, las tarjetas de características y FAQs entran en cascada, al igual que los contenedores de las diferentes secciones.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- Archivos afectados: `src/app/page.tsx`, `src/app/globals.css`.
- Archivo nuevo a generar: `src/components/ScrollAnimations.tsx`.

### Salidas (Outputs)
- Modificaciones en los tags JSX de la página de inicio, añadiendo `animate-on-scroll` o estilos en línea.
- Generación de un componente `ScrollAnimations.tsx` marcado como `'use client'`.

## 3. Flujo Lógico (Algoritmo)

1. **Inyección de CSS Base:** Editar `src/app/globals.css` anexando al final las clases `@keyframes fadeSlideUp`, `.animate-on-scroll` y su respectiva clase `.animate-in`.
2. **Creación del Observador JS React:** Escribir el componente frontend `src/components/ScrollAnimations.tsx` el cual detecta en un `useEffect` todos los elementos con la clase `.animate-on-scroll`, observándolos para añadirles `.animate-in`.
3. **Modificación de page.tsx:**
   - Importar `<ScrollAnimations />` y montarlo en primer nivel debajo del `<Navbar />`.
   - Reemplazos para **Hero**: añadir en línea `style={{ animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '...' }}` a título, subtítulo, botón, card derecha (removiendo utilidades tailwind innecesarias de este último si existen).
   - Reemplazos para **Resto de secciones**: Agregar `animate-on-scroll` en `section#como-funciona`, `section#precios`, `section#cta`.
   - Reemplazos para **Features Cards**: Usar regex en los tres div de la grilla de características para asignar escalonadamente la clase animada y sus transitons delays `0ms`, `100ms`, `200ms`.
   - Reemplazos para **FAQs**: Incorporar clase y `style={{ transitionDelay: ... }}` usando lógica interpolada de React `\${num * 100}ms`.

## 4. Herramientas y Librerías
- Modulación pura; no dependencias pesadas añadidas. NextJS React Client Components, Regex nativo.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Componentes Server vs Client:** Instanciar el script de IntersectionObserver dentro de un Componente de Cliente separado es completamente necesario ya que `page.tsx` es Asíncrono puro luego del anterior fix y no compilará con `useEffect`.
- **Iteración Segura de Regex:** Usar iteradores en python `re.sub` o match por grupo para no pisar el orden del escalamiento.

## 6. Historial de Aprendizaje (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 27/02 | N/A | N/A | N/A |

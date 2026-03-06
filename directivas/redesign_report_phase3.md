# Directiva: Fase 3 - Rediseño de Reporte Horizontal y Auditorias

## Objetivo
Implementar el rediseño del reporte (id) para utilizar un layout de 2 columnas en pantallas grandes, mejorar la UI de los hallazgos separándolos por tipo, y habilitar la página de listado del historia de auditorías (`/dashboard/auditorias`). Adicionalmente, insertar las claves faltantes de internacionalización en inglés y español.

## Entradas
- `src/app/reporte/[id]/page.tsx`
- `src/app/dashboard/auditorias/page.tsx`
- `messages/es.json`
- `messages/en.json`

## Salidas
Los cuatro archivos modificados o creados.

## Lógica y Pasos
1. Guardar el nuevo código reactivo (TSX) para `/reporte/[id]/page.tsx` que acomoda el grid `lg:grid-cols-12`.
2. Crear o reemplazar la vista del historial de auditorías en `/dashboard/auditorias/page.tsx`.
3. Inyectar en `messages/es.json` y `messages/en.json`:
   - En el nodo `"Reporte"`, añadir: `"criticalLabel"`, `"warningLabel"`, y `"opportunityLabel"`.
   - Añadir un nuevo nodo en el root `"Auditorias"` con su `title`, `subtitle`, `empty` y `auditLabel`.
4. El script debe parsear los archivos JSON para evitar inyecciones malformadas, cargándolos en un dict map y re-escribiendolos.

## Restricciones Adicionales
- Asegurarse de que el script en python mantenga la identación y los encodes a UTF-8 al modificar los JSON.

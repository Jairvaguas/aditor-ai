# Directiva: Agregar Secciones a la Landing Page

## Objetivo
Agregar 4 nuevas secciones (Security & Trust, Who is it for, Weekly Ritual, What makes us different) a la Landing Page en `src/app/page.tsx`, e incorporar sus respectivas traducciones en `messages/es.json` y `messages/en.json`.

## Entradas
- `src/app/page.tsx`
- `messages/es.json`
- `messages/en.json`

## Salidas
- Archivos TSX y JSON actualizados.

## Lógica y Pasos
1. **Paso 1:** Leer `src/app/page.tsx`. Reemplazar los imports de `lucide-react` para incluir los nuevos iconos: Shield, Users, ShoppingCart, Briefcase, Eye, Brain, BarChart3, Mail.
2. **Paso 2:** Encontrar la zona donde insertar las secciones (antes de la sección de Precios) usando de marcador `{/* 5. Precios */}`. Insertar los nuevos bloques de las 4 secciones.
3. **Paso 3:** Leer `messages/es.json` y `messages/en.json`.
4. **Paso 4:** Localizar en los JSONs el espacio entre `"feat3Desc"` y `"pricingTitle"` e insertar allí todas las nuevas claves de las 4 secciones.
5. **Paso 5:** Guardar y pushear a GitHub.

## Restricciones / Casos Borde
- Manejo de JSON: Garantizar que la reconstrucción del diccionario modifique el JSON manteniendo el UTF-8 válido (especialmente por eñes y tildes).
- Inserción JSX: Prestar atención a la ubicación mediante marcadores precisos.

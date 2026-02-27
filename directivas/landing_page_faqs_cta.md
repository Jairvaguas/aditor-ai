# DIRECTIVA: Landing Page FAQs y CTA

> **ID:** 03_landing_faqs_cta
> **Script Asociado:** `scripts/landing_page_faqs_cta.py`
> **Última Actualización:** 2026-02-27
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Añadir una sección de Preguntas Frecuentes (FAQs) con formato de acordeón y una sección de Call To Action (CTA) al final de la Landing Page principal, garantizando su total soporte multilingüe (ES/EN).
- **Criterio de Éxito:** Las traducciones se integran en `messages/en.json` y `messages/es.json`. El archivo `src/app/page.tsx` contiene los nuevos bloques JSX (FAQ y CTA) insertados justo antes del componente `<Footer />` y se compila sin errores.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Archivos Fuente:**
  - `messages/en.json`: JSON con traducciones en inglés.
  - `messages/es.json`: JSON con traducciones en español.
  - `src/app/page.tsx`: Archivo principal de la Landing Page.

### Salidas (Outputs)
- **Artefactos Modificados:**
  - `messages/en.json` (actualizado).
  - `messages/es.json` (actualizado).
  - `src/app/page.tsx` (actualizado).
- **Retorno de Consola:** Mensaje indicando éxito o fracaso de las modificaciones.

## 3. Flujo Lógico (Algoritmo)

1. **Lectura de Idiomas:**
   - Cargar `messages/en.json`.
   - Cargar `messages/es.json`.
2. **Inyección de Traducciones:**
   - Comprobar si la clave `FAQ` ya existe dentro de la clave `Landing`. Si no, inyectar el diccionario de preguntas y respuestas en inglés y español.
   - Comprobar si la clave `CTA` o sus elementos (`ctaTitle`, `ctaSubtitle`, etc.) existen en `Landing`. Si no, inyectarlos.
   - Guardar los JSON preservando el formato y la indentación.
3. **Modificación de la UI:**
   - Leer el contenido de `src/app/page.tsx`.
   - Ubicar el punto de inserción: justo antes del bloque de código `{/* 6. Footer */}`.
   - Si las secciones `FAQ` y `CTA` no están presentes:
     - Definir el código JSX de las secciones utilizando clases de TailwindCSS coherentes con el diseño oscuro actual (por ejemplo, `bg-[#0B1120]`, textos en `gray-400`, `text-[#00D4AA]` o `text-[#FF6B6B]`).
     - Insertar un componente `<details>` nativo de HTML para el acordeón, para evitar instalar bibliotecas de UI de terceros como Radix o shadcn si no es estrictamente necesario, manteniendo la simplicidad.
     - Insertar la nueva sección JSX en la ubicación predefinida.
   - Escribir los cambios en `src/app/page.tsx`.

## 4. Herramientas y Librerías
- **Librerías Python:** `json`, `os`, `re`.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Archivos JSON Inválidos:** Si los archivos JSON tienen errores de sintaxis, el script no debe intentar modificarlos y debe lanzar un error claro.
- **Múltiples Inserciones:** El script debe usar expresiones regulares o búsquedas de texto precisas (ej. buscar `<section id="faq"`) para asegurar que el código JSX no se duplique si el script se ejecuta más de una vez consecutivamente.
- **Diseño Responsivo:** Las clases Tailwind de las secciones inyectadas deben incluir los prefijos `md:` o `lg:` donde corresponda.

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)

| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 27/02 | Error Type en NextJS (Property 'w' does not exist on type 'SVGProps<SVGSVGElement>') | Uso de atributo no estándar `w` en vez de `width` en el código JSX inyectado del ícono SVG | Cambiar `<svg ... w="24">` a `<svg ... width="24">` en el template JSX del script |

> **Nota de Implementación:** Si encuentras un nuevo error, **primero** arréglalo en el script, y **luego** documenta la regla aquí para evitar regresiones futuras.

## 7. Ejemplos de Uso

```bash
# Ejecución estándar
python scripts/landing_page_faqs_cta.py
```
## 8. Checklist de Pre-Ejecución
- [x] Variables de entorno configuradas en `.env` (No requeridas para este script).
- [ ] Archivos de entrada disponibles.

## 9. Checklist Post-Ejecución
- [ ] `messages/*.json` contienen las nuevas claves bajo `Landing`.
- [ ] `src/app/page.tsx` incluye el JSX de FAQ y CTA sin errores de sintaxis TypeScript.

## 10. Notas Adicionales
- Se utiliza el estado HTML `<details>` y `<summary>` para el acordeón FAQ en pro de la ligereza y facilidad de implementación, dado que el usuario no especificó una biblioteca UI externa. Se usa un estilo limpio compatible con el diseño base de TailwindCSS.

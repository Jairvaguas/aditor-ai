# Directiva: Fix Import Newline Dashboard

## Objetivo
Corregir un error de sintaxis en `src/app/dashboard/page.tsx` introducido por un reemplazo literal de `\n` (slash n escapado) en lugar de un salto de línea real, que causa un error de compilación.

## Entradas
- `src/app/dashboard/page.tsx`

## Salidas
- `src/app/dashboard/page.tsx` modificado.

## Restricciones y Casos Borde (Aprendizaje del Bucle Central)
- **Error detectado**: El script anterior falló porque buscó la subcadena evaluada `\n` (salto de línea) o escapó incorrectamente el literal.
- **Nota: No hacer reemplazos confiando en que el string crudo de Python con `\\n` coincidirá directamente si hay un error de codificación o raw stringing previo**.
- **En su lugar, hacer**: Buscar la línea 22 de manera precisa, y reemplazar exactamente la ocurrencia de los dos caracteres literales `\` y `n` (anteponiendo una barra de escape adicional si se usa como string, eg. `r"\n"`) por un salto de línea real (`\n`). O, directamente, reemplazar toda la cadena completa `import LanguageSelector from "@/components/LanguageSelector";\\nimport AccountSwitcher from "@/components/AccountSwitcher";`.

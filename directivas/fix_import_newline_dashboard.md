# Directiva: Fix Import Newline Dashboard

## Objetivo
Corregir un error de sintaxis en `src/app/dashboard/page.tsx` introducido por un reemplazo literal de `\n` (slash n escapado) en lugar de un salto de línea real, que causa un error de compilación.

## Entradas
- `src/app/dashboard/page.tsx`

## Salidas
- `src/app/dashboard/page.tsx` modificado.

## Lógica y Pasos
1. Buscar la cadena literal `import LanguageSelector from "@/components/LanguageSelector";\nimport AccountSwitcher from "@/components/AccountSwitcher";`
2. Reemplazarla por:
```typescript
import LanguageSelector from "@/components/LanguageSelector";
import AccountSwitcher from "@/components/AccountSwitcher";
```
3. Guardar el archivo.

## Casos Borde y Aprendizaje
- **Restricción**: En Python, al usar `.replace()` con cadenas puras y `\\n` escapado, se escribe el literal `\n` en el archivo, rompiendo la sintaxis Typescript. 
- **Solución futura**: Siempre usar el caracter real de nueva línea `\n` en la cadena objetivo o strings multilínea cuando se inyecta código.

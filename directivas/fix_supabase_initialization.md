# DIRECTIVA: FIX_SUPABASE_INITIALIZATION

> **ID:** 2026-02-27-03
> **Script Asociado:** `scripts/fix_supabase_initialization.py`
> **Última Actualización:** 2026-02-27
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Prevenir que Next.js/Vercel falle durante el proceso de build ("Error: Missing Supabase environment variables") alterando la inicialización del cliente de Supabase (y cualquier otro cliente de API) de nivel de módulo a evaluación perezosa (lazy evaluation) dentro de funciones.
- **Criterio de Éxito:** `supabaseAdmin` ahora es la función `getSupabaseAdmin()` y se usa invocándola donde sea necesaria en lugar de importarla como una constante. El cliente de `Anthropic` también se inicializa dentro del context de las funciones para no romper la compilación de rutas estáticas.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Archivos Fuente:**
  - `src/lib/supabase.ts`
  - Todos los archivos `.ts` y `.tsx` en `src/` que importen y utilicen `supabaseAdmin`.
  - `src/lib/audit.ts` (para el cliente de Anthropic).

### Salidas (Outputs)
- **Artefactos Generados:**
  - `src/lib/supabase.ts` reconstruido exportando una función generadora.
  - Multiples archivos dentro de `src/` actualizados usando regex.
- **Retorno de Consola:** Imprime los archivos que han sido reescritos.

## 3. Flujo Lógico (Algoritmo)

1. **Reescribir supabase.ts:** Reemplazar el código entero que exporta la constante por una exportación de la función `getSupabaseAdmin()` que genera un `createClient` e internamente verifica variables de entorno.
2. **Actualizar referencias:** Escanear archivos `.ts` y `.tsx` recursivamente. Substituir la importación de `supabaseAdmin` por `getSupabaseAdmin`. Luego, sustituir instancias de `supabaseAdmin` por `getSupabaseAdmin()`.
3. **Manejar clientes paralelos (Anthropic):** En `src/lib/audit.ts`, capturar la inicialización a nivel de módulo de Anthropic y moverla justo al principio de la función `generateAudit()`.

## 4. Herramientas y Librerías
- **Librerías Python:** `os`, `re`.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Ejecución Múltiple:** El script debe de lidiar con si el código ya ha sido transformado o no (ej. regex que no falla).
- **Vercel Build Environment:** Vercel durante el static page evaluation evaluará todos los archivos al nivel de módulo. Cualquier variable de entorno que no esté en `NEXT_PUBLIC_` ni explícitamente compartida al build va a evaluar como `undefined`, llevando a caídas. ESTA ES LA REGLA ABSOLUTA a prevenir para este u otros escenarios similares.

## 6. Historial de Aprendizaje (Memoria Viva)
| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
| 27/02 | Error: Missing Supabase environment variables | Inicialización a nivel de módulo obliga a NextJS a leer process.env.SUPABASE_SERVICE_ROLE_KEY! durante el build. Al ser un token privado y no existir al buildeo sin request, da error abortivo. | Migramos de una const a la función `getSupabaseAdmin()`. |

## 7. Ejemplos de Uso
```bash
python scripts/fix_supabase_initialization.py
```

# Directiva: Eliminar Página de Prueba y Push

## Objetivo
Eliminar el archivo `src/app/test-audit/page.tsx` y desplegar los cambios a GitHub.

## Entradas
- Archivo a eliminar: `src/app/test-audit/page.tsx` (y su directorio si queda vacío).
- Commit message: `"chore: remove test page"`

## Pasos
1. **Eliminar Archivo**:
   - Borrar `src/app/test-audit/page.tsx`.
   - Si `src/app/test-audit` queda vacío, borrar el directorio.

2. **Git Push**:
   - `git add .`
   - `git commit -m "chore: remove test page"`
   - `git push`
   - Autenticación: Usar credenciales de `.env.deploy`.

## Consideraciones
- Verificar que el archivo exista antes de intentar borrarlo para evitar errores del script.

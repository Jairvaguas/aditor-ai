# Directiva: Renombrar Callback de Meta OAuth

## Objetivo
Renombrar la ruta del callback `/api/auth/callback` a `/api/meta/callback` para evitar colisiones con las rutas internas gestionadas por Clerk.

## Entradas
- Carpeta `src/app/api/auth/callback`
- Archivo `src/app/conectar/page.tsx`
- Archivo `src/middleware.ts`

## Lógica
1. **Renombrar ruta:** Mover el directorio `src/app/api/auth/callback` a `src/app/api/meta/callback` (creando la carpeta padre si es necesario).
2. **Frontend:** Modificar `src/app/conectar/page.tsx` para que `redirect_uri=https://www.aditor-ai.com/api/meta/callback`.
3. **Middleware:** En `src/middleware.ts`, eliminar `/api/auth/callback(.*)` del arreglo de rutas públicas, dejando `/api/meta/callback(.*)` que ya existía previamente.
4. Mostrar recordatorio al usuario para que actualice la URI válida en su consola de *Meta Developers*.

## Restricciones y Casos Borde
- `git mv` o `shutil.move` para no perder el histórico git, aunque un mv simple y un git add funcionarán igual.
- Asegurarse de quitar las referencias a `/api/auth/callback` limpiamente.

## Salidas
- Ruta renombrada.
- Archivos actualizados.
- Cambios empujados a GitHub.

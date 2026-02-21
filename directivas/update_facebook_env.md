# Directiva: Actualizar Variables de Entorno de Facebook

## Objetivo
Actualizar el archivo `.env.local` con las nuevas credenciales de Facebook App para la integración de Meta Ads y realizar el push a GitHub.

## Entradas
- `NEXT_PUBLIC_FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`

## Pasos de Ejecución
1. Leer `.env.local` y agregar o reemplazar las variables `NEXT_PUBLIC_FACEBOOK_APP_ID` y `FACEBOOK_APP_SECRET`.
2. Guardar el archivo.
3. Realizar `git add .`, `git commit` y `git push`.

## Restricciones
- Si el `git push` estándar falla por permisos, leer el token de `.env.deploy` (siguiendo el patrón) para autenticar la URL de push.
- No imprimir secretos en la salida estándar.

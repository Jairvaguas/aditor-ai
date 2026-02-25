# Directiva: Forzar Redeploy en Vercel para Variables de Entorno

## Objetivo
Realizar un commit vacío y subir los cambios (push) a GitHub para desencadenar automáticamente una nueva compilación (redeploy) en Vercel. Esto es necesario para que Vercel adopte las nuevas variables de entorno de Clerk configuradas en producción.

## Entradas
- Ningún archivo a modificar.
- Comando Git esperado: `git commit --allow-empty -m "force redeploy: update clerk env vars"` y `git push`.

## Lógica
1. Ejecutar el comando para crear el commit vacío.
2. Ejecutar push al repositorio remoto.

## Restricciones y Casos Borde
- Asegurarse de que el repositorio esté en buen estado antes del push.

## Salidas
- Commit vacío en Git.
- Trigger de Vercel (push exitoso).

# Directiva: Configuración y Despliegue de Git (Clean)

## Objetivo
Inicializar el repositorio Git local, configurar el remoto y realizar el primer push a GitHub de manera segura, sin exponer credenciales en el historial.

## Entradas
- URL del repositorio: `https://github.com/Jairvaguas/aditor-ai.git`
- Credenciales: Gestionadas vía variable de entorno o archivo `.env.deploy` (añadido a `.gitignore`).

## Pasos
1. **Preparación**:
   - Asegurar que `.env.deploy` contiene `GITHUB_TOKEN`.
   - Asegurar que `.gitignore` excluye `.env.deploy` y `.env`.
   - Eliminar historial `.git` previo si está corrupto o contiene secretos.
2. **Inicialización**:
   - `git init`
   - `git add .`
   - `git commit -m "feat: complete MVP Aditor AI"`
   - `git branch -M main`
3. **Autenticación y Push**:
   - Usar script Python para leer token y construir URL autenticada en memoria.
   - Ejecutar `git push -u <AUTH_URL> main` directamente.
   - Configurar `origin` a la URL pública `https://github.com/Jairvaguas/aditor-ai.git` (sin token) al finalizar.

## Seguridad
- NUNCA commitear el token.
- Verificar logs de push para asegurar que no se expusieron secretos (GitHub Push Protection bloqueará si detecta algo).

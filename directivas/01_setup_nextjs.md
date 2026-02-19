# Directiva: Configuración Inicial de Next.js

## Objetivo
Inicializar un proyecto Next.js 14 con la configuración específica requerida para Aditor AI, asegurando la instalación de todas las dependencias base.

## Entradas
- Directorio de trabajo actual.
- Lista de dependencias requeridas.

## Pasos de Ejecución
1.  **Validar Entorno:** Verificar si ya existe `package.json`. Si es así, detenerse o preguntar.
2.  **Inicialización de Next.js:**
    - Usar `npx create-next-app@latest`
    - Banderas obligatorias:
        - `--typescript`
        - `--tailwind`
        - `--eslint`
        - `--app` (App Router)
        - `--src-dir` (Usar carpeta `src/`)
        - `--import-alias "@/*"`
        - `--use-npm`
        - `--no-git` (Ya estamos en un repo probablemente, o lo manejamos después)
    - **Manejo de directorios no vacíos:** Como el directorio puede contener archivos de sistema (`directivas/`, `scripts/`, `.env`), `create-next-app .` podría fallar.
    - **Solución:** Crear la app en una subcarpeta temporal (ej: `_temp_app`) y luego mover los archivos generados a la raíz, fusionando con cuidado.
3.  **Instalación de Dependencias Adicionales:**
    - Instalar paquetes críticos para el stack definido:
        - Soporte Supabase: `@supabase/ssr`, `@supabase/supabase-js`
        - Soporte Clerk: `@clerk/nextjs`
        - UI/Iconos: `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`
        - Email: `resend`
        - IA: `@anthropic-ai/sdk`
4.  **Limpieza:** Borrar la carpeta temporal si se usó.

## Restricciones y Advertencias ACTUALIZADAS (Lecciones Aprendidas)
- **NO sobreescribir** archivos de configuración del agente.
- **Manejo de PATH:** Es CRÍTICO inyectar `C:\Program Files\nodejs` al `os.environ["PATH"]` en Python antes de llamar a subprocesos que dependan de `node` (como `create-next-app`). Sin esto, fallan silenciosamente o con error de archivo no encontrado.
- **Ejecución en Windows:** Para scripts `.cmd` (npm, npx), usar `subprocess.check_call(['cmd', '/c', path, ...], shell=False)` es más robusto que `shell=True`.
- **Nombres de Proyecto:** `create-next-app` falla si el nombre del proyecto contiene mayúsculas. Usar nombres en minúsculas (kebab-case) para carpetas temporales.
- **Interacción:** Usar `-y` o `--yes` tanto en `npm init` como en `create-next-app` para evitar prompts interactivos que bloquean la ejecución automatizada.
- **Manejo de PATH:** Si `npx` o `npm` no se encuentran (común tras instalación fresca sin reinicio), utilizar rutas absolutas:
    - `C:\Program Files\nodejs\npx.cmd`
    - `C:\Program Files\nodejs\npm.cmd`

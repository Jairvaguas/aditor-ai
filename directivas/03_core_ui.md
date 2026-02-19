# Directiva: Construcción de UI Core y Landing Page

## Objetivo
Implementar la identidad visual de Aditor AI y las dos primeras pantallas críticas: Landing Page y Conexión con Meta Ads.

## Entradas
- **Colores:**
    - Fondo: `#1A1A2E`
    - Acento Gradiente: `#E94560` (Coral) -> `#FFE66D` (Amarillo)
    - Verde: `#4ECDC4` (Mint)
- **Fuentes:**
    - Títulos: `Syne` (Google Fonts)
    - Cuerpo: `DM Sans` (Google Fonts)
- **Estructura de Páginas:**
    - `/` (Landing): Hero, Stats, Features.
    - `/conectar` (Auth): Lista de permisos, Botón OAuth simulado.

## Pasos de Ejecución
1.  **Configurar Fuentes y Layout (`src/app/layout.tsx`):**
    - Importar `Syne` y `DM_Sans` de `next/font/google`.
    - Aplicar variables CSS o clases globales para uso en Tailwind.
    - Establecer `metadata` base (Title: "Aditor AI - Tu Director de Performance").
    - Fondo body: `bg-[#1A1A2E] text-white`.
2.  **Estilos Globales (`src/app/globals.css`):**
    - Limpiar estilos por defecto de Next.js.
    - Asegurar directivas de Tailwind `@tailwind base; @tailwind components; @tailwind utilities;`.
3.  **Implementar Landing Page (`src/app/page.tsx`):**
    - **Hero:** Título grande con texto transparente y gradiente (`bg-clip-text text-transparent bg-gradient-to-r from-[#E94560] to-[#FFE66D]`).
    - **CTA:** Botón con flecha, redirige a `/conectar`.
    - **Stats:** Grid de 3 elementos.
    - **Features:** Grid de 3 elementos con íconos de `lucide-react`.
4.  **Implementar Página Conectar (`src/app/conectar/page.tsx`):**
    - Card central con borde sutil.
    - Listas de permisos:
        - ✅ Lo que SÍ hacemos (Iconos check verdes).
        - 🔒 Lo que NO tocamos (Iconos lock grises, opacidad).
        - Botón "Conectar con Facebook" (Azul Meta `#1877F2`).
        - Redirección simulada a `/teaser` (por ahora).

## Restricciones
- Usar **Lucide React** para los íconos (Search, TrendingUp, Repeat, Check, Lock, Facebook -usar svg manual o lucide si tiene-).
- Diseño **Mobile-First**: Clases base para móvil, `md:`/`lg:` para escritorio.
- Tailwind arbitrario (`[]`) permitido para colores específicos de marca, o extender `tailwind.config.ts` (preferible hardcodeado en clases por simplicidad del script por ahora).

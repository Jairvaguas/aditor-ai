# DIRECTIVA: [ADMIN_DASHBOARD_SOP]

> **ID:** 2026-02-21
> **Script Asociado:** `scripts/admin_dashboard.py`
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Crear un dashboard administrativo protegido bajo la ruta `/admin` que muestre métricas y un listado de usuarios de la base de datos Supabase, sin depender de Clerk para la autenticación en esta ruta específica.
- **Criterio de Éxito:** Al acceder a `/admin` sin sesión inicializada, redirige a `/admin/login`. Al iniciar sesión con credenciales correctas (de `.env.local`), muestra correctamente el dashboard con fondo `#0B1120`, tarjetas de resumen (Activos, Trial, Inactivos, MRR, Total) y una tabla de usuarios.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Variables de Entorno (.env local / Vercel):**
  - `ADMIN_USER`: Usuario administrador.
  - `ADMIN_PASSWORD`: Contraseña del administrador.

### Salidas (Outputs)
- **Archivos Generados / Modificados en Frontend:**
  - `src/middleware.ts` (Modificado para habilitar /admin).
  - `src/app/api/admin/login/route.ts` (Nuevo).
  - `src/app/api/admin/logout/route.ts` (Nuevo).
  - `src/app/admin/layout.tsx` (Nuevo).
  - `src/app/admin/login/page.tsx` (Nuevo).
  - `src/app/admin/page.tsx` (Nuevo).
- **Retorno de Consola:** Imprime los archivos generados con éxito.

## 3. Flujo Lógico (Algoritmo)
1. **Inicialización:** Declaración del script en Python definiendo el contenido en texto plano de cada archivo TypeScript/React.
2. **Generación Middleware:** Sobrescribir `src/middleware.ts` para que incluya exclusiones de Clerk en `/admin` y validación de la cookie `admin_session`.
3. **Generación Backend:** Escribir los endpoints `/api/admin/login` y `logout`.
4. **Generación UI:** Escribir las páginas `/admin/login/page.tsx`, `layout.tsx` y `/admin/page.tsx` usando TailwindCSS y componentes de diseño propios.
5. **Persistencia:** Guardar físicamente los archivos.

## 4. Herramientas y Librerías
- **Front:** Next.js, React, TailwindCSS, Lucide React.
- **Backend:** Next.js Route Handlers (`next/server`).
- **DB:** Supabase (`@supabase/supabase-js`).

## 5. Restricciones y Casos Borde (Edge Cases)
- **Autenticación Clerk:** Clerk por defecto protegerá todo, así que `/admin(.*)` y `/api/admin(.*)` deben ser explícitamente excluidos en `createRouteMatcher` antes de llamar a `auth().protect()`.
- **MRR Calculation:** Debe tratar activos (is_subscribed) y multiplicarlos por $47 USD promedio.

## 6. Historial de Aprendizaje
*(Esta sección se actualiza cada vez que se encuentra un nuevo caso borde o error)*

## 7. Ejemplos de Uso
```bash
python scripts/admin_dashboard.py
```

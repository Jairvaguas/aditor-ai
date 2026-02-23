# Directiva: Actualización de Favicon y Logos

## Objetivo
Reemplazar el favicon por defecto de Vercel con el nuevo escudo de Aditor AI en todos los puntos de la aplicación (archivos estáticos, metadata y componentes de UI).

## Entradas Requeridas
- Ruta de la imagen del nuevo escudo proveída por el usuario (en este caso, alojada temporalmente en los artefactos de la IA).

## Salidas Esperadas
- `/public/favicon.png` creado.
- `/public/favicon.ico` reemplazado.
- `src/app/layout.tsx` con la propiedad `icons` explícitamente definida en la metadata apuntando al nuevo favicon.
- `src/components/Navbar.tsx` consumiendo `favicon.png` o `favicon.ico` del nuevo escudo.
- `src/components/Footer.tsx` consumiendo la misma imagen.

## Lógica y Pasos
1. El script de ejecución utilizará `Pillow (PIL)` para tomar la imagen fuente y guardarla tanto como una imagen PNG normal (`favicon.png`) como un archivo de icono válido (`favicon.ico`) en la carpeta `public/`.
2. Se inyectará explícitamente en el objeto `metadata` de `layout.tsx` el atributo `icons: { icon: '/favicon.png' }` si no existe.
3. Se buscará en `Navbar.tsx` y `Footer.tsx` la referencia a `favicon.ico` dentro del componente `Image` de NextJS y se actualizará a `favicon.png` que es un formato con mayor calidad de soporte web.

## Trampas Conocidas (Edge Cases & Constraints)
- **Falta de PIL**: Puede que la librería PIllow no esté instalada, el script debe instalarla usando subprocess o un comando shell antes de correr la conversión.
- **Cache de Next.js**: NextJS puede quedarse con el favicon viejo en su caché de build (`.next/`). Se aconseja eliminar el viejo caché o simplemente refrescar la página fuertemente (hard refresh), pero los cambios se verán forzados por usar explicitamente `favicon.png` en los componentes.

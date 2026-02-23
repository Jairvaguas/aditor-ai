# Directiva: Actualización de Favicon y Logos

## Objetivo
Reemplazar el favicon por defecto de Vercel con el nuevo escudo de Aditor AI en todos los puntos de la aplicación (archivos estáticos, metadata y componentes de UI).

## Entradas Requeridas
- Ruta de la imagen del nuevo escudo proveída por el usuario (en este caso, alojada temporalmente en los artefactos de la IA).

## Salidas Esperadas
- `/public/favicon.png` creado.
- `/public/favicon.ico` reemplazado.
- `src/app/favicon.ico` ELIMINADO (Next.js App Router prioriza este sobre `/public`, causando que el viejo persista).
- `src/app/layout.tsx` con la propiedad `icons` extendida apuntando múltiplemente al nuevo favicon.
- `src/components/Navbar.tsx` consumiendo `favicon.png` o `favicon.ico` del nuevo escudo.
- `src/components/Footer.tsx` consumiendo la misma imagen.

## Lógica y Pasos
1. El script de ejecución utilizará `Pillow (PIL)` para tomar la imagen fuente y guardarla tanto como una imagen PNG normal (`favicon.png`) como un archivo de icono válido (`favicon.ico`) en la carpeta `public/`.
2. Se eliminará el archivo `src/app/favicon.ico` si existe.
3. Se inyectará explícitamente en el objeto `metadata` de `layout.tsx` el atributo `icons` con `icon`, `shortcut`, y `apple`.
4. Se buscará en `Navbar.tsx` y `Footer.tsx` la referencia a `favicon.ico` dentro del componente `Image` de NextJS y se actualizará a `favicon.png` que es un formato con mayor calidad de soporte web.

## Trampas Conocidas (Edge Cases & Constraints)
- **Falta de PIL**: Puede que la librería PIllow no esté instalada, el script debe instalarla usando subprocess o un comando shell antes de correr la conversión.
- **Cache de Next.js**: NextJS App Router tiene una trampa letal: `/src/app/favicon.ico` tomará precedencia suprema sobre `/public/favicon.ico` y la metadata. DEBE ser borrado si se quiere usar una directiva de icons personalizada en `layout.tsx`.

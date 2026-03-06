# Directiva: Ajuste de Copy en Landing Page

## Objetivo
Actualizar copys específicos de la landing page en los archivos de traducción (`es.json`, `en.json`) y ajustar la estructura JSX en `src/app/page.tsx` para acomodar un nuevo subtítulo (`heroDescSub`).

## Entradas
- `messages/es.json`
- `messages/en.json`
- `src/app/page.tsx`

## Salidas
- Archivos TSX y JSON actualizados.

## Lógica y Pasos
1. **Paso 1:** Actualizar diccionarios JSON (`messages/es.json` y `messages/en.json`).
   - Modificar `heroDesc`.
   - Insertar `heroDescSub` justo después de `heroDesc`.
   - Modificar `live`.
   - Modificar `week1Title`, `week2Title`, `week3Title`, `week4Title` agregando la numeración especificada.
2. **Paso 2:** Modificar `src/app/page.tsx`.
   - Buscar el bloque específico `<p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl" style={{ animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '150ms' }}>\n              {t("heroDesc")}\n            </p>` (ignorando espaciados variables adecuadamente).
   - Reemplazarlo por el nuevo bloque dividido en dos `<p>` (uno para `heroDesc` y otro para `heroDescSub`).
3. **Paso 3:** Guardar los cambios garantizando que no se rompan las indentaciones ni el encoding UTF-8.
4. **Paso 4:** Efectuar un `git add`, `commit` y `push` a GitHub.

## Restricciones / Casos Borde
- Manejo de JSON: Garantizar que la inserción de claves preserva el encoding `utf-8` para acentos.  
- Reemplazo exacto: El reemplazo en TSX debe hacer coincidir exactamente (salvo indentaciones/espacios en blanco) el tag `<p>` proporcionado.

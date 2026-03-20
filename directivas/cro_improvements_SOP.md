---
name: mejoras_cro
description: Mejoras CRO - Hero copy, badge, y modificaciones de precios
---

# Directiva: Mejoras de CRO para Landing Page

## Objetivo
Realizar cambios puntuales en los archivos de texto, landing page principal y formulario de precios para mejorar la tasa de conversión (CRO), resaltando valor, anclaje de seguridad y cambiando el copy.

## Archivos a Modificar
1. \`messages/es.json\`
2. \`messages/en.json\`
3. \`src/app/page.tsx\`
4. \`src/components/DynamicPricingForm.tsx\`

## Restricciones y Casos Borde
- No reemplazar archivos completos, solo hacer cambios puntuales en las secciones mencionadas.
- Asegurarse de mantener las comas válidas en JSON.
- Asegurarse de que no haya un div colapsado o syntax error en TSX.
- El score bar mencionado por el usuario no existe literalmente como "Score: 72/100" en el hero; se utilizará el contenedor del indicador de "live" como el punto de anclaje para insertar el elemento de "Meta Ads Sync" ya que ese es el inicio del mockup.
- Confirmar siempre los cambios con \`npm run build\` antes de hacer push en caso de ser necesario.

## Pasos de Ejecución
1. Actualizar \`messages/es.json\` con los nuevos textos.
2. Actualizar \`messages/en.json\` con los nuevos textos en inglés.
3. Modificar \`page.tsx\` insertando los nuevos divs de precio/seguridad en el Hero y el Badge Sync.
4. Modificar \`DynamicPricingForm.tsx\` con los nuevos títulos y copys.
5. Ejecutar la compilación del proyecto.
6. Commit y Push.

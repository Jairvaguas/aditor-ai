# PLAN DE EJECUCIÓN: LANDING PAGE "TEASER" ADITOR-AI

## OBJETIVO
Crear una landing page de alta conversión en la ruta `/teaser` diseñada específicamente para tráfico frío proveniente de Meta Ads. El objetivo principal es reducir la fricción y el miedo de los usuarios a conectar su cuenta de Facebook Ads, forzando la conversión hacia el registro de Clerk.

## ENTRADAS
- Tráfico frío de pauta publicitaria (Meta Ads).
- Principal dolor de la audiencia: Miedo a perder dinero (quemar presupuesto).
- Audiencia principal: Emprendedores y dueños de negocio que revisan el Ads Manager desde el celular y no entienden por qué no venden. No es para agencias grandes.

## SALIDAS (ENTREGABLES)
- Ruta principal: `src/app/teaser/page.tsx`
- Componente de cliente (Uso de `framer-motion` para animaciones y `lucide-react` para iconos).
- Diseño estilo "SaaS Premium" (inspiración Vercel/Linear), dark mode utilizando la paleta actual (Azules profundos `bg-[#0B1120]`, cianes de acento `#00D4AA`, y gradientes púrpuras).

## LÓGICA Y ESTRUCTURA (SECUENCIA)
1. **Hero Section (High Stakes):**
   - Headline enfocado en el dolor de perder dinero.
   - Imagen o Mockup de la plataforma.
   - CTA primario: "Auditar mi cuenta gratis". Redirige al registro de Clerk (`/sign-up` o flujo de conexión que inicie el registro).
2. **Social Proof & Trust:**
   - Logos o menciones a tecnologías confiables (Meta API, Clerk, Vercel).
   - Mensaje explícito de "Conexión Encriptada" y permisos de solo lectura.
3. **The "Why" (3 Beneficios Claros):**
   - Encontrar anuncios basura.
   - Escalar los anuncios ganadores.
   - Reportes generados en 60 segundos.
   - *Nota de interacción:* Deben aparecer con scroll usando animaciones de `framer-motion`.
4. **How it Works (Simplicidad en 3 pasos):**
   - Registro -> Conexión -> Reporte.
5. **Polarización (¿Para quién NO es esto?):**
   - Excluir a agencias grandes (100 clientes) y validar al emprendedor que lo hace todo desde su celular.
6. **Final CTA:**
   - Botón de CTA (ej., "Empezar Auditoría Gratuita") que en móviles debe volverse *Sticky* (pegajoso) para estar siempre a la vista.

## RESTRICCIONES Y CASOS BORDE
- No uses una plantilla o landing genérica. Mantén la estética "SaaS Premium".
- Asegúrate de que el CTA principal en mobile tenga un estado "sticky" tras pasar el Hero Section, de forma que el usuario siempre tenga a mano el registro sin la necesidad de hacer scroll de regreso.
- Al tratarse del App Router de Next.js (`src/app/teaser/page.tsx`), debes usar `"use client"` ya que se incluyen hooks y animaciones ligadas al scroll vía `framer-motion`.
- Maneja con cuidado la jerarquía visual de los headings (`h1` reservado a la Hero section) y el contraste entre texto secundario y el fondo dark.
- **Nota: No hacer uso de triples comillas dobles (`"""..."""`) en scripts de Python al volcar bloques grandes de código TSX que las puedan contener internamente, porque causa el error `SyntaxError: unterminated string literal` en la ejecución del script. En su lugar, hacer bloques de Raw String con triples comillas simples (`r'''...'''`).**

## PASOS DE EJECUCIÓN (A SEGUIR LUEGO EN CÓDIGO)
1. Declarar/confirmar jerarquía visual y reusabilidad de componentes con el usuario (ej. Navbar y Footer actuales en `src/app/page.tsx`).
2. Implementar estructura en `page.tsx` basada en las 6 secciones.
3. Aplicar colores, fuentes de marca (`font-display`) y componentes como `ArrowRight` (Lucide React).
4. Añadir `framer-motion` para suavizar entradas usando `whileInView`.
5. Probar el efecto Sticky de mobile y enlaces de Clerk.

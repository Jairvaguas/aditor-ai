# Directiva: Refactorización de UI - Landing Page

## Objetivo
Actualizar el diseño de la Landing Page para coincidir con las especificaciones del usuario y la referencia visual `aditor_prototype_v2.html`, priorizando las instrucciones explícitas del usuario.

## Entradas
- Archivo de referencia: `directivas/aditor_prototype_v2.html`
- Archivo fuente: `src/app/page.tsx`
- Instrucciones del usuario (prioridad alta).

## Cambios Requeridos

### 1. Stats Cards
- **Layout**: Flexbox horizontal (`flex-row`), no grid. Centrado.
- **Estilo**: Cards compactas (`stat-chip`).
- **Contenido**:
    - Número/Valor grande arriba.
    - Etiqueta descriptiva abajo.
    - Ejemplo: `[ Gratis / 1ra auditoría ]`
- **Referencia CSS**: Clases `.stat-row`, `.stat-chip`.

### 2. CTA Button (Hero)
- **Estilo**: Botón grande, fondo gradiente coral (#E94560 → #ff8e53).
- **Texto**: "Auditar mis campañas gratis →".
- **Color Texto**: Blanco.
- **Ubicación**: Entre subtítulo y stats (o debajo de stats según flujo, pero usuario dice "entre subtítulo y stats"). *Nota de corrección*: En el HTML de referencia está *debajo* de las stats. La instrucción usuario dice #2: "entre el subtítulo y las stats". **Seguir instrucción usuario.**

### 3. Feature Cards
- **Layout**: No ancho completo. Cards compactas.
- **Estilo**: Borde sutil, padding interno.
- **Disposición Interna**: Ícono arriba (según instrucción #3), título negrita, descripción gris.
- **Nota**: El HTML referencia tiene iconos a la izquierda, pero la instrucción dice "arriba". Mantener "arriba" pero mejorar el estilo "compacto".

### 4. Espaciado Global
- Aumentar el padding entre secciones para dar aire al diseño.

## Validaciones
- Verificar que el build de Next.js no rompa: `npm run build` (o verificar dev server).
- Verificar visualmente (simulado mediante revisión de clases Tailwind).

## Restricciones
- Usar Tailwind CSS para todo el estilizado.
- Mantener la paleta de colores definida en `globals.css` / Tailwind config si existe, o usar los hex codes directos si es necesario (el HTML ref usa variables CSS, el `page.tsx` usa hex codes arbitrarios). Preferir consistencia.

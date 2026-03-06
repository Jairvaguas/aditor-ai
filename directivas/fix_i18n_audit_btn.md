# Directiva: Fix i18n para AuditTriggerButton y Settings

## Objetivo
Quitar el hardcode "Iniciar Auditoría" del componente cliente `AuditTriggerButton` inyectándolo como prop desde el `page.tsx` del dashboard que sí tiene acceso a traducciones de lado servidor (`getTranslations`). Adicionalmente, corregir la traducción de Header de configuración al inglés, de "Configuration" a "Settings".

## Entradas
- `src/components/AuditTriggerButton.tsx`
- `src/app/dashboard/page.tsx`
- `messages/es.json`
- `messages/en.json`

## Salidas
Todos los archivos arriba listados, actualizados con las nuevas variables y cambios de props.

## Lógica y Pasos
1. **Componente Cliente:** Añadir interfaz o destructuring en `AuditTriggerButton` para aceptar la prop `label?: string`. Cambiar de `Iniciar Auditoría` hardcodeado a `{label || "Start Audit"}`.
2. **Dashboard:** Añadir el prop `<AuditTriggerButton label={t("startAudit")} />` donde antes estaba `<AuditTriggerButton />`.
3. **JSONs:** 
   - Agregar "startAudit" a la sección "Dashboard" de `es.json` y `en.json`.
   - Modificar "configuration" en "Header" de `en.json` para que sea "Settings".
4. **Validación:** Push to git si la build pasa.

## Restricciones
- Solo tocar la palabra solicitada ("Iniciar Auditoría"). Dejar "Analizando Campañas..." como está si el usuario no pidió explícitamente hacerlo paramétrico y para reducir cambios innecesarios de UI.

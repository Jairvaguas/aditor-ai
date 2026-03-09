# DIRECTIVA: REDISENO_REPORTE_TABS

> **ID:** rediseno_reporte_tabs
> **Script Asociado:** `scripts/rediseno_reporte_tabs.py`
> **Última Actualización:** 2026-03-09
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Separar los hallazgos del reporte en pestañas (tabs) para que el usuario navegue por categoría (Crítico, Advertencia, Oportunidad) sin scroll infinito.
- **Criterio de Éxito:** 
  1. Que el componente `src/components/FindingsTabs.tsx` se haya creado.
  2. Que `src/app/reporte/[id]/page.tsx` haya reemplazado la columna derecha de hallazgos por el nuevo componente, importando `FindingsTabs` y removiendo `FindingCard`.
  3. Que `messages/es.json` y `messages/en.json` contengan las nuevas traducciones en la sección "Reporte".

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Archivos Fuente:**
  - `src/app/reporte/[id]/page.tsx`: Vista del reporte.
  - `messages/es.json` y `messages/en.json`: Traducciones.

### Salidas (Outputs)
- **Artefactos Generados:**
  - `src/components/FindingsTabs.tsx`: Componente de interfaz de pestañas.
- **Retorno de Consola:** Log de ejecución o error específico detallando qué reemplazo falló.

## 3. Flujo Lógico (Algoritmo)

1. **Crear FindingsTabs.tsx**: Contener lógica y JSX para tabs e iterar sobre criticalFindings, warningFindings y opportunityFindings.
2. **Reemplazar layout en page.tsx**:
   - Insertar el import.
   - Encontrar bloque `className="lg:col-span-8 flex flex-col gap-6"`.
   - Remplazarlo por el llamado a `<FindingsTabs ... />`.
   - Eliminar componente `FindingCard` al final del documento.
3. **Traducir JSONs**: Insertar nuevas variables de interfaz (Resumen, Campaña, Tipo, Diagnóstico, Ver Detalle).

## 4. Herramientas y Librerías
- **Librerías Python:** `os`, `json`, `re`.

## 5. Restricciones y Casos Borde (Edge Cases)
- **Bloque de Findings en HTML:** Puede existir variabilidad en los tabs anidados. Utilizar conteo de tags para emparejar divs de apertura y cierre asegura su extirpación correcta.
- **Múltiples runs (Idempotencia):** El script debe poderse correr multiples veces. Si ya no está FindingCard o el bloque fue reemplazado, no debe dar error, idealmente solo debe avisarnos que ya se hizo.
- **Importaciones:** Cuidado con agregar redundancias al inicio de `page.tsx`.

## 6. Historial de Aprendizaje
*Por llenar tras el primer intento de ejecución si surgen fallos.*

## 7. Ejemplos de Uso
```bash
python scripts/rediseno_reporte_tabs.py
```

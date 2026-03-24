---
name: update_schedule_text
description: Actualizar textos de horarios y días a formato genérico
---

# Directiva: Actualizar textos de horarios y días a formato genérico

## Objetivo
El usuario requiere que cualquier mención de una hora o día específico de ejecución del cron (ej: "9:00 AM", "lunes", "lunes a las 9") sea reemplazada de manera genérica. Se indicará que la IA analizará las campañas automáticamente cada semana, sin atarse a un horario o día específico para evitar actualizaciones futuras si cambia el cronjob.

## Archivos a Modificar
1. `messages/es.json`
2. `messages/en.json`

## Restricciones y Casos Borde
- Modificar el valor de la clave `weeklyAuditDesc` con el texto exacto pedido por el usuario:
  - ES: `"La IA analizará tus campañas automáticamente cada semana y te enviará el reporte por email."`
  - EN: `"The AI will automatically analyze your campaigns every week and send you the report by email."`
- Otras claves a nivel de Landing:
  - `profile1Perk1`: "Auditorías automáticas cada lunes" -> "Auditorías automáticas cada semana" ("Automatic audits every week" en EN).
  - `weeklyTitle`: "Tu ritual de los lunes" -> "Tu ritual semanal" ("Your weekly ritual" en EN).
  - `week1Title`: "1. Lunes 9:00 AM — Análisis automático" -> "1. Cada semana — Análisis automático" ("1. Every week — Automatic analysis" en EN).
- Asegurar que el JSON permanezca válido tras los cambios (`ensure_ascii=False` y correcta indentación).

## Pasos de Ejecución
1. Crear/Actualizar script Python que lea y modifique las claves correspondientes en los diccionarios JSON.
2. Hacer dump de los diccionarios preservando codificación UTF-8.
3. Ejecutar script Python.
4. Commit y Push al repositorio en Github una vez que se completen los cambios.

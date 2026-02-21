# Directiva: Prueba de API de Meta (Test Meta API)

## Objetivo
Realizar una llamada de prueba real y exitosa a la API de Marketing de Meta (`https://graph.facebook.com/v19.0/me/adaccounts`) usando un `access_token` de prueba.

## Motivo
Meta requiere métricas de uso de la API para habilitar la solicitud de "Acceso Avanzado" a ciertos permisos. Realizar al menos una petición exitosa garantiza que se active el contador de llamadas en el panel de desarrolladores, lo cual habitualmente tarda hasta 24 horas en reflejarse.

## Entradas
- `ACCESS_TOKEN`: Un token de acceso válido provisto por Meta (en este caso proporcionado manualmente).

## Salidas
- Script en Python robusto en `scripts/test_meta_api.py`.
- Log en terminal de la respuesta JSON para verificar que el servidor devolvió un HTTP 200 y una lista válida de `data`.

## Restricciones y Casos Borde
- No exponer permanentemente el token en el repositorio. Usar una constante en el código con fines de prueba y recomendar remover o no subir el código final con él.
- Controlar posibles errores HTTP (ej: HTTP 400 por token inválido, HTTP 403 por permisos insuficientes) para determinar si la llamada falló por autenticación.
- Si falla, revisar si la IP o la red está bloqueando el tráfico hacia `graph.facebook.com`.

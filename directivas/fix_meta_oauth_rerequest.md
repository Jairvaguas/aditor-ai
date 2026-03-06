# Directiva: Añadir auth_type=rerequest a Facebook OAuth

## Objetivo
El objetivo es agregar `auth_type=rerequest` a la URL de OAuth en la inicialización de autenticación con Facebook. Esto garantiza que a los usuarios se les vuelva a solicitar los permisos denegados previamente (como `ads_read` o `business_management`) durante el login.

## Entradas y Salidas
- **Entrada:** `src/app/api/auth/facebook/route.ts`
- **Componente a Modificar:** Parámetros de la URL pasados a `URLSearchParams`.
- **Salida:** Archivo actualizado y subido a GitHub.

## Lógica de Ejecución
1. Localizar la inicialización del objeto `URLSearchParams` que contiene `client_id`, `redirect_uri`, y `scope`.
2. Añadir la propiedad `auth_type: 'rerequest',` a este objeto.
3. Guardar el archivo localmente.
4. Efectuar el commit con mensaje claro (`feat(auth): add auth_type=rerequest to Facebook OAuth`).
5. Realizar el push al repositorio remoto.

## Restricciones y Casos Borde
- Preservar los otros parámetros de validación (`state`, `response_type`, etc).
- Mantener la sintaxis existente en `URLSearchParams`.

# Directiva: Selección de Cuenta y Cobro Dinámico

## Objetivo
El usuario debe poder seleccionar explícitamente qué cuenta publicitaria auditar después del login de Meta, y el flujo de pago debe permitir elegir la cantidad de cuentas a auditar, ajustando el precio dinámicamente.

## Cambios en Base de Datos (Supabase)
Se requieren dos nuevas columnas en la tabla `profiles`:
- `ad_accounts_count` (integer, default 1)
- `selected_ad_account_id` (text)
*Atención: Dado que no hay cliente SQL configurado localmente en scripts, se enviará el script SQL al usuario para ejecutar en su panel de Supabase.*

## Lógica: Selección de Cuenta (Flujo /conectar)
1. **Callback OAuth**: `src/app/api/auth/callback/route.ts`
   - Después de intercambiar el código por el token y guardarlo en `connected_accounts`, en lugar de redirigir a `/teaser`, debe redirigir a un nuevo paso: `/conectar/cuentas`.
2. **Página de Selección**: `src/app/conectar/cuentas/page.tsx`
   - Obtener las cuentas publicitarias usando la API de Meta (`getAdAccounts`).
   - Mostrar lista para que el usuario elija.
   - Guardar `selected_ad_account_id` en `profiles`.
   - Después de guardar, continuar a `/teaser` (o equivalente).

## Lógica: Suscripción con Precio Dinámico (Flujo /subscribe)
1. **Frontend**: `src/app/subscribe/page.tsx` & `src/components/DynamicPricingForm.tsx`
   - Agregar dropdown: "¿Cuántas cuentas publicitarias quieres auditar?".
   - Opciones y Precios USD: 
     - 1 cuenta: $47 USD
     - 2 cuentas: $62 USD
     - 3 cuentas: $77 USD
     - 4 cuentas: $92 USD
     - 5 cuentas: $107 USD
     - Paquete 6-10 cuentas: $157 USD
     - Paquete 11-15 cuentas: $197 USD
     - Más de 16 cuentas: Contactar
   - Para la opción de "Más de 16 cuentas", no se muestra el botón de Mercado Pago. En su lugar, se muestra un botón para hablar por WhatsApp (`https://wa.link/xua0ua`).
   - Enviar este valor numérico a la API de creación de suscripción.
2. **Backend**: `src/app/api/payments/create-subscription/route.ts`
   - Recibir validación del número de cuentas solicitadas (`ad_accounts_count`).
   - Calcular monto en USD basado en los nuevos tiers (1 a 5, 10, o 15).
   - Calcular monto en USD y luego convertir a COP.
   - Pasar el precio dinámico a Mercado Pago al crear el registro de suscripción/preapproval.

## Restricciones y Puntos Críticos
- **Mercado Pago API**: Asegurarse de que el monto transaccional (`transaction_amount`) en el payload permita valores dinámicos. Usar suscripciones ("preapproval") con el monto total calculado en COP.
- **Tipado**: Manejar el estado `accountsCount` de forma segura en TypeScript.
- **Flujo UX**: La vista de selección de cuentas debe ser clara y no requerir más de 1 clic por cuenta para seleccionar y avanzar.

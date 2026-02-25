# Directiva: Guardián de Suscripción Permisivo (Trial Access)

## Objetivo
Resolver el bloqueo prematuro que expulsa a los usuarios recién registrados (que están seleccionando su cuenta en `/conectar`) hacia la pasarela de pago (`/subscribe`) antes de que puedan ver el Dashboard y su auditoría gratuita.
El frontend espera que el usuario aterrice en `/dashboard`, pero el archivo `checkSubscription.ts` (usado transversalmente en el layout) es demasiado estricto y no está reconociendo la bandera `plan: 'trial'`.

## Archivos a Modificar
- `src/lib/checkSubscription.ts`

## Lógica Backend (API Guard)
1. Modificar la consulta a Supabase en `checkSubscription.ts` para extraer adicionalmente el campo `plan`.
2. Incluir una regla de excepción: Si `data.plan === 'trial'`, retornar `true` incondicionalmente, permitiéndole al usuario explorar su Dashboard y consumir su auditoría gratuita.
3. El pago y `/subscribe` será exigido orgánicamente solo cuando el usuario active una acción bloqueante distinta o su plan pase a estado `expired`/`inactive`.

## Salida
- Script Python para parchear `checkSubscription.ts`.
- Subida de los cambios a GitHub para despliegue automático en Vercel.

# Directiva: Soporte Multi-Cuenta Publicitaria

## Objetivo
Refactorizar la lógica de conexión y selección de cuentas de Meta Ads para permitir que un usuario seleccione y guarde múltiples cuentas publicitarias en la base de datos (hasta su límite `ad_accounts_count`), y pueda navegar entre ellas.

## Entradas
- `src/app/api/auth/select-account/route.ts`
- Nuevo: `src/app/api/auth/switch-account/route.ts`
- Nuevo: `src/app/api/auth/connected-accounts/route.ts`
- `src/components/AccountSelector.tsx`
- `src/app/conectar/cuentas/page.tsx`

## Salidas
Los cinco archivos actualizados/creados con la nueva lógica basada en el código entregado por el usuario.

## Lógica y Pasos
1. **Paso 1:** Reemplazar el contenido de `src/app/api/auth/select-account/route.ts` con la nueva lógica que evalúa si la cuenta ya existe (`connected_accounts`), verifica el límite de cuentas (`maxAccounts`) y la inserta si hay espacio, actualizando luego `selected_ad_account_id` en `profiles`.
2. **Paso 2:** Crear `src/app/api/auth/switch-account/route.ts` con la lógica para simplemente intercambiar qué cuenta ver en el dashboard (`selected_ad_account_id`).
3. **Paso 3:** Crear `src/app/api/auth/connected-accounts/route.ts` con la lógica para listar las cuentas actuales del usuario desde `connected_accounts`.
4. **Paso 4:** Sobrescribir `src/components/AccountSelector.tsx` con el componente actualizado que maneja los estados `isAtLimit` e `isConnected`, llamando visualmente al switch o a la selección según el escenario.
5. **Paso 5:** Sobrescribir `src/app/conectar/cuentas/page.tsx` para que pase el arreglo de IDs mapeados (`connectedAccountIds`) al componente Selector.
6. **Paso 6:** Confirmar la correcta ejecución y realizar un `Push` a GitHub.

## Restricciones y Notas
- Evitar truncar el código. Se deben pegar literalmente los bloques provistos.
- Asegurarse de que los nuevos archivos se creen asegurando todas las carpetas padre.

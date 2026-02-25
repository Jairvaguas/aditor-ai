# Directiva: Remoción de Auto-Selección en Callback de Meta

## Objetivo
Quitar la lógica del callback de Meta que pre-asignaba automáticamente la primera campaña publicitaria (`adAccounts[0]`) a la columna `selected_ad_account_id` del usuario recién registrado. Este comportamiento robaba al usuario la oportunidad de escoger libremente su cuenta en la interfaz de pantalla diseñada para tal fin (`/conectar/cuentas`).

## Archivo Objetivo
- `src/app/api/meta/callback/route.ts`

## Lógica Backend a Eliminar
Se debe borrar por completo el bloque de código entre el final del primer upsert y el `Redirigir a Selección`:

```typescript
// Mejor obtenemos las cuentas y guardamos la primera
const adAccounts = await getAdAccounts(accessToken);

if (adAccounts.length > 0) {
    const selectedAccount = adAccounts[0];
    const { error: accDbError } = await supabaseAdmin
        ...
}
```

## Condición Final Deseada
1. El callback captura el código desde Facebook y llama a la API.
2. Extrae el IP de la petición (país, moneda) y hace sanidad de los correos duplicados en Clerk.
3. UPSERT a supabase `profiles` con los datos base: `clerk_user_id`, `meta_access_token`, `email`, `nombre`, `pais`, `moneda`.
4. El script hace *inmediatamente* un `NextResponse.redirect` hacia `/conectar/cuentas` **sin tocar de ninguna forma** el campo `selected_ad_account_id`.
5. Esto delega 100% de la responsabilidad de esa columna a `src/app/api/auth/select-account/route.ts` cuando el usuario hace clic en el Frontend.

## Salida
- Script de Parcheo en Python.
- Push a GitHub.

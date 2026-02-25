# Directiva: Lógica de Negocio de Selección de Cuentas (Bloqueos, Límites y Unicidad)

## Objetivo
Implementar restricciones críticas de seguridad en el flujo de adopción de Cuentas Publicitarias de Meta:
1. **Bloqueo Inmutable (Limit=1):** Impedir que un usuario cambie la cuenta publicitaria una vez seleccionada su primera cuenta.
2. **Unicidad Global:** Evitar que múltiples usuarios reclamen la misma cuenta publicitaria (prevención de fraude/compartición de cuentas).
3. **Bloqueo UI:** Deshabilitar visualmente las cuentas no reclamadas si el usuario ya tiene una anclada.

## Archivos a Modificar
1. **`src/app/api/auth/select-account/route.ts`** (Backend HTTP)
2. **`src/app/conectar/cuentas/page.tsx`** (Server Component Frontend)
3. **`src/components/AccountSelector.tsx`** (Client Component Frontend)

## Lógica del Backend (API)
1. **Consulta Preventiva:** Antes de insertar nada, leer `selected_ad_account_id` (la cuenta anclada actual) del usuario.
2. **Traba Límite=1:** Si la cuenta ya está anclada a X, y el usuario intenta enviar Y, rechazar con HTTP 403 `error: 'already_locked'`.
3. **Traba Unicidad:** Validar con Supabase si *cualquier otro usuario* diferente (`neq`) ya tiene anclada esa cuenta publicitaria Y en su columna `selected_ad_account_id`. Si sí, rechazar con 403 `error: 'account_already_in_use'`. 

## Lógica del Frontend
1. Extraer `selected_ad_account_id` de `profiles` al momento de cargar la página de cuentas en SSR (Server-Side).
2. Propulsar ese valor al `<AccountSelector currentSelection={profile.selected_ad_account_id} />`.
3. En el selector, usar ese valor inicial para preseleccionar y deshabilitar (`disabled={true}`) al resto de cuentas. Renderizar etiqueta "Cuenta vinculada" en la de uso.
4. Ajustar el Catch de la API para enrutar `?error=account_already_in_use` apropiadamente en caso de colisiones en tiempo real.

## Salidas
- Script Python que modifique los archivos.
- Push a GitHub.

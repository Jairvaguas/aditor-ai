# Directiva: Zero-State Dashboard y Conversión de Trial

## Objetivo
Transformar el Dashboard de un mock estático a una experiencia Reactiva en "Zero-State" cuando el usuario es nuevo. Trasplantar la lógica de creación de auditorías (que arrancamos de `select-account`) a un botón dinámico (`AuditTriggerButton.tsx`) en el Dashboard, comunicándose con un nuevo backend especializado `/api/audit/start`. Por último, implementar una regla de Conversión amigable en la que agotar el Trial redirija al checkout (`/subscribe`) en lugar de arrojar errores feos de conexión.

## Archivos Involucrados
- **[NUEVO]** `src/app/api/audit/start/route.ts`: API Endpoint consolidado.
- **[NUEVO]** `src/components/AuditTriggerButton.tsx`: Client Component con estado visual (Loading, Toasts).
- **[MODIFICAR]** `src/app/dashboard/page.tsx`: Server Component que lee la BD y pinta "0" / "Vacío" si el usuario no tiene auditorías, e inyecta el nuevo Botón.

## Lógica Backend (`/api/audit/start/route.ts`)
1. Autenticar `userId`.
2. Extraer el perfil, verificando `plan`, `meta_access_token`, `selected_ad_account_id` y `moneda`.
3. Contar en la tabla `auditorias` el número de análisis que ha hecho este usuario.
4. Si `plan === 'trial'` y `count > 0`: `return NextResponse.json({ success: false, reason: 'trial_exhausted', redirectUrl: '/subscribe' })`.
5. Si pasa, extraer Insights de Meta.
6. Generar Auditoría con IA.
7. Retornar éxito: `{ success: true, auditId: result.id, redirectUrl: '/teaser?auditId=[ID]' }`.

## Lógica Frontend (`AuditTriggerButton.tsx`)
1. Botón visualmente idéntico al actual en el Dashboard.
2. `onClick`: `setIsLoading(true)`, `fetch('/api/audit/start')`.
3. Si la respuesta es `trial_exhausted`: Mostrar `alert("Has agotado tu auditoría gratuita. ¡Pásate a Pro para análisis ilimitados!")` y hacer `router.push(data.redirectUrl)`.
4. Si hay `auditId`: `router.push('/teaser?auditId=...')`.

## Lógica Dashboard (`page.tsx`)
1. `const { count: auditCount } = await supabaseAdmin.from('auditorias').select('*', { count: 'exact' }).eq('clerk_user_id', user.id);`
2. Variables derivadas: `const isZeroState = auditCount === 0;`
3. Si `isZeroState`:
    - Métricas: 0x, 0%, $0, $0.
    - Ocultar la tabla de listado duro o mostrar un renglón "Esperando primera auditoría...".
4. Sustituir el `<Link>` tonto por `<AuditTriggerButton />`.

## Salida
- Script Python que escribirá los archivos.
- Push a producción.

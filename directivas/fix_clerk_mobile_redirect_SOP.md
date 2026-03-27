# Directiva: Fix Clerk Mobile Redirect

## Objetivo
Implementar un pequeño retraso (delay) antes de redirigir a los usuarios no autenticados en dispositivos móviles, permitiendo que el SDK de Clerk complete su inicialización y evitando redirecciones prematuras o en bucle vacío.

## Entradas
- Estado de autenticación (`useAuth()` de Clerk): `isLoaded`, `userId`
- Rutas protegidas (ej. `/conectar`)

## Salidas
- Redirección con estado limpio una vez validado `!userId` después del montaje y carga de Clerk.

## Lógica y Pasos
1. **Identificar la redirección:** Ubicar el `useEffect` responsable de reaccionar a `isLoaded` y `!userId`.
2. **Implementar retraso temporal (Timeout):** Envolver el `router.push('/login')` en un `setTimeout` de 1500 milisegundos.
3. **Limpieza del Timeout:** Siempre devolver un `clearTimeout(timer)` en el `useEffect` para evitar redirecciones huérfanas o memory leaks si el componente se desmonta antes de que se cumpla el tiempo.
4. **Manejo Visual de Carga:** 
   - Mientras `!isLoaded` sea verdadero, mostrar el spinner de carga para evitar un flash (flicker) sin contenido.
   - Si `isLoaded` es verdadero pero no hay `userId` (durante la espera del setTimeout), devolver `null` para evitar renderizar el contenido protegido y ocultar el spinner (el useEffect enviará al login).

## Trampas Conocidas y Restricciones
- **Nota: No ejecutar `router.push` inmediatamente si `isLoaded && !userId`**, porque causa que en móviles Clerk no tenga tiempo suficiente para hidratar el estado de la sesión si fue redirigido por un provider externo, resultando en falsos negativos de sesión. En su lugar, hacer una espera activa usando `setTimeout`.
- **Nota: No mostrar el contenido estático** si no existe un `userId` pero `isLoaded` ya es verdadero. Retornar `null` para blanquear la pantalla mientras curre la redirección programada.

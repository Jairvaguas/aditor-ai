# Directiva: Corrección de Email y Push

## Objetivo
Corregir la inicialización de Resend en `src/lib/email.ts` para que sea lazy (evitar error en build si falta env var) y pushear los cambios a GitHub.

## Entradas
- Archivo a modificar: `src/lib/email.ts`
- Commit message: `"fix: lazy resend initialization"`

## Pasos
1. **Modificar Código**:
   - Reemplazar inicialización global `const resend = new Resend(...)` con función `getResend()`.
   - Actualizar `sendAuditReadyEmail` para usar `getResend()`.
   - Manejar caso donde `resend` es null (retornar silenciosamente o loguear error).

2. **Git Push**:
   - `git add .`
   - `git commit -m "fix: lazy resend initialization"`
   - `git push`
   - Usar credenciales de `.env.deploy` (como en directiva de deploy anterior) para evitar prompts.

## Restricciones
- No romper la funcionalidad existente si las keys están presentes.
- Asegurar que el push sea no-interactivo.

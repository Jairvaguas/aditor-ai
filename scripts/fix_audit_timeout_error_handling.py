import os
import subprocess

def patch_backend_api():
    file_path = "src/app/api/audit/start/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    # Add console log before AI call
    old_ai_call = "        // 4. Generar Auditoría (IA)\n        const auditResult = await generateAudit(campaigns, clerkUserId, currency);"
    new_ai_call = "        // 4. Generar Auditoría (IA)\n        console.log(\"DEBUG - Iniciando proceso de IA...\");\n        const auditResult = await generateAudit(campaigns, clerkUserId, currency);"
    
    if old_ai_call in content:
        content = content.replace(old_ai_call, new_ai_call)
        
    # Patch the catch block
    old_catch = "        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });"
    new_catch = "        return NextResponse.json({ error: 'audit_failed', message: error.message || 'Server error' }, { status: 500 });"
    
    if old_catch in content:
        content = content.replace(old_catch, new_catch)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated route.ts successfully.")

def patch_frontend_button():
    file_path = "src/components/AuditTriggerButton.tsx"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return
        
    # Replace the fetch call to handle 504 correctly (if Vercel returns HTML on timeout)
    old_fetch_block = """    const handleAudit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/audit/start', {
                method: 'POST'
            });
            const data = await res.json();

            if (res.ok && data.success) {
                router.push(data.redirectUrl);
            } else if (data.reason === 'trial_exhausted') {
                alert('Has agotado tu auditoría gratuita. ¡Pásate a Pro para análisis ilimitados!');
                router.push(data.redirectUrl || '/subscribe');
            } else {
                alert(`Error: ${data.error || 'Algo salió mal al conectar con Meta o la IA.'}`);
            }
        } catch (err) {
            alert('Error de red Inesperado.');
        } finally {
            setIsLoading(false);
        }
    };"""
    
    new_fetch_block = """    const handleAudit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/audit/start', {
                method: 'POST'
            });
            
            let data;
            try {
                data = await res.json();
            } catch (jsonErr) {
                console.error("Failed to parse JSON response. Likely a 504 Gateway Timeout from Vercel.", jsonErr);
                alert("La auditoría está tomando más tiempo del esperado. Por favor, revisa tu correo en unos minutos o intenta de nuevo.");
                return;
            }

            if (res.ok && data.success) {
                router.push(data.redirectUrl);
            } else if (data.reason === 'trial_exhausted') {
                alert('Has agotado tu auditoría gratuita. ¡Pásate a Pro para análisis ilimitados!');
                router.push(data.redirectUrl || '/subscribe');
            } else {
                console.error("Backend Error:", data.message || data.error);
                alert(`Error en la Auditoría: ${data.message || data.error || 'Error desconocido.'}`);
            }
        } catch (err) {
            console.error("Network Fetch Error:", err);
            alert('Error de red Inesperado. Revisa tu conexión.');
        } finally {
            setIsLoading(false);
        }
    };"""
    
    if old_fetch_block in content:
        content = content.replace(old_fetch_block, new_fetch_block)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated AuditTriggerButton.tsx successfully.")
    else:
        print("Warning: old logic block not strictly found in AuditTriggerButton.tsx")

def write_directive():
    dir_path = "directivas"
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, "fix_audit_timeout_error_handling.md")
    
    content = """# Directiva: Manejo de Errores y Timeouts en Auditoría (Vercel Hobby Plan)

## Objetivo
El Plan Hobby de Vercel tiene un hard limit de 10 segundos para Serverless Functions. La llamada a la IA de Anthropic en campañas grandes suele rozar o exceder este límite, devolviendo un error HTTP 504 (que devuelve HTML, no JSON). Esto ocasionaba que el frontend (`res.json()`) arrojara una excepción silenciosa no parseada. 

Debemos forzar el Dashboard para que, bajo ninguna circunstancia, el botón rebote al usuario hacia `/conectar`. En cambio, retenerlo, reportear en consola, y arrojar avisos manejables.

## Lógica Implementada
1. **Frontend (`AuditTriggerButton.tsx`)**:
   - Bloque de Try/Catch anidado específicamente para intentar el `.json()`. Si falla, deduce timeout y emite un `alert` local (sin redirección) para salvar el progreso del usuario en el panel.
   - Eliminados todos los redireccionamientos residuales excepto Éxito y Conversión.
2. **Backend (`api/audit/start/route.ts`)**:
   - Etiqueta de `console.log("DEBUG - Iniciando proceso de IA...")` inyectada inmediatamente antes de Anthropic para crear un checkpoint rastreable en el Log de Vercel.
   - Si la API falla, responder con `status: 500` pero incluyendo un objeto legible `{ error: 'audit_failed', message: error.message }`.

## Reglas Derivadas (SOP)
*Si la API de Meta no devuelve campañas*, el backend se aborta antes del timeout, respondiendo `no_campaign_data` y no consume saldo de IA ni tiempo límite.
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {file_path}")

def main():
    patch_backend_api()
    patch_frontend_button()
    write_directive()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: handle Vercel 504 timeouts gracefully, prevent redirects on error, add detailed AI logs"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

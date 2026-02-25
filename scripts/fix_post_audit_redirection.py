import os
import subprocess

def patch_backend_redirect():
    file_path = "src/app/api/audit/start/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    old_redirect = "            redirectUrl: `/teaser?auditId=${auditResult.id}`"
    new_redirect = "            redirectUrl: `/reporte/${auditResult.id}`"
    
    if old_redirect in content:
        content = content.replace(old_redirect, new_redirect)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated route.ts successfully.")
    else:
        print("Warning: old redirect string not found. Is it already patched?")

def write_directive():
    dir_path = "directivas"
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, "fix_post_audit_redirection.md")
    
    content = """# Directiva: Flujo de Redirección Post-Auditoría

## Objetivo
El usuario logeado en el Dashboard que activa el botón "Iniciar Auditoría", genera su propio reporte autenticado. Por error tipográfico en la migración del Zero-State, la API estaba devolviendo la URL `/teaser?auditId=...` en lugar de `/reporte/[id]`. Dado que `/teaser` posee lógicas agresivas de redirección a `/conectar` si faltan parámetros, esto causaba un loop de expulsiones indebidas.

## Resolución
1. Se modificó el endpoint `src/app/api/audit/start/route.ts`.
2. El campo `redirectUrl` del JSON de retorno exitoso ahora apunta al layout autenticado: `/reporte/${auditResult.id}`.
3. El frontend  `<AuditTriggerButton />` ejecuta `router.push('/reporte/...');` nativamente sin problemas.

## Comprobación
Los usuarios logeados nunca deben ser expulsados a `/conectar` si ya poseen un `meta_access_token` validado y ya generaron el XML.
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {file_path}")

def main():
    patch_backend_redirect()
    write_directive()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: redirect to /reporte/[id] instead of /teaser on successful audit generation from dashboard"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

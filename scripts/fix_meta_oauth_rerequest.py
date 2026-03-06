import os
import subprocess
from pathlib import Path

# Configurar rutas
WORKSPACE = Path(r"c:\Users\Lenovo\Documents\Antigravity\AuditorAI")
TARGET_FILE = WORKSPACE / "src" / "app" / "api" / "auth" / "facebook" / "route.ts"

def modify_file():
    print(f"Leyendo archivo: {TARGET_FILE}")
    with open(TARGET_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    if "auth_type: 'rerequest'" in content:
        print("El parámetro auth_type ya existe en el archivo. No se realizarán cambios.")
        return False

    # Bloque de reemplazo original
    old_block = """        scope: 'ads_read,business_management',
        state: state,
        response_type: 'code',
    });"""

    # Nuevo bloque con auth_type
    new_block = """        scope: 'ads_read,business_management',
        state: state,
        response_type: 'code',
        auth_type: 'rerequest',
    });"""

    new_content = content.replace(old_block, new_block)

    if new_content == content:
        print("Error: No se pudo encontrar el bloque objetivo para reemplazar. Verifique el contenido del archivo.")
        return False

    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print("Archivo modificado exitosamente.")
    return True

def git_commit_and_push():
    print("Añadiendo cambios a git...")
    subprocess.run(["git", "add", str(TARGET_FILE)], cwd=WORKSPACE, check=True)
    
    print("Haciendo commit...")
    subprocess.run(["git", "commit", "-m", "feat(auth): add auth_type=rerequest to Facebook OAuth"], cwd=WORKSPACE, check=True)
    
    print("Haciendo push a GitHub...")
    subprocess.run(["git", "push"], cwd=WORKSPACE, check=True)

if __name__ == "__main__":
    if modify_file():
        git_commit_and_push()
    else:
        print("Finalizado sin operaciones de git.")

import subprocess
import os
import sys
import shutil

# Configuración
FILE_TO_REMOVE = "src/app/test-audit/page.tsx"
DIR_TO_REMOVE = "src/app/test-audit"
COMMIT_MSG = "chore: remove test page"

def load_env(filepath):
    env = {}
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            for line in f:
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    env[key] = value
    return env

config = load_env(".env.deploy")
TOKEN = config.get("GITHUB_TOKEN")
USERNAME = config.get("GITHUB_USER")

if not TOKEN or not USERNAME:
    print("Error: No se encontraron credenciales en .env.deploy.")
    sys.exit(1)

AUTH_REPO_URL = f"https://{USERNAME}:{TOKEN}@github.com/{USERNAME}/aditor-ai.git"

def run_command(command, cwd=None):
    cmd_str = ' '.join(command)
    safe_cmd = cmd_str.replace(TOKEN, '***')
    print(f"Ejecutando: {safe_cmd}")
    try:
        subprocess.run(
            command, cwd=cwd, check=True, text=True,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
        return False

def main():
    root_dir = os.getcwd()
    file_path = os.path.join(root_dir, FILE_TO_REMOVE)
    dir_path = os.path.join(root_dir, DIR_TO_REMOVE)

    # 1. Eliminar archivo
    if os.path.exists(file_path):
        print(f"Eliminando {FILE_TO_REMOVE}...")
        os.remove(file_path)
    else:
        print(f"El archivo {FILE_TO_REMOVE} no existe.")

    # Eliminar directorio padre si está vacío
    if os.path.exists(dir_path) and not os.listdir(dir_path):
        print(f"Eliminando directorio vacío {DIR_TO_REMOVE}...")
        os.rmdir(dir_path)

    # 2. Git operations
    print("Preparando commit...")
    run_command(["git", "add", "."])
    
    status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
    if status.stdout.strip():
        run_command(["git", "commit", "-m", COMMIT_MSG])
        print("Realizando push...")
        if run_command(["git", "push", AUTH_REPO_URL, "main"]):
            print("¡Cambios desplegados exitosamente!")
        else:
            print("Falló el push.")
            sys.exit(1)
    else:
        print("No hay cambios para commitear (¿quizás el archivo ya estaba borrado?).")

if __name__ == "__main__":
    main()

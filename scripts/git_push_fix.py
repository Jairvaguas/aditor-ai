import subprocess
import os
import sys

# Reutilizar lógica de .env.deploy si existe, o intentar directo si ya está configurado el remote
# Como acabamos de configurar el remote con token en el paso anterior, o lo limpiamos...
# El paso anterior limpió y puso remote https público.
# Necesitamos AUTH para push.
# LEEMOS .env.deploy DE NUEVO.

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
    # Fallback: intentar leer de variable de entorno del sistema si estuviera set (no lo está)
    print("Error: No se encontraron credenciales en .env.deploy para el push.")
    sys.exit(1)

AUTH_REPO_URL = f"https://{USERNAME}:{TOKEN}@github.com/{USERNAME}/aditor-ai.git"

def run_command(command, cwd=None):
    cmd_str = ' '.join(command)
    # Mask token
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
    print("Iniciando Git Push Fix...")
    
    # 1. Add
    run_command(["git", "add", "."])
    
    # 2. Commit
    # Check status first
    status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
    if not status.stdout.strip():
        print("No hay cambios para commitear.")
    else:
        run_command(["git", "commit", "-m", "fix: lazy resend initialization"])

    # 3. Push
    # Usamos la URL autenticada explícita
    success = run_command(["git", "push", AUTH_REPO_URL, "main"])
    
    if success:
        print("¡Fix pusheado exitosamente!")
    else:
        print("Error en push.")
        sys.exit(1)

if __name__ == "__main__":
    main()

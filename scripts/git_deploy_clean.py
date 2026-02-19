import subprocess
import os
import sys

# Leer credenciales desde .env.deploy (no commiteado)
def load_env(filepath):
    """Carga variables simples desde un archivo .env"""
    env = {}
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            for line in f:
                if '=' in line:
                    key, value = line.strip().split('=', 1)
                    env[key] = value
    return env

def run_command(command, cwd=None):
    """Ejecuta comando y muestra salida. Oculta token si aparece."""
    # Enmascarar token en print
    cmd_str = ' '.join(command)
    print(f"Ejecutando: {cmd_str.replace(TOKEN, '***') if 'TOKEN' in globals() else cmd_str}")
    
    try:
        result = subprocess.run(
            command, cwd=cwd, check=True, text=True,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error (STDERR): {e.stderr}")
        return False

# Cargar configuración
config = load_env(".env.deploy")
TOKEN = config.get("GITHUB_TOKEN")
USERNAME = config.get("GITHUB_USER")
REPO_URL = config.get("REPO_URL", "https://github.com/Jairvaguas/aditor-ai.git")

if not TOKEN or not USERNAME:
    print("Error: No se encontraron credenciales en .env.deploy")
    sys.exit(1)

# Construir URL autenticada en memoria
AUTH_REPO_URL = f"https://{USERNAME}:{TOKEN}@github.com/{USERNAME}/aditor-ai.git"

def main():
    root_dir = os.getcwd()
    
    # 1. git init
    if not os.path.exists(os.path.join(root_dir, ".git")):
        print("Inicializando repositorio...")
        run_command(["git", "init"])
    else:
        print("Repositorio ya inicializado (limpiando configuración previa...)")
        # Asegurar remote limpio
        subprocess.run(["git", "remote", "remove", "origin"], stderr=subprocess.DEVNULL)

    # 2. git add .
    print("Agregando archivos...")
    run_command(["git", "add", "."])

    # 3. git commit
    print("Realizando commit inicial...")
    run_command(["git", "commit", "-m", "feat: complete MVP Aditor AI"])

    # 4. git branch
    print("Renombrando rama a main...")
    run_command(["git", "branch", "-M", "main"])

    # 5. Push directo con URL autenticada
    print("Realizando push a GitHub...")
    # git push <url> <branch>
    success = run_command(["git", "push", "-u", AUTH_REPO_URL, "main"])
    
    if success:
        print("¡Despliegue exitoso!")
        # 6. Configurar remote origin público (sin token) para uso futuro
        print("Configurando remote origin público...")
        run_command(["git", "remote", "add", "origin", REPO_URL])
        # Actualizar upstream
        run_command(["git", "fetch", "origin"])
        run_command(["git", "branch", "--set-upstream-to=origin/main", "main"])
    else:
        print("Fallo el despliegue.")
        sys.exit(1)

if __name__ == "__main__":
    main()

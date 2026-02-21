import os
import subprocess
import sys

FACEBOOK_APP_ID = "1559690031775292"
FACEBOOK_APP_SECRET = "44cc956be14c89598b38011026d466dd"
ENV_FILE = ".env.local"
DEPLOY_ENV_FILE = ".env.deploy"

def update_env():
    lines = []
    if os.path.exists(ENV_FILE):
        with open(ENV_FILE, "r") as f:
            lines = f.readlines()
    
    # Clean old ones if they exist (we append the new ones at the end)
    new_lines = []
    for line in lines:
        if not line.startswith("NEXT_PUBLIC_FACEBOOK_APP_ID=") and not line.startswith("FACEBOOK_APP_SECRET="):
            new_lines.append(line)
            
    # Ensure there's a trailing newline before appending
    if new_lines and not new_lines[-1].endswith("\n"):
        new_lines[-1] += "\n"
        
    new_lines.append(f"NEXT_PUBLIC_FACEBOOK_APP_ID={FACEBOOK_APP_ID}\n")
    new_lines.append(f"FACEBOOK_APP_SECRET={FACEBOOK_APP_SECRET}\n")
    
    with open(ENV_FILE, "w") as f:
        f.writelines(new_lines)
    print(f"Variables actualizadas exitosamente en {ENV_FILE}")

def run_git():
    try:
        # Add changes
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            # Commit changes
            subprocess.run(["git", "commit", "-m", "chore: update facebook app credentials in env vars"], check=True)
            print("Ejecutando git push...")
            
            # Setup auth URL if needed
            env_deploy = {}
            if os.path.exists(DEPLOY_ENV_FILE):
                with open(DEPLOY_ENV_FILE, "r") as f:
                    for line in f:
                        if '=' in line:
                            k, v = line.strip().split('=', 1)
                            env_deploy[k] = v
            
            token = env_deploy.get("GITHUB_TOKEN")
            user = env_deploy.get("GITHUB_USER")
            
            # Use authenticated URL if token is available
            if token and user:
                # Need to use the full repo URL and mask token in logs
                url = f"https://{user}:{token}@github.com/{user}/aditor-ai.git"
                # Hide output from stdout to prevent token leak
                result = subprocess.run(["git", "push", url, "main"], capture_output=True, text=True)
                if result.returncode == 0:
                    print("Git push exitoso.")
                else:
                    print(f"Error en git push (autenticado): {result.stderr}")
                    sys.exit(1)
            else:
                # Try default if no deploy env found
                result = subprocess.run(["git", "push"], capture_output=True, text=True)
                if result.returncode == 0:
                    print("Git push exitoso con credenciales default.")
                else:
                    print(f"Error: Falló el git push y no hay TOKEN en {DEPLOY_ENV_FILE}. Error original: {result.stderr}")
                    sys.exit(1)
        else:
            print("No hay cambios para commitear.")
    except subprocess.CalledProcessError as e:
        print(f"Error ejecutando git: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("Iniciando script update_facebook_env.py...")
    update_env()
    run_git()

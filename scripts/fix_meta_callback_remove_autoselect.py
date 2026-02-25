import os
import subprocess

def fix_remove_autoselect():
    file_path = "src/app/api/meta/callback/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    # To be extremely safe, we will locate the old block using string indices since there are varying spacings
    start_marker = "        // Mejor obtenemos las cuentas y guardamos la primera"
    end_marker = "        // 6. Redirigir a Selección de Cuentas si se autentico y guardo todo bien."

    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)

    if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
        # We also need to remove the previous comments asking to do it:
        #         // (Opcional, pero util: si el req decia "selected_ad_account_id", tal vez tambien debemos 
        #         // traer adAccounts y guardar el primero para cumplirlo a raja tabla o simplemente delegar a /conectar/cuentas)
        #         // Revisemos el request: "Guardar el token en Supabase tabla profiles del usuario actual (selected_ad_account_id y un nuevo campo meta_access_token)"
        
        comments_marker = "        // (Opcional, pero util: si el req decia"
        comm_idx = content.find(comments_marker)
        
        if comm_idx != -1 and comm_idx < start_idx:
            start_idx = comm_idx

        content = content[:start_idx] + content[end_idx:]
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        print("Updated route.ts successfully. Removed auto-select block.")
    else:
        print("Warning: Autoselect block markers not found. File may already be clean.")


def main():
    fix_remove_autoselect()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/app/api/meta/callback/route.ts"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: remove auto-selection assignment of first ad account in Meta OAuth callback to allow manual user choice"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

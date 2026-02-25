import os
import subprocess

def fix_auth_required_route():
    file_path = "src/app/conectar/cuentas/page.tsx"
    print(f"Modifying {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Replace legacy sign-in with login
    if "redirect('/sign-in?redirect_url=/conectar');" in content:
        content = content.replace(
            "redirect('/sign-in?redirect_url=/conectar');", 
            "redirect('/login?redirect=/conectar');"
        )

    # We need to replace the entire Supabase fetch block
    old_fetch_block = """    // Obtenemos el token del usuario para llamar a Meta
    const { data: account, error } = await supabaseAdmin
        .from('connected_accounts')
        .select('access_token')
        .eq('user_id', userId)
        .single();

    if (error || !account?.access_token) {
        redirect('/conectar?error=auth_required');
    }"""
    
    new_fetch_block = """    // Obtenemos el token del usuario para llamar a Meta
    const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select('meta_access_token')
        .eq('clerk_user_id', userId)
        .single();

    if (error || !profile?.meta_access_token) {
        console.error("DEBUG - Fallo en obtención de token en Supabase:", { error, clerkUserId: userId, profile });
        redirect('/conectar?error=token_exchange_failed');
    }"""

    if old_fetch_block in content:
        content = content.replace(old_fetch_block, new_fetch_block)
        
        # Now we also need to fix the line where it uses the token
        # adAccounts = await getAdAccounts(account.access_token);
        if "account.access_token" in content:
            content = content.replace("account.access_token", "profile.meta_access_token")

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully updated the token fetch logic in cuentas/page.tsx.")
    else:
        print("Warning: EXACT old_fetch_block block not found. Checking if already applied...")
        if "token_exchange_failed" in content:
            print("The update has been already applied.")
        else:
            print("Failed to replace. Old block mismatch.")

def main():
    fix_auth_required_route()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/app/conectar/cuentas/page.tsx"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: align /conectar/cuentas token retrieval with profiles table to remove auth_required bug"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

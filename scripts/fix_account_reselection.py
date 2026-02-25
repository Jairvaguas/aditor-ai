import os
import subprocess

def fix_backend_api():
    file_path = "src/app/api/auth/select-account/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    old_global_check = """        // 0.5. Check Global Uniqueness - Is this account claimed by someone else?
        const { data: globalCheck, error: globalCheckError } = await supabaseAdmin
            .from('profiles')
            .select('clerk_user_id')
            .eq('selected_ad_account_id', adAccountId)
            .neq('clerk_user_id', clerkUserId)
            .limit(1);

        if (globalCheck && globalCheck.length > 0) {
            console.warn(`Account ${adAccountId} is already claimed by ${globalCheck[0].clerk_user_id}`);
            return NextResponse.json({ error: 'account_already_in_use' }, { status: 403 });
        }"""

    new_global_check = """        // 0.5. Check Global Uniqueness - Is this account claimed by someone else?
        const { data: globalCheck, error: globalCheckError } = await supabaseAdmin
            .from('profiles')
            .select('clerk_user_id')
            .eq('selected_ad_account_id', adAccountId)
            .neq('clerk_user_id', clerkUserId)
            .limit(1);

        if (globalCheckError) {
            console.error('DEBUG - Error de BD en verificación de unicidad global:', globalCheckError);
            return NextResponse.json({ error: 'Database check failed' }, { status: 500 });
        }

        if (globalCheck && globalCheck.length > 0) {
            console.warn(`DEBUG - Bloqueo por Conflicto de Usuario (Fraude): Account ${adAccountId} ya pertenece a ${globalCheck[0].clerk_user_id}. Intento por ${clerkUserId}`);
            return NextResponse.json({ error: 'account_already_in_use' }, { status: 403 });
        }
        
        // Re-vinculación/Éxito: Si todo está en orden y ya le pertenece a este mismo usuario, se permite continuar sin generar error."""

    if old_global_check in content:
        content = content.replace(old_global_check, new_global_check)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated route.ts successfully with refined global uniqueness checks.")
    else:
        print("Warning: EXACT old_global_check block not found. Checking if file was already modified.")

def main():
    fix_backend_api()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/app/api/auth/select-account/route.ts"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: clarify global uniqueness DB errors vs fraud conflicts and allow re-selection"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

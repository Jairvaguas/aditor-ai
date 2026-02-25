import os
import subprocess

def fix_api_moneda():
    file_path = "src/app/api/auth/select-account/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    # Update payload extraction fallback
    old_extraction = "        const { adAccountId, currency = 'USD' } = body;"
    new_extraction = "        const { adAccountId, currency = 'COP' } = body;"
    if old_extraction in content:
        content = content.replace(old_extraction, new_extraction)

    old_upsert_block = """        // 1. Save selected account to profiles via UPSERT for safety and log thoroughly
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                clerk_user_id: clerkUserId, 
                selected_ad_account_id: adAccountId,
                meta_access_token: currentProfile.meta_access_token,
                email: 'pending@aditor-ai.com',
                nombre: 'Usuario Meta'
            }, { onConflict: 'clerk_user_id' });

        if (profileError) {
            console.error(`DEBUG - Error de Persistencia: ${profileError.message} - Código: ${profileError.code}`);"""

    new_upsert_block = """        // 1. Save selected account to profiles via UPSERT for safety and log thoroughly
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                clerk_user_id: clerkUserId, 
                selected_ad_account_id: adAccountId,
                meta_access_token: currentProfile.meta_access_token,
                email: 'pending@aditor-ai.com',
                nombre: 'Usuario Meta',
                moneda: currency || 'COP'
            }, { onConflict: 'clerk_user_id' });

        if (profileError) {
            console.error(`DEBUG - Error de Persistencia: ${profileError.message} - Código: ${profileError.code}`);
            console.error(`JSON Completo del Error de BD:`, JSON.stringify(profileError));"""

    if old_upsert_block in content:
        content = content.replace(old_upsert_block, new_upsert_block)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated route.ts successfully with moneda assignment and JSON logging.")
    else:
        print("Warning: EXACT old_upsert_block block not found. Checking if file was already modified.")

def main():
    fix_api_moneda()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/app/api/auth/select-account/route.ts"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: append moneda field to select-account upsert and expose full json db error for precise constraint debugging"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

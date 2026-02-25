import os
import subprocess

def modify_callback():
    file_path = "src/app/api/meta/callback/route.ts"
    print(f"Modifying {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Targeting the update block
    old_block = """        console.log("DEBUG - Intentando guardar token para clerkUserId:", clerkUserId);
        const { data: updatedRecords, error: dbError } = await supabaseAdmin
            .from('profiles')
            .update({
                meta_access_token: accessToken,
            })
            .eq('clerk_user_id', clerkUserId)
            .select();
            
        if (!dbError && (!updatedRecords || updatedRecords.length === 0)) {
            console.error("CRITICAL DB ERROR: Se intentó guardar el token pero el perfil con clerk_user_id no existe en la tabla profiles.");
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_profile_not_found`);
        }"""
        
    old_block_alt = """        // 3. Guardar Token en Supabase (tabla profiles)
        console.log("DEBUG - Intentando guardar token para clerkUserId:", clerkUserId);
        const { data: updatedRecords, error: dbError } = await supabaseAdmin
            .from('profiles')
            .update({
                meta_access_token: accessToken,
            })
            .eq('clerk_user_id', clerkUserId)
            .select();
            
        if (!dbError && (!updatedRecords || updatedRecords.length === 0)) {
            console.error("CRITICAL DB ERROR: Se intentó guardar el token pero el perfil con clerk_user_id no existe en la tabla profiles.");
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_profile_not_found`);
        }"""

    new_block = """        // 3. Guardar Token en Supabase (tabla profiles)
        console.log("DEBUG - Intentando UPSERT de token para clerkUserId:", clerkUserId);
        const { data: updatedRecords, error: dbError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                clerk_user_id: clerkUserId, 
                meta_access_token: accessToken 
            }, { onConflict: 'clerk_user_id' })
            .select();
            
        if (!dbError && (!updatedRecords || updatedRecords.length === 0)) {
            console.error("CRITICAL DB ERROR: El UPSERT falló silenciosamente devolviendo cero filas para clerk_user_id:", clerkUserId);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_upsert_failed`);
        }"""

    handled = False
    
    if old_block_alt in content:
        content = content.replace(old_block_alt, new_block)
        handled = True
    elif old_block in content:
        content = content.replace(old_block, new_block)
        handled = True

    # Also apply the same upsert logic to the selected account storage later on just in case
    old_account_block = """            await supabaseAdmin
                .from('profiles')
                .update({ selected_ad_account_id: selectedAccount.account_id })
                .eq('clerk_user_id', clerkUserId);"""
                
    new_account_block = """            await supabaseAdmin
                .from('profiles')
                .upsert({ 
                    clerk_user_id: clerkUserId, 
                    selected_ad_account_id: selectedAccount.account_id 
                }, { onConflict: 'clerk_user_id' });"""
                
    if old_account_block in content:
        content = content.replace(old_account_block, new_account_block)

    if handled:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully updated update to upsert in Supabase logic.")
    else:
        print("Warning: Exact DB blocks not found, might have been modified already!")

def main():
    modify_callback()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/app/api/meta/callback/route.ts"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: convert profile update to upsert to prevent not_found db error on callback"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

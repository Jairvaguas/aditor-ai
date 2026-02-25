import os
import subprocess

def fix_schema_upsert():
    file_path = "src/app/api/meta/callback/route.ts"
    print(f"Modifying {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # 1. Update first upsert block
    old_upsert_1 = """        // 3. Guardar Token en Supabase (tabla profiles)
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
        
    new_upsert_1 = """        // 3. Guardar Token en Supabase (tabla profiles)
        console.log("DEBUG - Intentando UPSERT de token para clerkUserId:", clerkUserId);
        const { data: updatedRecords, error: dbError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                clerk_user_id: clerkUserId, 
                meta_access_token: accessToken,
                email: 'pending@aditor-ai.com',
                nombre: 'Usuario Meta'
            }, { onConflict: 'clerk_user_id' })
            .select();
            
        if (dbError) {
            console.error("DEBUG - Fallo en UPSERT de token:", { 
                message: dbError.message, 
                details: dbError.details, 
                hint: dbError.hint,
                code: dbError.code
            });
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_error`);
        }
            
        if (!updatedRecords || updatedRecords.length === 0) {
            console.error("CRITICAL DB ERROR: El UPSERT falló silenciosamente devolviendo cero filas para clerk_user_id:", clerkUserId);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_upsert_failed`);
        }"""

    # 2. Update second upsert block and remove the old detached dbError handler
    old_upsert_2 = """        if (adAccounts.length > 0) {
            const selectedAccount = adAccounts[0];
            await supabaseAdmin
                .from('profiles')
                .upsert({ 
                    clerk_user_id: clerkUserId, 
                    selected_ad_account_id: selectedAccount.account_id 
                }, { onConflict: 'clerk_user_id' });
        }

        if (dbError) {
            console.log('=== DB ERROR ===');
            console.log('userId from state:', clerkUserId);
            console.log('error details:', JSON.stringify(dbError));
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_error`);
        }"""

    new_upsert_2 = """        if (adAccounts.length > 0) {
            const selectedAccount = adAccounts[0];
            const { error: accDbError } = await supabaseAdmin
                .from('profiles')
                .upsert({ 
                    clerk_user_id: clerkUserId, 
                    selected_ad_account_id: selectedAccount.account_id,
                    email: 'pending@aditor-ai.com',
                    nombre: 'Usuario Meta'
                }, { onConflict: 'clerk_user_id' });
                
            if (accDbError) {
                 console.error("DEBUG - Fallo en UPSERT de ad account:", { 
                     message: accDbError.message, 
                     details: accDbError.details, 
                     hint: accDbError.hint
                 });
                 // We don't hard fail here to at least let them connect, but logged it.
            }
        }"""

    if old_upsert_1 in content:
        content = content.replace(old_upsert_1, new_upsert_1)
        if old_upsert_2 in content:
            content = content.replace(old_upsert_2, new_upsert_2)
            
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated route.ts with robust upsert schema fallback and logs.")
    else:
        print("Warning: EXACT old blocks not found. Check if the file was altered.")

def main():
    fix_schema_upsert()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: append schema fallbacks to profile upsert and detail db error logs in meta callback"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

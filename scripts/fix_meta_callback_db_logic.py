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

    # Let's replace the DB update block to add `.select()` and check if row was affected
    old_db_block = """        // 3. Guardar Token en Supabase (tabla profiles)
        const { error: dbError } = await supabaseAdmin
            .from('profiles')
            .update({
                meta_access_token: accessToken,
                // Si el usuario acaba de conectar, asumiremos que en algun punto
                // podria guardar selected_ad_account_id, pero el request pedía guardarlo
                // aqui si era posible o en el siguiente paso.
                // Como obtenemos selected_ad_account_id? 
                // Ah, el usuario pidio:
                // "Guardar el token en Supabase tabla profiles del usuario actual (selected_ad_account_id y un nuevo campo meta_access_token)"
            })
            .eq('clerk_user_id', clerkUserId);"""
            
    new_db_block = """        // 3. Guardar Token en Supabase (tabla profiles)
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

    if old_db_block in content:
        content = content.replace(old_db_block, new_db_block)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated DB log check successfully.")
    else:
        print("Warning: old db block not found!")


def main():
    modify_callback()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/app/api/meta/callback/route.ts"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: add strict select verification after meta token db update"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

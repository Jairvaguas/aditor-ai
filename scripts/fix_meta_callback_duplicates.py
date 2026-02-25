import os
import subprocess

def fix_callback_duplicates():
    file_path = "src/app/api/meta/callback/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except:
        return

    # Import clerkClient
    if "clerkClient" not in content:
        content = content.replace(
            "import { supabaseAdmin } from '@/lib/supabase';",
            "import { supabaseAdmin } from '@/lib/supabase';\nimport { clerkClient } from '@clerk/nextjs/server';"
        )

    old_upsert_start = """        // 3. Guardar Token en Supabase (tabla profiles)
        console.log("DEBUG - Intentando UPSERT de token para clerkUserId:", clerkUserId);"""

    cleanup_logic = """        // --- DUPLICATE PROFILE CLEANUP LOGIC ---
        let userEmail = 'pending@aditor-ai.com';
        let userName = 'Usuario Meta';
        try {
            const client = typeof clerkClient === 'function' ? await clerkClient() : clerkClient;
            const user = await client.users.getUser(clerkUserId);
            if (user && user.emailAddresses && user.emailAddresses.length > 0) {
                userEmail = user.emailAddresses[0].emailAddress;
            }
            if (user && (user.firstName || user.lastName)) {
                userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            }
            
            console.log(`DEBUG - Email real obtenido de Clerk: ${userEmail}`);
            
            if (userEmail !== 'pending@aditor-ai.com') {
                const { data: existingProfile } = await supabaseAdmin
                    .from('profiles')
                    .select('id, clerk_user_id')
                    .eq('email', userEmail)
                    .neq('clerk_user_id', clerkUserId)
                    .single();
                    
                if (existingProfile) {
                    console.log(`DEBUG - Resolviendo duplicado: Actualizando clerk_user_id de ${existingProfile.clerk_user_id} a ${clerkUserId} para el email ${userEmail}`);
                    await supabaseAdmin
                        .from('profiles')
                        .update({ clerk_user_id: clerkUserId })
                        .eq('id', existingProfile.id);
                }
            }
        } catch (e: any) {
            console.error("Warning: Could not fetch or cleanup user from Clerk:", e.message || e);
        }
        // ---------------------------------------

        // 3. Guardar Token en Supabase (tabla profiles)
        console.log("DEBUG - Intentando UPSERT de token para clerkUserId:", clerkUserId);"""

    if old_upsert_start in content:
        content = content.replace(old_upsert_start, cleanup_logic)
        
        # Replace static fallbacks with dynamic variables
        content = content.replace("email: 'pending@aditor-ai.com',", "email: userEmail,")
        content = content.replace("nombre: 'Usuario Meta'", "nombre: userName")
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated route.ts with duplicate cleanup and clerk dynamic data successfully.")
    else:
        print("Warning: old_upsert_start block not found.")


def main():
    fix_callback_duplicates()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: append automated duplicate profile cleanup in Meta callback using Clerk user email resolution before upserting"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

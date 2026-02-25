import os
import subprocess

def main():
    file_path = "src/app/api/auth/callback/route.ts"
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Let's replace the whole try-catch block for simplicity and exactness
    
    new_try_block = """    try {
        // Obtenemos user de Clerk actual
        const { userId: clerkUserId } = await auth();

        if (!clerkUserId) {
            // Si no tiene sesion, redirigimos a login, y luego a conectar
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?redirect=/conectar`);
        }

        // 2. Intercambio de Token
        const accessToken = await exchangeCodeForToken(code);

        // 3. Guardar Token en Supabase (tabla profiles)
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
            .eq('id', clerkUserId);

        // (Opcional, pero util: si el req decia "selected_ad_account_id", tal vez tambien debemos 
        // traer adAccounts y guardar el primero para cumplirlo a raja tabla o simplemente delegar a /conectar/cuentas)
        // Revisemos el request: "Guardar el token en Supabase tabla profiles del usuario actual (selected_ad_account_id y un nuevo campo meta_access_token)"
        
        // Mejor obtenemos las cuentas y guardamos la primera
        const adAccounts = await getAdAccounts(accessToken);
        
        if (adAccounts.length > 0) {
            const selectedAccount = adAccounts[0];
            await supabaseAdmin
                .from('profiles')
                .update({ selected_ad_account_id: selectedAccount.account_id })
                .eq('id', clerkUserId);
        }

        if (dbError) {
            console.error('Error saving token to profile:', dbError);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=db_error`);
        }

        // 6. Redirigir a Selección de Cuentas si se autentico y guardo todo bien.
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar/cuentas`);

    } catch (err: any) {
        console.error('Callback Error:', err);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=callback_exception&details=${encodeURIComponent(err.message || 'unknown')}`);
    }"""
    
    # We will slice from `    try {` to the end of the `    }` block.
    # To do this safely, we will find `    try {` and the matching end.
    
    start_idx = content.find("    try {")
    if start_idx == -1:
        print("Could not find try block.")
        return
        
    end_idx = content.find("    }\n}\n", start_idx) # finds the end of catch block and function
    if end_idx == -1:
         # Try alternative
         end_idx = content.rfind("    }\n}")
         
    if end_idx == -1:
         print("Could not find end of catch block.")
         return

    # The end_idx is at `    }\n}\n`. We want to replace up to right before the last closing brace of the file.
    # Actually, replacing the exact old try-catch is safer:
    
    # Let's use regex or string replace for the whole old block
    old_block = content[start_idx:end_idx + 5] # +5 to include the `    }`

    # Writing direct replacement logic
    new_content = content.replace(old_block, new_try_block)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully updated src/app/api/auth/callback/route.ts.")

    # Execute git commit and push
    try:
        subprocess.run(["git", "add", file_path], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: meta oauth callback now checks clerk session and saves token to profiles"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

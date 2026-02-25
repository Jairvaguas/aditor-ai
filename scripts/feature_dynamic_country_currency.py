import os
import subprocess

def implement_geolocation():
    file_path = "src/app/api/meta/callback/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    # Add geolocation logic and logs right before Upserting (after cleanup logic)
    marker = "        // 3. Guardar Token en Supabase (tabla profiles)"
    
    geo_logic = """        // --- DYNAMIC GEOLOCATION LOGIC ---
        const ipCountry = request.headers.get('x-vercel-ip-country');
        let pais = 'CO';
        let moneda = 'COP';

        if (ipCountry === 'MX') {
            pais = 'MX';
            moneda = 'MXN';
        } else if (ipCountry === 'ES') {
            pais = 'ES';
            moneda = 'EUR';
        }

        console.log(`DEBUG - Usuario detectado en: ${ipCountry || 'Desconocido/Local'} - Asignando pais: ${pais}, moneda: ${moneda}`);
        // ---------------------------------

        // 3. Guardar Token en Supabase (tabla profiles)"""

    if marker in content:
        content = content.replace(marker, geo_logic)
        
        # Now replace both upserts to inject pais and moneda
        upsert_1_old = """            .upsert({ 
                clerk_user_id: clerkUserId, 
                meta_access_token: accessToken,
                email: userEmail,
                nombre: userName
            }, { onConflict: 'clerk_user_id' })"""
            
        upsert_1_new = """            .upsert({ 
                clerk_user_id: clerkUserId, 
                meta_access_token: accessToken,
                email: userEmail,
                nombre: userName,
                pais: pais,
                moneda: moneda
            }, { onConflict: 'clerk_user_id' })"""
            
        upsert_2_old = """                .upsert({ 
                    clerk_user_id: clerkUserId, 
                    selected_ad_account_id: selectedAccount.account_id,
                    email: userEmail,
                    nombre: userName
                }, { onConflict: 'clerk_user_id' });"""
                
        upsert_2_new = """                .upsert({ 
                    clerk_user_id: clerkUserId, 
                    selected_ad_account_id: selectedAccount.account_id,
                    email: userEmail,
                    nombre: userName,
                    pais: pais,
                    moneda: moneda
                }, { onConflict: 'clerk_user_id' });"""

        if upsert_1_old in content:
            content = content.replace(upsert_1_old, upsert_1_new)
        
        if upsert_2_old in content:
            content = content.replace(upsert_2_old, upsert_2_new)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
            
        print("Updated route.ts successfully with IP Geolocation.")
    else:
        print("Warning: marker not found. Check if file was tampered.")

def main():
    implement_geolocation()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/app/api/meta/callback/route.ts"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "feat: implement dynamic geolocation (x-vercel-ip-country) to assign country and currency accurately in Meta callback upserts"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

import os
import subprocess

def fix_account_selector_frontend():
    file_path = "src/components/AccountSelector.tsx"
    print(f"Modifying {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Add currency to the body payload
    old_fetch = "body: JSON.stringify({ adAccountId: accountId })"
    new_fetch = """const acc = accounts.find(a => a.account_id === accountId);
            const currency = acc?.currency || 'USD';
            const bodyPayload = JSON.stringify({ adAccountId: accountId, currency });
            
            const res = await fetch('/api/auth/select-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: bodyPayload
            });"""
            
    old_fetch_block = """            const res = await fetch('/api/auth/select-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adAccountId: accountId })
            });"""

    if old_fetch_block in content:
        content = content.replace(old_fetch_block, new_fetch)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated AccountSelector.tsx successfully.")
    else:
        print("Warning: old_fetch_block block not found in AccountSelector.")

def fix_select_account_api():
    file_path = "src/app/api/auth/select-account/route.ts"
    print(f"Modifying {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    old_logic = """        const body = await request.json();
        const { adAccountId } = body;

        if (!adAccountId) {
            return NextResponse.json({ error: 'Missing adAccountId' }, { status: 400 });
        }

        // 1. Save selected account to profiles
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ selected_ad_account_id: adAccountId })
            .eq('clerk_user_id', clerkUserId);

        if (profileError) {
            console.error('Error updating selected ad account:', profileError);
            return NextResponse.json({ error: 'Database error storing selection' }, { status: 500 });
        }

        // 2. We need the access token for this user to fetch campaigns
        const { data: connectedAccount, error: accountError } = await supabaseAdmin
            .from('connected_accounts')
            .select('access_token, currency')
            .eq('user_id', clerkUserId)
            .single(); // we assume they have a token

        if (accountError || !connectedAccount) {
            console.error('Error fetching connected account:', accountError);
            return NextResponse.json({ error: 'Token not found for user' }, { status: 500 });
        }

        const { access_token: accessToken, currency } = connectedAccount;"""

    new_logic = """        const body = await request.json();
        const { adAccountId, currency = 'USD' } = body;

        if (!adAccountId) {
            return NextResponse.json({ error: 'Missing adAccountId' }, { status: 400 });
        }

        // 1. Save selected account to profiles via UPSERT for safety and log thoroughly
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                clerk_user_id: clerkUserId, 
                selected_ad_account_id: adAccountId,
                email: 'pending@aditor-ai.com',
                nombre: 'Usuario Meta'
            }, { onConflict: 'clerk_user_id' });

        if (profileError) {
            console.error('DEBUG - Fallo al guardar cuenta seleccionada:', profileError);
            return NextResponse.json({ error: 'Database error storing selection' }, { status: 500 });
        }

        // 2. Extract token from profiles (legacy code queried connected_accounts)
        const { data: profileData, error: tokenError } = await supabaseAdmin
            .from('profiles')
            .select('meta_access_token')
            .eq('clerk_user_id', clerkUserId)
            .single();

        if (tokenError || !profileData || !profileData.meta_access_token) {
            console.error('Error fetching meta token from profiles:', tokenError);
            return NextResponse.json({ error: 'Token not found for user' }, { status: 500 });
        }

        const accessToken = profileData.meta_access_token;"""

    if old_logic in content:
        content = content.replace(old_logic, new_logic)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated select-account/route.ts successfully.")
    else:
        print("Warning: EXACT old_logic block not found. Checking if already applied...")

def main():
    fix_account_selector_frontend()
    fix_select_account_api()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: align select-account API with profiles table, apply schema upsert, and forward currency from frontend selector"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

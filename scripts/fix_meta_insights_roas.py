import os
import subprocess

def fix_meta_auth():
    file_path = "src/lib/meta-auth.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    old_fields = """        'actions',
        'action_values',
        'roas', // derived often, but let's see if api provides 'purchase_roas'
        'objective',"""
        
    new_fields = """        'actions',
        'action_values',
        'purchase_roas',
        'objective',"""

    if old_fields in content:
        content = content.replace(old_fields, new_fields)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated meta-auth.ts successfully by substituting roas for purchase_roas.")
    else:
        print("Warning: EXACT old_fields block not found. Checking if already applied...")

def fix_select_api():
    file_path = "src/app/api/auth/select-account/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        return

    old_fetch = """        // 3. Fetch campaigns for the selected account
        const campaigns = await getCampaignInsights(accessToken, adAccountId);

        if (!campaigns || campaigns.length === 0) {"""
        
    new_fetch = """        // 3. Fetch campaigns for the selected account safely
        let campaigns;
        try {
            campaigns = await getCampaignInsights(accessToken, adAccountId);
        } catch (metaErr: any) {
            console.error('DEBUG - Meta API Error fetching insights:', metaErr.message);
            return NextResponse.json({ error: 'meta_api_error', details: metaErr.message }, { status: 502 });
        }

        if (!campaigns || campaigns.length === 0) {"""

    if old_fetch in content:
        content = content.replace(old_fetch, new_fetch)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated select-account API successfully with meta try/catch.")
        
def fix_frontend_selector():
    file_path = "src/components/AccountSelector.tsx"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except:
        return

    old_catch = """                } else if (data.error === 'already_locked') {
                    router.push('/conectar?error=account_locked');
                } else {
                    router.push('/conectar?error=selection_failed');
                }"""
                
    new_catch = """                } else if (data.error === 'already_locked') {
                    router.push('/conectar?error=account_locked');
                } else if (data.error === 'meta_api_error') {
                    router.push('/conectar?error=meta_api_error');
                } else {
                    router.push('/conectar?error=selection_failed');
                }"""

    if old_catch in content:
        content = content.replace(old_catch, new_catch)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated AccountSelector.tsx successfully with meta_api_error handling.")

def main():
    fix_meta_auth()
    fix_select_api()
    fix_frontend_selector()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: replace invalid 'roas' field with 'purchase_roas' in Meta API insights query and catch external API faults securely"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

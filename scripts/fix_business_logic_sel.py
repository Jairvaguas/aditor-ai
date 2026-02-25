import os
import subprocess

def fix_backend_api():
    file_path = "src/app/api/auth/select-account/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except:
        return

    old_logic = """        // 1. Save selected account to profiles via UPSERT for safety and log thoroughly
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
            .single();"""

    new_logic = """        // 0. Extract current profile to check lock status (Limit = 1)
        const { data: currentProfile, error: profileFetchError } = await supabaseAdmin
            .from('profiles')
            .select('meta_access_token, selected_ad_account_id, ad_accounts_count')
            .eq('clerk_user_id', clerkUserId)
            .single();

        if (profileFetchError || !currentProfile) {
            console.error('Error fetching profile for lock check:', profileFetchError);
            return NextResponse.json({ error: 'Profile not found' }, { status: 500 });
        }

        const currentLockedAccount = currentProfile.selected_ad_account_id;
        const limitCount = currentProfile.ad_accounts_count || 1;

        // If limit is 1 and already locked to a different account, block it.
        if (limitCount <= 1 && currentLockedAccount && currentLockedAccount !== adAccountId) {
            console.warn(`User ${clerkUserId} attempted to change locked account. Rejected.`);
            return NextResponse.json({ error: 'already_locked' }, { status: 403 });
        }

        // 0.5. Check Global Uniqueness - Is this account claimed by someone else?
        const { data: globalCheck, error: globalCheckError } = await supabaseAdmin
            .from('profiles')
            .select('clerk_user_id')
            .eq('selected_ad_account_id', adAccountId)
            .neq('clerk_user_id', clerkUserId)
            .limit(1);

        if (globalCheck && globalCheck.length > 0) {
            console.warn(`Account ${adAccountId} is already claimed by ${globalCheck[0].clerk_user_id}`);
            return NextResponse.json({ error: 'account_already_in_use' }, { status: 403 });
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

        // 2. We already extracted token in step 0, reuse it.
        const tokenError = null;
        const profileData = currentProfile;"""

    if old_logic in content:
        content = content.replace(old_logic, new_logic)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated route.ts successfully.")

def fix_frontend_server_page():
    file_path = "src/app/conectar/cuentas/page.tsx"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except:
        return

    old_query = ".select('meta_access_token')"
    if old_query in content:
         content = content.replace(old_query, ".select('meta_access_token, selected_ad_account_id')")
    
    old_account_selector_tag = "<AccountSelector accounts={adAccounts} />"
    if old_account_selector_tag in content:
        content = content.replace(
            old_account_selector_tag, 
            "<AccountSelector accounts={adAccounts} currentSelection={profile.selected_ad_account_id} />"
        )
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated cuentas/page.tsx successfully.")

def fix_frontend_client_component():
    file_path = "src/components/AccountSelector.tsx"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except:
        return

    # Update Props and useState
    old_def = "export default function AccountSelector({ accounts }: { accounts: AdAccount[] }) {"
    new_def = "export default function AccountSelector({ accounts, currentSelection }: { accounts: AdAccount[], currentSelection?: string | null }) {"
    content = content.replace(old_def, new_def)
    
    content = content.replace(
        "const [selectedAccount, setSelectedAccount] = useState<string | null>(null);",
        "const [selectedAccount, setSelectedAccount] = useState<string | null>(currentSelection || null);"
    )

    # Update Catch Errors
    old_err = """            } else {
                console.error("Error creating audit:", data.error);
                router.push('/conectar?error=selection_failed');
            }"""
    new_err = """            } else {
                console.error("Error creating audit:", data.error);
                if (data.error === 'account_already_in_use') {
                    router.push('/conectar?error=account_already_in_use');
                } else if (data.error === 'already_locked') {
                    router.push('/conectar?error=account_locked');
                } else {
                    router.push('/conectar?error=selection_failed');
                }
            }"""
    content = content.replace(old_err, new_err)

    # Update Button styling
    # disabled={isLoading} -> disabled={isLoading || (currentSelection != null && currentSelection !== acc.account_id)}
    old_disabled = "disabled={isLoading}"
    new_disabled = "disabled={isLoading || (!!currentSelection && currentSelection !== acc.account_id)}"
    content = content.replace(old_disabled, new_disabled)

    # Update Label inside button: <div className="text-sm text-gray-400">ID: {acc.account_id} • Moneda: {acc.currency}</div>
    old_label = "<div className=\"text-sm text-gray-400\">ID: {acc.account_id} • Moneda: {acc.currency}</div>"
    new_label = """<div className="text-sm text-gray-400">ID: {acc.account_id} • Moneda: {acc.currency}</div>
                        {currentSelection === acc.account_id && (
                            <div className="text-xs font-semibold text-[#00D4AA] mt-1 uppercase tracking-wide">
                                Cuenta Vinculada a tu Plan
                            </div>
                        )}"""
    content = content.replace(old_label, new_label)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated AccountSelector.tsx successfully.")

def main():
    fix_backend_api()
    fix_frontend_server_page()
    fix_frontend_client_component()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "feat: implement ad account uniqueness tracking, lock persistence to user plan, and visual disable indicators"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

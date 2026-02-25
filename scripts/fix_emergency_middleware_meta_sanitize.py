import os
import subprocess

def fix_meta_fields():
    file_path = "src/lib/meta-auth.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    old_fields_start = "    const fields = ["
    old_fields_end = "    ].join(',');"
    
    start_idx = content.find(old_fields_start)
    end_idx = content.find(old_fields_end)
    
    if start_idx != -1 and end_idx != -1:
        end_idx += len(old_fields_end)
        
        new_fields_block = """    const fields = [
        'campaign_name',
        'adset_name',
        'ad_name',
        'spend',
        'impressions',
        'clicks',
        'reach',
        'actions'
    ].join(',');"""
    
        content = content[:start_idx] + new_fields_block + content[end_idx:]
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated meta-auth.ts successfully with secure fields list.")
    else:
        print("Warning: old_fields block not strictly found in meta-auth.ts")

def fix_select_api_redirect():
    file_path = "src/app/api/auth/select-account/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except:
        return

    old_response = """        return NextResponse.json({
            success: true,
            auditId: auditResult.id
        });"""
        
    new_response = """        return NextResponse.json({
            success: true,
            auditId: auditResult.id,
            redirectUrl: `/teaser?auditId=${auditResult.id}`
        });"""

    if old_response in content:
        content = content.replace(old_response, new_response)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated select-account/route.ts successfully with explicit redirectUrl.")

def fix_frontend_router():
    file_path = "src/components/AccountSelector.tsx"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except:
        return

    old_router = """            if (data.success && data.auditId) {
                router.push(`/teaser?auditId=${data.auditId}`);
            }"""
            
    new_router = """            if (data.success && data.redirectUrl) {
                router.push(data.redirectUrl);
            }"""

    if old_router in content:
        content = content.replace(old_router, new_router)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated AccountSelector.tsx successfully to consume explicit redirectUrl.")


def main():
    # 1. First, rename proxy.ts back to middleware.ts
    try:
        if os.path.exists("src/proxy.ts"):
            print("Renaming src/proxy.ts back to src/middleware.ts...")
            subprocess.run(["git", "mv", "src/proxy.ts", "src/middleware.ts"], check=True)
    except Exception as e:
        print("Error renaming proxy.ts (might not exist):", e)

    # 2. Apply field sanitization and routing logical updates
    fix_meta_fields()
    fix_select_api_redirect()
    fix_frontend_router()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: revert proxy rename to middleware to restore Clerk auth loop, sanitize Meta fields, and dictate explicit frontend routing payload"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

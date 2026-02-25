import os
import subprocess
import re

def modify_frontend():
    file_path = "src/app/conectar/page.tsx"
    print(f"Modifying {file_path}...")
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add import for useAuth
    if "import { useAuth }" not in content:
        content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { useAuth } from "@clerk/nextjs";')

    # 2. Add useAuth hook inside component
    if "const { userId } = useAuth();" not in content:
        content = content.replace("export default function ConnectPage() {\n", "export default function ConnectPage() {\n  const { userId } = useAuth();\n")

    # 3. Modify the window.location.href string
    old_link = 'window.location.href = "https://www.facebook.com/dialog/oauth?client_id=1559690031775292&redirect_uri=https://www.aditor-ai.com/api/auth/callback&scope=ads_read&response_type=code";'
    new_link = 'window.location.href = `https://www.facebook.com/dialog/oauth?client_id=1559690031775292&redirect_uri=https://www.aditor-ai.com/api/auth/callback&scope=ads_read&response_type=code&state=${userId}`;'
    
    if old_link in content:
        content = content.replace(old_link, new_link)
    else:
        print("Warning: Expected window.location.href not found exactly as expected in page.tsx.")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)


def modify_backend():
    file_path = "src/app/api/auth/callback/route.ts"
    print(f"Modifying {file_path}...")

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # We need to replace `const { userId: clerkUserId } = await auth();` 
    # with reading from `state`: `const clerkUserId = state;` or just using `state` directly.

    old_auth_line = "const { userId: clerkUserId } = await auth();"
    new_auth_line = "const clerkUserId = state; // We receive Clerk userId from Meta 'state' param"

    if old_auth_line in content:
        content = content.replace(old_auth_line, new_auth_line)
    else:
        print("Warning: Expected auth() call not found exactly as expected in route.ts.")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

def main():
    try:
        modify_frontend()
        modify_backend()
    except Exception as e:
        print(f"Error reading/writing files: {e}")
        return

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/app/conectar/page.tsx", "src/app/api/auth/callback/route.ts"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: pass clerk userId through Meta oauth state param"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

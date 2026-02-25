import os
import subprocess

def modify_meta_auth():
    file_path = "src/lib/meta-auth.ts"
    print(f"Modifying {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Targeting the exchangeCodeForToken block
    old_block_part1 = """    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/meta/callback`,
        code,
    });"""

    old_block_part1_alt = """    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        code,
    });"""

    new_block = """    console.log("Variables check:", { appId: !!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID, secret: !!process.env.FACEBOOK_APP_SECRET });

    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: `https://www.aditor-ai.com/api/meta/callback`,
        code,
    });"""

    handled = False
    
    if old_block_part1 in content:
        content = content.replace(old_block_part1, new_block)
        handled = True
    elif old_block_part1_alt in content:
        content = content.replace(old_block_part1_alt, new_block)
        handled = True

    if handled:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated meta-auth.ts successfully.")
    else:
        print("Warning: Could not find exact match for the params block. Check the source for any deviations.")

def main():
    modify_meta_auth()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/lib/meta-auth.ts"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: hardcode meta redirect_uri and add conditional env logging map"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

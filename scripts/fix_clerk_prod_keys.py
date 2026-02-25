import os
import subprocess

def modify_env():
    file_path = ".env.local"
    if not os.path.exists(file_path):
        return

    print(f"Modifying {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The user wants to fix NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL to NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
    # (Next.js v5 standard for Clerk)
    
    replacements = {
        "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL": "NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL",
        "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL": "NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL",
    }
    
    for old, new in replacements.items():
        if old in content:
            content = content.replace(old, new)
            
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
def modify_login_pages():
    login_path = "src/app/login/[[...rest]]/page.tsx"
    reg_path = "src/app/registro/[[...rest]]/page.tsx"

    # In Clerk V5, `<SignIn>` uses fallbackRedirectUrl or forceRedirectUrl.
    # User said: "Cambiar afterSignInUrl='/dashboard' por fallbackRedirectUrl='/dashboard'"
    
    for path in [login_path, reg_path]:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
            # Replacing `forceRedirectUrl` with `fallbackRedirectUrl` if force was used
            if "forceRedirectUrl" in content:
                content = content.replace("forceRedirectUrl", "fallbackRedirectUrl")
                
            # Also replacing `signInUrl` to `fallbackRedirectUrl` if they had any leftover `afterSignInUrl` but we didn't see any in the files.
            
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)

def main():
    modify_env()
    modify_login_pages()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: deprecation of afterSignInUrl to fallbackRedirectUrl and update env logic"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

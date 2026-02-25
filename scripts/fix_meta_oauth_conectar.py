import os
import subprocess

def main():
    file_path = "src/app/conectar/page.tsx"
    
    # Read the file
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Replace the /api/auth/facebook link with the Meta direct oauth link
    old_link = '"/api/auth/facebook"'
    new_link = '"https://www.facebook.com/dialog/oauth?client_id=1559690031775292&redirect_uri=https://www.aditor-ai.com/api/auth/callback&scope=ads_read&response_type=code"'
    
    if old_link in content:
        content = content.replace(old_link, new_link)
        
        # Write back out
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully updated src/app/conectar/page.tsx with the direct Meta OAuth link.")
    else:
        print("The old link was not found. Perhaps it was already updated?")
        if new_link in content:
            print("The new link is already present in the file.")

    # Execute git commit and push
    try:
        subprocess.run(["git", "add", file_path], check=True)
        # Check if there are changes to commit
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: redirect directly to Meta OAuth in /conectar"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

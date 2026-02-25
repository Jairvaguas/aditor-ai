import os
import subprocess

def main():
    file_path = "src/lib/meta-auth.ts"
    print(f"Modifying {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Targeting the exact redirect_uri line
    old_line = "redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,"
    new_line = "redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/meta/callback`,"

    if old_line in content:
        content = content.replace(old_line, new_line)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully updated redirect_uri in exchangeCodeForToken.")
    else:
        print("Warning: Exact old_line not found. Checking if it's already updated...")
        if new_line in content:
             print("It is already completely updated.")
        else:
             print("Could not find line to update.")

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", file_path], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: align token exchange redirect_uri to /api/meta/callback"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

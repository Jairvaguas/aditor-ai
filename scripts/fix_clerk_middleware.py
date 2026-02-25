import os
import subprocess

def main():
    file_path = "src/middleware.ts"
    print(f"Modifying {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Looking to add '/api/auth/callback(.*)' to the createRouteMatcher array
    # Let's find '/api/meta/callback(.*)' and put it right after.
    
    target_string = "  '/api/meta/callback(.*)',"
    new_string = "  '/api/auth/callback(.*)',\n  '/api/meta/callback(.*)',"

    if "'/api/auth/callback(.*)'" not in content:
        if target_string in content:
            content = content.replace(target_string, new_string)
        else:
            # Fallback if target string is not exactly matching
            content = content.replace("'/api/admin(.*)',\n", "'/api/auth/callback(.*)',\n  '/api/admin(.*)',\n")
            
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully added /api/auth/callback(.*) to middleware public routes.")
    else:
        print("Route is already public.")

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", file_path], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: make meta oauth callback route public in clerk middleware"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

import os
import shutil
import subprocess

def move_directory():
    old_dir = "src/app/api/auth/callback"
    new_dir = "src/app/api/meta/callback"

    # ensure src/app/api/meta exists
    if not os.path.exists("src/app/api/meta"):
        os.makedirs("src/app/api/meta")

    if os.path.exists(old_dir):
        # We can use git mv to preserve history if possible
        try:
            subprocess.run(["git", "mv", old_dir, new_dir], check=True)
            print(f"Moved {old_dir} to {new_dir} using git mv.")
        except subprocess.CalledProcessError:
            print("git mv failed, falling back to shutil.move")
            if os.path.exists(new_dir):
                shutil.rmtree(new_dir)
            shutil.move(old_dir, new_dir)
            print(f"Moved {old_dir} to {new_dir} using shutil.")
    elif os.path.exists(new_dir):
        print(f"Directory {new_dir} already exists. Probably already moved.")
    else:
        print(f"Directory {old_dir} not found.")

def update_frontend():
    file_path = "src/app/conectar/page.tsx"
    print(f"Modifying {file_path} for redirect_uri...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The user asked: En src/app/conectar/page.tsx actualizar el redirect_uri en la URL de OAuth:
    # redirect_uri=https://www.aditor-ai.com/api/meta/callback
    
    old_str = "redirect_uri=https://www.aditor-ai.com/api/auth/callback"
    new_str = "redirect_uri=https://www.aditor-ai.com/api/meta/callback"

    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated frontend redirect_uri.")
    elif new_str in content:
        print("Frontend redirect_uri already updated.")
    else:
        print("Warning: Could not find exactly old_str in page.tsx")


def update_middleware():
    file_path = "src/middleware.ts"
    print(f"Modifying {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove '/api/auth/callback(.*)'
    old_str = "  '/api/auth/callback(.*)',\n"
    if old_str in content:
        content = content.replace(old_str, "")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Removed /api/auth/callback from middleware.")
    else:
        print("'/api/auth/callback(.*)' not found in middleware.ts.")

def main():
    move_directory()
    update_frontend()
    update_middleware()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: rename meta oauth callback to avoid clerk collision"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

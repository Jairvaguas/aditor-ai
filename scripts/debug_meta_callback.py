import os
import subprocess

def main():
    file_path = "src/app/api/auth/callback/route.ts"
    print(f"Modifying {file_path} to add logs...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Add logs right after 'const error = searchParams.get('error');'
    old_target = "    const error = searchParams.get('error');"
    new_logs = """    const error = searchParams.get('error');

    console.log('=== META CALLBACK ===');
    console.log('code:', searchParams.get('code'));
    console.log('state:', searchParams.get('state'));
    console.log('error:', searchParams.get('error'));"""

    if old_target in content and "console.log('=== META CALLBACK ===');" not in content:
        content = content.replace(old_target, new_logs)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Successfully added logs to callback route.")
    else:
        print("Logs are already present or target line not found.")

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", file_path], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "chore: add debug logs to meta callback"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

import os
import subprocess

def main():
    file_path = "src/app/api/auth/callback/route.ts"
    print(f"Modifying {file_path} to fix Supabase queries and add DB Error logs...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    # Fix 1: Change column `id` to `clerk_user_id` in `.eq('id', clerkUserId)`
    # It appears 2 times in the code block.
    content = content.replace(".eq('id', clerkUserId);", ".eq('clerk_user_id', clerkUserId);")

    # Fix 2: Enhance DB error logs
    old_log = "            console.error('Error saving token to profile:', dbError);"
    new_log = """            console.log('=== DB ERROR ===');
            console.log('userId from state:', clerkUserId);
            console.log('error details:', JSON.stringify(dbError));"""

    if old_log in content:
        content = content.replace(old_log, new_log)
    else:
        print("Warning: Could not find the old dbError console.error line.")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {file_path} successfully.")

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", file_path], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: use clerk_user_id in profiles update and add db error logs"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

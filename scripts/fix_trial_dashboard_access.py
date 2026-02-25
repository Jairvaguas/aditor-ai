import os
import subprocess

def fix_subscription_guard():
    file_path = "src/lib/checkSubscription.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    # Update the query to include 'plan'
    old_query = "            .select('is_subscribed, trial_ends_at')"
    new_query = "            .select('is_subscribed, trial_ends_at, plan')"
    
    if old_query in content:
        content = content.replace(old_query, new_query)
    
    # Introduce the explicit trial rule before the trial_ends_at logic
    old_logic = """        if (data.is_subscribed) {
            return true;
        }

        if (data.trial_ends_at) {"""
        
    new_logic = """        if (data.is_subscribed) {
            return true;
        }

        if (data.plan === 'trial') {
            return true;
        }

        if (data.trial_ends_at) {"""
        
    if old_logic in content:
        content = content.replace(old_logic, new_logic)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated checkSubscription.ts successfully to allow trial plans.")
    else:
        print("Warning: old logic block not strictly found in checkSubscription.ts, checking if already patched.")


def main():
    fix_subscription_guard()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: bypass subscription guard for accounts explicitly on 'trial' plan to allow dashboard access"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

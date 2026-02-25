import os
import subprocess

def modify_callback():
    file_path = "src/app/api/meta/callback/route.ts"
    print(f"Modifying {file_path}...")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"Error: {file_path} not found.")
        return

    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]

        # 1. Remove clerk auth import
        if "import { auth } from '@clerk/nextjs/server';" in line:
            i += 1
            continue
            
        # 2. Replace connection valiation logic
        # Look for the if (!code) block
        if "if (!code) {" in line:
            new_lines.append("    if (!code || !state) {\n")
            new_lines.append("        console.error('Missing params:', { code, state });\n")
            new_lines.append("        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/conectar?error=missing_params`);\n")
            new_lines.append("    }\n")
            
            # Skip the old block
            while "}" not in lines[i]:
                i += 1
            i += 1
            continue

        # 3. Handle the old '!clerkUserId' logic
        # It's inside a try/catch now and we just validated it globally above. Let's replace the block entirely.
        if "const clerkUserId = state;" in line:
            new_lines.append(line)
            i += 1
            
            # skip the "if (!clerkUserId) { ... }" block because we already threw out if state was missing
            if i < len(lines) and "if (!clerkUserId) {" in lines[i]:
                while "}" not in lines[i]:
                    i += 1
                i += 1
            continue
            
        new_lines.append(line)
        i += 1

    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("Successfully updated Meta Callback route.")

def main():
    modify_callback()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "src/app/api/meta/callback/route.ts"], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: enforce state param as universal user id in callback and add missing param logs"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

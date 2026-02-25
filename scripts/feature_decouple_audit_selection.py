import os
import subprocess

def fix_select_api():
    file_path = "src/app/api/auth/select-account/route.ts"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    # Delete everything inside from // 2. We already extracted token ... 
    # up to (and including) the existing return NextResponse.json
    
    start_marker = "        // 2. We already extracted token in step 0, reuse it."
    end_marker = "    } catch (error: any) {"
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
        new_success_response = """        // Éxito Total: La BD ya tiene vinculado el ID. Todo lo demás se delega al dashboard.
        return NextResponse.json({
            success: true,
            redirectUrl: '/dashboard'
        });

"""
        content = content[:start_idx] + new_success_response + content[end_idx:]
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated route.ts successfully. Removed Meta API and Anthropic dependencies from account selection.")
        
        # We also want to remove unused imports at the top
        old_imports = """import { getCampaignInsights } from '@/lib/meta-auth';
import { generateAudit } from '@/lib/audit';"""

        new_imports = """// imports purged for decoupling"""
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            if old_imports in content:
                content = content.replace(old_imports, "")
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(content)
        except Exception:
            pass
            
    else:
        print("Warning: EXACT block not found. Checking if file was already modified.")

def main():
    fix_select_api()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "refactor: decouple audit engine from ad account selection, routing directly to /dashboard post-upsert"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

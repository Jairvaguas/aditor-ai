import os
import subprocess

def main():
    file_path = "src/app/conectar/page.tsx"
    print(f"Modifying {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The existing block looks like:
    #             onClick={() => {
    #               console.log("FACEBOOK_APP_ID client side:", process.env.NEXT_PUBLIC_FACEBOOK_APP_ID);
    #               window.location.href = `https://www.facebook.com/dialog/oauth?client_id=1559690031775292&redirect_uri=https://www.aditor-ai.com/api/meta/callback&scope=ads_read&response_type=code&state=${userId}`;
    #             }}
    
    # We will replace it with the debug block
    old_onClick = """            onClick={() => {
              console.log("FACEBOOK_APP_ID client side:", process.env.NEXT_PUBLIC_FACEBOOK_APP_ID);
              window.location.href = `https://www.facebook.com/dialog/oauth?client_id=1559690031775292&redirect_uri=https://www.aditor-ai.com/api/meta/callback&scope=ads_read&response_type=code&state=${userId}`;
            }}"""

    new_onClick = """            onClick={() => {
              console.log("FACEBOOK_APP_ID client side:", process.env.NEXT_PUBLIC_FACEBOOK_APP_ID);
              const authState = userId || "test_fallback_id";
              const metaOAuthUrl = `https://www.facebook.com/dialog/oauth?client_id=1559690031775292&redirect_uri=https://www.aditor-ai.com/api/meta/callback&scope=ads_read&response_type=code&state=${authState}`;
              console.log('META OAUTH URL:', metaOAuthUrl);
              console.log('original userId:', userId);
              window.location.href = metaOAuthUrl;
            }}"""

    if old_onClick in content:
        content = content.replace(old_onClick, new_onClick)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated page.tsx with logs and fallback.")
    else:
        print("Warning: old onClick not found in page.tsx")


    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", file_path], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "chore: add debug logs to frontend meta oauth generator"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

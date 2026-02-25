import os
import subprocess

def main():
    print("Executing empty commit to force Vercel redeploy...")
    try:
        subprocess.run(["git", "commit", "--allow-empty", "-m", "force redeploy: update clerk env vars"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("Successfully pushed empty commit. Vercel should be building now.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

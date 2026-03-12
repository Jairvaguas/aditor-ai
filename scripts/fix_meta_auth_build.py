import os

def fix_meta_auth():
    filepath = "src/lib/meta-auth.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # We need to move `const spend = parseFloat(insight.spend || '0');` before `costPerFollower`
    target = """        const costPerFollower = spend > 0 && follows > 0 ? (spend / parseInt(follows)).toFixed(2) : null;


        const spend = parseFloat(insight.spend || '0');"""
        
    replacement = """        const spend = parseFloat(insight.spend || '0');
        const costPerFollower = spend > 0 && follows > 0 ? (spend / parseInt(follows)).toFixed(2) : null;"""

    if target in content:
        content = content.replace(target, replacement)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Fixed meta-auth.ts build error")
    else:
        print("Could not find target block in meta-auth.ts")

if __name__ == "__main__":
    fix_meta_auth()

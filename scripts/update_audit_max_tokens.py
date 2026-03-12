import os

def update_max_tokens():
    filepath = "src/lib/audit.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    target = "max_tokens: 4000,"
    replacement = "max_tokens: 6000,"

    if target in content:
        content = content.replace(target, replacement)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filepath} successfully. max_tokens increased to 6000.")
    else:
        print(f"Target '{target}' not found in {filepath}. Check if it was already updated.")

if __name__ == "__main__":
    update_max_tokens()

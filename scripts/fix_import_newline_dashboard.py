import os

FILE_PATH = "src/app/dashboard/page.tsx"

def fix_imports():
    if not os.path.exists(FILE_PATH):
        print(f"File not found: {FILE_PATH}")
        return

    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # The string \\n is literally in the file
    old_string = 'import LanguageSelector from "@/components/LanguageSelector";\\nimport AccountSwitcher from "@/components/AccountSwitcher";'
    new_string = 'import LanguageSelector from "@/components/LanguageSelector";\nimport AccountSwitcher from "@/components/AccountSwitcher";'

    if old_string in content:
        content = content.replace(old_string, new_string)
        with open(FILE_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully fixed imports in {FILE_PATH}")
    else:
        print("Target string not found, it may have been already fixed or formatted differently.")

if __name__ == "__main__":
    fix_imports()

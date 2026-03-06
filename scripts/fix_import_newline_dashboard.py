import os

FILE_PATH = "src/app/dashboard/page.tsx"

def fix_imports():
    if not os.path.exists(FILE_PATH):
        print(f"File not found: {FILE_PATH}")
        return

    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # The user says the error is exactly on line 22.
    # We will look for LanguageSelector in the line to be absolutely sure.
    for i, line in enumerate(lines):
        if 'import LanguageSelector from "@/components/LanguageSelector";' in line and '\\n' in line:
            parts = line.split('\\n')
            if len(parts) >= 2:
                lines[i] = parts[0] + '\n' + parts[1]
                print(f"Fixed line {i+1} by splitting and inserting real newline.")
                break
    else:
        # If not found that way, specifically force line 22 if it matches
        if len(lines) >= 22 and 'LanguageSelector' in lines[21]:
            lines[21] = 'import LanguageSelector from "@/components/LanguageSelector";\nimport AccountSwitcher from "@/components/AccountSwitcher";\n'
            print("Forced replacement on line 22.")

    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.writelines(lines)

if __name__ == "__main__":
    fix_imports()

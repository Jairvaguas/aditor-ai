import os
import re

def update_layout(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False

    # 1. Imports
    if "import { Syne," in content:
        content = content.replace("import { Syne,", "import { Plus_Jakarta_Sans,")
        modified = True
    elif "import { Syne" in content:
        content = content.replace("import { Syne", "import { Plus_Jakarta_Sans")
        modified = True

    # 2. Const
    syne_def = 'const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });'
    jakarta_def = "const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-display' });"
    if syne_def in content:
        content = content.replace(syne_def, jakarta_def)
        modified = True

    # 3. Body className
    if "syne.variable" in content:
        content = content.replace("syne.variable", "plusJakarta.variable")
        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[{filepath}] tipografía migrada a Plus Jakarta Sans")

def update_css(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "--font-syne" in content:
        content = content.replace("--font-syne", "--font-display")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[{filepath}] refactorizadas las variables a --font-display")

def verify_page_headings(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    def add_font_display(match):
        full_tag = match.group(0)
        class_content = match.group(1)
        if "font-display" not in class_content:
            new_class = class_content + " font-display"
            return full_tag.replace(f'className="{class_content}"', f'className="{new_class}"')
        return full_tag

    pattern = r'<(?:h1|h2)[^>]*className="(.*?)"[^>]*>'
    if re.search(pattern, content):
        new_content = re.sub(pattern, add_font_display, content)
        if new_content != content:
            content = new_content
            modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[{filepath}] se agregaron clases font-display faltantes a títulos.")
    else:
        print(f"[{filepath}] los títulos ya poseen correctamente font-display.")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    layout_path = os.path.join(base_dir, 'src', 'app', 'layout.tsx')
    globals_path = os.path.join(base_dir, 'src', 'app', 'globals.css')
    page_path = os.path.join(base_dir, 'src', 'app', 'page.tsx')
    
    update_layout(layout_path)
    update_css(globals_path)
    verify_page_headings(page_path)

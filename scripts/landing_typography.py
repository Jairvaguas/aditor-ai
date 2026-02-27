import os
import re

def insert_css(globals_css_path):
    css_to_add = """
.font-display {
  font-family: var(--font-syne), sans-serif;
  font-weight: 800;
}
"""
    with open(globals_css_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if ".font-display" not in content:
        with open(globals_css_path, 'a', encoding='utf-8') as f:
            f.write(css_to_add)
        print("Clase .font-display agregada con éxito a globals.css")
    else:
        print("Clase .font-display ya existía en globals.css")

def update_page_tsx(page_tsx_path):
    with open(page_tsx_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False

    # Funcion helper para reemplazar className agregando font-display
    def add_font_display(match):
        full_tag = match.group(0)
        class_content = match.group(1)
        if "font-display" not in class_content:
            new_class = class_content + " font-display"
            # Reemplazar exactamente className="..."
            new_tag = full_tag.replace(f'className="{class_content}"', f'className="{new_class}"')
            return new_tag
        return full_tag

    # Regex para atrapar h1 y h2 que tengan un className
    pattern = r'<(?:h1|h2)[^>]*className="(.*?)"[^>]*>'
    
    if re.search(pattern, content):
        new_content = re.sub(pattern, add_font_display, content)
        if new_content != content:
            content = new_content
            modified = True

    if modified:
        with open(page_tsx_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Modificaciones realizadas a src/app/page.tsx (títulos ahora usan font-display)")
    else:
        print("Los títulos en src/app/page.tsx ya poseían font-display o no se detectaron para modificar.")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    css_path = os.path.join(base_dir, 'src', 'app', 'globals.css')
    page_tsx_path = os.path.join(base_dir, 'src', 'app', 'page.tsx')
    
    insert_css(css_path)
    update_page_tsx(page_tsx_path)

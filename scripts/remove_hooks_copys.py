import os
import re

files_to_check = [
    "src/components/DynamicPricingForm.tsx",
    "src/app/subscribe/page.tsx",
    "src/app/page.tsx"
]

def update_file(filepath):
    if not os.path.exists(filepath):
        print(f"[{filepath}] no encontrado, saltando.")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Expresión regular para encontrar la etiqueta <li> completa que contiene la frase
    # Match de espacios previos, etiqueta apertura <li> (con o sin className), 
    # contenido interno, frase exacta, más contenido, etiqueta cierre </li>
    pattern = r'\s*<li[^>]*>[\s\S]*?Generaci[oó]n de hooks y copys optimizados[\s\S]*?</li>'
    
    new_content, count = re.subn(pattern, '', content)
    
    # Fallback si no estaba en un <li>
    if count == 0 and ("hooks y copys" in content):
        lines = content.split('\n')
        new_lines = [l for l in lines if "hooks y copys" not in l]
        new_content = '\n'.join(new_lines)
        if len(lines) != len(new_lines):
            count = len(lines) - len(new_lines)

    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"[{filepath}]: Se eliminaron {count} ocurrencias de la lista de features.")
    else:
        print(f"[{filepath}]: No se encontraron ocurrencias (ya limpio).")

if __name__ == "__main__":
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    for rel_path in files_to_check:
        full_path = os.path.join(base_path, rel_path.replace("/", os.sep))
        update_file(full_path)

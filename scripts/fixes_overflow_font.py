import os
import re

def fix_report_overflow(base_dir):
    report_path = os.path.join(base_dir, 'src', 'app', 'reporte', '[id]', 'page.tsx')
    if not os.path.exists(report_path): return
    
    with open(report_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    old_h4 = '<h4 className="font-bold text-base mb-2">{finding.campana_nombre}</h4>'
    new_h4 = '<h4 className="font-bold text-base mb-2 break-all overflow-hidden text-ellipsis">{finding.campana_nombre}</h4>'
    
    if old_h4 in content:
        content = content.replace(old_h4, new_h4)
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[{report_path}] Fix 1 aplicado (overflow de campaña).")
    else:
        print(f"[{report_path}] No se encontró el tag H4 exacto a reemplazar o ya había sido ajustado.")

def purge_syne_class(base_dir):
    src_dir = os.path.join(base_dir, 'src')
    files_modified = 0
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if 'font-syne' in content:
                    content = content.replace('font-syne', 'font-display')
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    files_modified += 1
                    print(f"[{filepath}] Syne class reemplazada por font-display.")
    
    # También chequeamos el tailwind.config.ts por si está ahí
    tailwind_path = os.path.join(base_dir, 'tailwind.config.ts')
    if os.path.exists(tailwind_path):
        with open(tailwind_path, 'r', encoding='utf-8') as f:
            t_content = f.read()
        if 'font-syne' in t_content:
            t_content = t_content.replace('font-syne', 'font-display')
            with open(tailwind_path, 'w', encoding='utf-8') as f:
                f.write(t_content)
            print(f"[{tailwind_path}] Mención a font-syne erradicada del config.")
            files_modified += 1

    print(f"Purga completa. Archivos adaptados a font-display: {files_modified}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    fix_report_overflow(base_dir)
    purge_syne_class(base_dir)

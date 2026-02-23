import os
import shutil
import re
import subprocess
import sys

def install_pillow():
    try:
        import PIL
    except ImportError:
        print("Pillow no instalado. Instalando...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])

def update_images():
    source_image = r"C:\Users\Lenovo\.gemini\antigravity\brain\edba3c7e-aede-4c2f-a69b-c18dc40345a5\media__1771806694892.png"
    public_dir = os.path.join("public")
    
    if not os.path.exists(public_dir):
        os.makedirs(public_dir)
        
    favicon_png_path = os.path.join(public_dir, "favicon.png")
    favicon_ico_path = os.path.join(public_dir, "favicon.ico")
    
    # Copiar PNG
    if os.path.exists(source_image):
        shutil.copy2(source_image, favicon_png_path)
        print(f"Copiado {source_image} a {favicon_png_path}")
        
        # Crear ICO usando PIL
        try:
            from PIL import Image
            img = Image.open(source_image)
            img.save(favicon_ico_path, format="ICO", sizes=[(32, 32)])
            print(f"Generado {favicon_ico_path} exitosamente.")
        except Exception as e:
            print(f"Error generando .ico: {e}")
            # Fallback a copiar y renombrar si falla PIL
            shutil.copy2(source_image, favicon_ico_path)
    else:
        print(f"Imagen fuente no encontrada en: {source_image}")

    # ELIMINAR EL FAVICON VIEJO DE SRC/APP/ PARA EVITAR PRECEDENCIA OVERRIDE
    src_app_favicon = os.path.join("src", "app", "favicon.ico")
    if os.path.exists(src_app_favicon):
        os.remove(src_app_favicon)
        print(f"Eliminado {src_app_favicon} para forzar el uso de metadata en /public/.")

def patch_file(filepath, pattern_replace_pairs):
    if not os.path.exists(filepath):
        print(f"Archivo no encontrado: {filepath}")
        return
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    changed = False
    for pattern, replacement in pattern_replace_pairs:
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            content = new_content
            changed = True
            
    if changed:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Parcheado {filepath}")
    else:
        print(f"Sin cambios necesarios en {filepath}")

def main():
    install_pillow()
    update_images()
    
    # Navbar.tsx
    patch_file("src/components/Navbar.tsx", [
        (r'src="/favicon\.ico"', r'src="/favicon.png"')
    ])
    
    # Footer.tsx
    patch_file("src/components/Footer.tsx", [
        (r'src="/favicon\.ico"', r'src="/favicon.png"')
    ])
    
    # layout.tsx metadata
    layout_path = "src/app/layout.tsx"
    with open(layout_path, "r", encoding="utf-8") as f:
        layout_content = f.read()
        
    # Reemplazar definicion previa de icons completa o insertar nueva
    icons_block = """  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },"""
  
    if "icons: {" in layout_content:
        # Reemplazar bloque icons existente
        patched = re.sub(
            r'icons:\s*\{[^}]*\},\n?',
            icons_block + "\n",
            layout_content
        )
    else:
        # Insertar debajo de description si no hay icons
        patched = re.sub(
            r'(title:\s*"[^"]+",\s*description:\s*"[^"]+",)',
            r'\1\n' + icons_block,
            layout_content
        )
        
    if patched != layout_content:
        with open(layout_path, "w", encoding="utf-8") as f:
            f.write(patched)
        print("Layout metadata parcheada con bloque de icons completo.")
    else:
        print("La metadata en layout.tsx no necesitó parche nuevo.")

if __name__ == "__main__":
    main()

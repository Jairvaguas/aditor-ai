import os
import subprocess

def write_directive():
    dir_path = "directivas"
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, "fix_xml_markdown_db.md") # Overwrite existing note
    
    content = """# Directiva: Prevención de Markdown de Claude y Extracción de Datos Pre-Inserción

## Objetivo
El LLM (Claude) a veces devuelve el bloque XML envuelto en etiquetas Markdown (\`\`\`xml ... \`\`\`), o con texto introductorio, lo que corrompe el parseo Regex subsecuente en el Dashboard y provoca que devuelva métricas vacías. Tras intentar un replace simple, fue necesario escalar a una solución más agresiva.

## Resolución Definitiva
1. **System Prompt Estricto:** Se añadieron instrucciones CRÍTICAS obligando a que la respuesta inicie con `<?xml version="1.0" encoding="UTF-8"?>` y prohibiendo explícitamente los backticks.
2. **Sanitizer Agresivo:** En `src/lib/audit.ts`, la variable `cleanXml`:
   - Corta agresivamente cualquier cosa *antes* de la declaración `<?xml`.
   - Remueve bloques de markdown o backticks sueltos.
   - Aplica un fallback final de indexación mediante `cleanXml.indexOf('<?xml')`.
3. **Guardado Total:** Pasamos a `.insert({})` las columnas explícitas `score` y `hallazgos_count`, y sobreescribimos `xml_raw` con el `cleanXml`.

## Restricciones
- Nunca confiar en que Claude devolverá XML puro sin prefijos, incluso con system prompts agresivos. Siempre ejecutar un Sanitizer `substring(xmlStart)` antes de guardar.
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {file_path}")

def main():
    write_directive()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: aggressively sanitize XML output and enforce stricter system prompt for Claude to avoid markdown"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

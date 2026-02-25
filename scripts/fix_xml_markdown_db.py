import os
import subprocess

def write_directive():
    dir_path = "directivas"
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, "fix_xml_markdown_db.md")
    
    content = """# Directiva: Prevención de Markdown de Claude y Extracción de Datos Pre-Inserción

## Objetivo
El LLM (Claude) a veces devuelve el bloque XML envuelto en etiquetas Markdown (\`\`\`xml ... \`\`\`), lo que corrompe el parseo Regex subsecuente en el Dashboard y provoca que devuelva métricas en `$0` o `--`. Adicionalmente, era conveniente extraer el Score y el Total de Hallazgos en frío antes de insertar a Supabase para tener metadata directamente en columnas de la tabla.

## Resolución
1. **Limpieza (Sanitización):** En `src/lib/audit.ts`, la variable `cleanXml` remueve los backticks y salos de línea \`replace(/```xml\\n?/g, '')\` antes de interactuar con ella.
2. **Metadata en Frío:** Usando `cleanXml.match(...)` capturamos `<valor>(\d+)<\/valor>` y la repetición global de `<hallazgo ` para obtener el contador.
3. **Guardado Total:** Pasamos a `.insert({})` las columnas explícitas `score` y `hallazgos_count`, y sobreescribimos `xml_raw` con el `cleanXml`. Además, se envía `clerk_user_id` para garantizar alineamiento con el fetch del Dashboard.

## Restricciones
- Nunca inyectar `xml_raw` directamente desde la respuesta del AI sin pasar por el sanitizer de Markdown.
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {file_path}")

def main():
    write_directive()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "fix: remove markdown backticks from AI xml output and explicitly save score and hallazgos count in Supabase"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

import os
import re

def update_supabase_admin_usage(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Si es el archivo que lo define
    if filepath.endswith('src\\lib\\supabase.ts') or filepath.endswith('src/lib/supabase.ts'):
        # Reescribimos completamente
        if "export function getSupabaseAdmin()" not in content:
            new_content = """import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}
"""
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"[{filepath}] Reescribado.")
        return

    modified = False

    # 1. Reemplazar imports (ej: import { supabaseAdmin } from ...)
    import_pattern = r'import\s+\{\s*([^}]*?)supabaseAdmin([^}]*?)\s*\}\s+from'
    
    def repl_import(match):
        inner = match.group(0)
        return inner.replace('supabaseAdmin', 'getSupabaseAdmin')

    if re.search(import_pattern, content):
        content = re.sub(import_pattern, repl_import, content)
        modified = True

    # 2. Reemplazar usages
    usage_pattern = r'\bsupabaseAdmin\b'
    # Solo reemplazar si existe, previniendo loops de replace
    if re.search(usage_pattern, content) and "getSupabaseAdmin()" not in content:
        # Reemplazar supabaseAdmin por getSupabaseAdmin()
        content = re.sub(usage_pattern, 'getSupabaseAdmin()', content)
        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[{filepath}] Modificado.")

def fix_anthropic_in_audit(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remover inicializacion module-level
    module_anthropic = r"const client = new Anthropic\(\{[\s\S]*?apiKey:\s*process\.env\.ANTHROPIC_API_KEY,[\s\S]*?\}\);"
    
    if re.search(module_anthropic, content):
        content = re.sub(module_anthropic, "", content)
        
        # Inyectarlo dentro de la funcion generateAudit
        func_dec = r"(export async function generateAudit[^{]*\{)"
        replacement = r"\1\n  const client = new Anthropic({\n    apiKey: process.env.ANTHROPIC_API_KEY,\n  });\n"
        content = re.sub(func_dec, replacement, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[{filepath}] (Anthropic) Modificado para lazy eval.")

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src_dir = os.path.join(base_dir, 'src')
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                update_supabase_admin_usage(filepath)
                if file == 'audit.ts':
                    fix_anthropic_in_audit(filepath)

if __name__ == '__main__':
    main()

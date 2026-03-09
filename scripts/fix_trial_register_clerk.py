import os
import re

def main():
    file_path = r"c:\Users\Lenovo\Documents\Antigravity\AuditorAI\src\app\api\webhooks\clerk\route.ts"
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Define the target block to replace
    # We use a literal string replace since the target is quite specific and unique
    target_block = """        const { error } = await getSupabaseAdmin()
            .from('profiles')
            .insert({
                clerk_user_id: id,
                email: primaryEmail,
                nombre: nombre,
            })"""

    replacement_block = """        const { error } = await getSupabaseAdmin()
            .from('profiles')
            .insert({
                clerk_user_id: id,
                email: primaryEmail,
                nombre: nombre,
                trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            })"""

    if target_block in content:
        new_content = content.replace(target_block, replacement_block)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Successfully updated the file.")
    else:
        print("Error: Target block not found in the file.")
        
if __name__ == "__main__":
    main()

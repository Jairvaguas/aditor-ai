import os
import subprocess

def update_meta_auth():
    filepath = "src/lib/meta-auth.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Search for completeRegistrations line
    target_str = "const completeRegistrations = actions.find((a: any) => a.action_type === 'complete_registration')?.value || 0;"
    if target_str not in content:
        print("Could not find completeRegistrations in meta-auth.ts")
        return False

    insert_str = """
        const follows = actions.find((a: any) => 
            a.action_type === 'follow' || 
            a.action_type === 'page_engagement' ||
            a.action_type === 'like'
        )?.value || 0;

        const costPerFollower = spend > 0 && follows > 0 ? (spend / parseInt(follows)).toFixed(2) : null;
"""
    
    # We add it right after completeRegistrations
    content = content.replace(target_str, target_str + "\n" + insert_str)
    
    # We now need to add follows and cost_per_follower to the returned object
    # Let's search for "complete_registrations: completeRegistrations,"
    target_return = "complete_registrations: completeRegistrations,"
    
    if target_return not in content:
        print("Could not find complete_registrations in return object in meta-auth.ts")
        return False
        
    insert_return = """            follows,
            cost_per_follower: costPerFollower,"""
            
    content = content.replace(target_return, target_return + "\n" + insert_return)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Updated meta-auth.ts")
    return True

def update_audit():
    filepath = "src/lib/audit.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Update SYSTEM_PROMPT
    old_engagement_rule = """5. OUTCOME_ENGAGEMENT (Interacción):
   - KPI principal: costo por interacción, CTR
   - Analizar tipo de interacciones conseguidas"""
   
    new_engagement_rule = """5. OUTCOME_ENGAGEMENT (Interacción):
   - KPI principal: costo por interacción, CTR
   - Analizar tipo de interacciones conseguidas
   - Si hay seguidores nuevos (follows > 0): calcular y reportar costo por seguidor
   - Benchmark costo por seguidor LATAM: bajo < $0.30 / aceptable $0.30-0.80 / alto > $0.80"""

    if old_engagement_rule in content:
        content = content.replace(old_engagement_rule, new_engagement_rule)
    else:
        print("Could not find original OUTCOME_ENGAGEMENT rule in audit.ts")
        return False

    # Update userPrompt
    old_benchmark_rule = """Para TODAS las campañas:
- CTR feed: bajo < 0.8% / aceptable 0.8-1.5% / bueno > 1.5%"""

    new_benchmark_rule = """Para campañas de ENGAGEMENT/AWARENESS con objetivo de crecimiento:
- Costo por seguidor: bajo < $0.30 / aceptable $0.30-0.80 / alto > $0.80
- Si la campaña tiene follows > 0, reportar el costo por seguidor

Para TODAS las campañas:
- CTR feed: bajo < 0.8% / aceptable 0.8-1.5% / bueno > 1.5%"""

    if old_benchmark_rule in content:
        content = content.replace(old_benchmark_rule, new_benchmark_rule)
    else:
        print("Could not find original Para TODAS las campañas rule in audit.ts")
        return False

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    print("Updated audit.ts")
    return True

if __name__ == "__main__":
    if update_meta_auth() and update_audit():
        print("Committing and pushing...")
        subprocess.run(["git", "add", "src/lib/meta-auth.ts", "src/lib/audit.ts", "directivas/add_instagram_followers.md", "scripts/add_instagram_followers.py"], check=True)
        subprocess.run(["git", "commit", "-m", "feat: agregar metrica de seguidores a la auditoria de Meta"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("Done")
    else:
        print("Failed to update files")

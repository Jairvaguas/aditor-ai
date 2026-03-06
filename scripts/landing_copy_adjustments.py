import os
import json
import re

ES_PATH = 'messages/es.json'
EN_PATH = 'messages/en.json'
PAGE_PATH = 'src/app/page.tsx'

def update_json_copy(filepath, updates, hero_desc_sub_val):
    print(f"Modifying {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if "Landing" in data:
        # We want to insert heroDescSub after heroDesc. If we just rebuild the dict we can keep order (in python 3.7+ dict is ordered)
        new_landing = {}
        for k, v in data["Landing"].items():
            if k in updates:
                new_landing[k] = updates[k]
            else:
                new_landing[k] = v
            
            # Insert heroDescSub right after heroDesc
            if k == "heroDesc":
                new_landing["heroDescSub"] = hero_desc_sub_val
        
        data["Landing"] = new_landing

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Updated {filepath}")
    else:
        print(f"Key 'Landing' not found in {filepath}")

# Updates for ES
es_updates = {
    "heroDesc": "Auditorías semanales que te dicen exactamente qué tocar para subir tu ROAS. En menos de 15 minutos por semana.",
    "live": "Ejemplo de hallazgos en tu reporte",
    "week1Title": "1. Lunes 9:00 AM — Análisis automático",
    "week2Title": "2. Detección de anomalías",
    "week3Title": "3. Reporte en tu bandeja",
    "week4Title": "4. Tú ejecutas, el ROAS sube"
}
update_json_copy(ES_PATH, es_updates, "Conecta tu cuenta en 3 clicks. La IA hace el resto.")

# Updates for EN
en_updates = {
    "heroDesc": "Weekly audits that tell you exactly what to change to increase your ROAS. In less than 15 minutes per week.",
    "live": "Sample findings in your report",
    "week1Title": "1. Monday 9:00 AM — Automatic analysis",
    "week2Title": "2. Anomaly detection",
    "week3Title": "3. Report in your inbox",
    "week4Title": "4. You execute, ROAS goes up"
}
update_json_copy(EN_PATH, en_updates, "Connect your account in 3 clicks. The AI does the rest.")

# --- Update page.tsx ---
print(f"Modifying {PAGE_PATH}...")
with open(PAGE_PATH, 'r', encoding='utf-8') as f:
    page_content = f.read()

# Pattern to replace
target_block = r'<p\s+className="text-lg\s+md:text-xl\s+text-gray-400\s+mb-8\s+leading-relaxed\s+max-w-xl"\s+style={{[^}]*opacity:\s*0,\s*animationDelay:\s*\'150ms\'\s*}}>\s*\{t\("heroDesc"\)\}\s*</p>'

replacement = """<p className="text-lg md:text-xl text-gray-400 mb-3 leading-relaxed max-w-xl" style={{ animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '150ms' }}>
              {t("heroDesc")}
            </p>
            <p className="text-base text-gray-500 mb-8 max-w-xl" style={{ animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '200ms' }}>
              {t("heroDescSub")}
            </p>"""

if re.search(target_block, page_content):
    page_content = re.sub(target_block, replacement, page_content, count=1)
    with open(PAGE_PATH, 'w', encoding='utf-8') as f:
        f.write(page_content)
    print("Updated page.tsx")
else:
    print("Target block not found in page.tsx. It might have already been updated.")

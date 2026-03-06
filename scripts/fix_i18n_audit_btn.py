import os
import json

FILE_BTN = "src/components/AuditTriggerButton.tsx"
FILE_PAGE = "src/app/dashboard/page.tsx"
FILE_ES = "messages/es.json"
FILE_EN = "messages/en.json"

def update_btn():
    if not os.path.exists(FILE_BTN): return
    with open(FILE_BTN, 'r', encoding='utf-8') as f:
        content = f.read()

    # Reemplazar definicion
    if "export default function AuditTriggerButton() {" in content:
        content = content.replace(
            "export default function AuditTriggerButton() {",
            "export default function AuditTriggerButton({ label }: { label?: string }) {"
        )
    
    # Reemplazar texto
    if "Iniciar Auditoría" in content:
        content = content.replace(
            "Iniciar Auditoría",
            "{label || \"Start Audit\"}"
        )

    with open(FILE_BTN, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {FILE_BTN}")

def update_page():
    if not os.path.exists(FILE_PAGE): return
    with open(FILE_PAGE, 'r', encoding='utf-8') as f:
        content = f.read()

    if "<AuditTriggerButton />" in content:
        content = content.replace(
            "<AuditTriggerButton />",
            "<AuditTriggerButton label={t(\"startAudit\")} />"
        )
    
    with open(FILE_PAGE, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {FILE_PAGE}")

def update_json(filepath, lang):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if "Dashboard" not in data:
        data["Dashboard"] = {}

    if lang == "es":
        data["Dashboard"]["startAudit"] = "Iniciar Auditoría"
    else:
        data["Dashboard"]["startAudit"] = "Start Audit"
        if "Header" in data and "configuration" in data["Header"]:
            data["Header"]["configuration"] = "Settings"

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {filepath}")

def execute():
    update_btn()
    update_page()
    update_json(FILE_ES, "es")
    update_json(FILE_EN, "en")

if __name__ == "__main__":
    execute()

import json
import os

def update_json_file(filepath, updates):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for path, new_value in updates:
        current = data
        for k in path[:-1]:
            if k not in current:
                print(f"Key {k} not found in {filepath}")
            current = current[k]
        if path[-1] in current:
            current[path[-1]] = new_value
        else:
            print(f"Key {path[-1]} not found in {filepath}")
            
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        f.write('\n')

es_updates = [
    (("Landing", "profile1Perk1"), "Auditorías automáticas cada semana"),
    (("Landing", "weeklyTitle"), "Tu ritual semanal"),
    (("Landing", "week1Title"), "1. Cada semana — Análisis automático"),
    (("Dashboard", "weeklyAuditDesc"), "La IA analizará tus campañas automáticamente cada semana y te enviará el reporte por email.")
]

en_updates = [
    (("Landing", "profile1Perk1"), "Automatic audits every week"),
    (("Landing", "weeklyTitle"), "Your weekly ritual"),
    (("Landing", "week1Title"), "1. Every week — Automatic analysis"),
    (("Dashboard", "weeklyAuditDesc"), "The AI will automatically analyze your campaigns every week and send you the report by email.")
]

es_file = os.path.join(os.path.dirname(__file__), '..', 'messages', 'es.json')
en_file = os.path.join(os.path.dirname(__file__), '..', 'messages', 'en.json')

update_json_file(es_file, es_updates)
update_json_file(en_file, en_updates)

print("Updated es.json and en.json successfully.")

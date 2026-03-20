import os

BASE_DIR = r"c:\Users\Lenovo\Documents\Antigravity\AuditorAI"

def replace_in_file(file_path, replacements):
    full_path = os.path.join(BASE_DIR, file_path)
    if not os.path.exists(full_path):
        print(f"File not found: {full_path}")
        return
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
        else:
            print(f"Warning: '{old}' not found in {file_path}")
            
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {file_path}")


# Replacements in es.json
es_replacements = [
    ('"heroBadge": "Primera auditoría gratis"', '"heroBadge": "IA AUDITORÍA EN TIEMPO REAL"'),
    ('"heroDescSub": "Conecta tu cuenta en 3 clicks. La IA hace el resto."', '"heroDescSub": "Aditor detecta frecuencia alta y campañas ineficientes automáticamente. Audita tu cuenta sin riesgos."'),
    ('"readonly": "✨ Solo lectura. No modificamos tus anuncios."', '"readonly": "✨ Solo lectura. Nunca tocamos tus campañas."'),
    ('"pricingTitle": "Planes simples, resultados reales."', '"pricingTitle": "Invierte menos que un café al día. Recupera miles en ads."'),
    ('"pricingSubtitle": "Un solo reporte puede ahorrarte 10 veces el valor de la suscripción."', '"pricingSubtitle": "Se paga solo con detectar una sola campaña ineficiente."')
]
replace_in_file('messages/es.json', es_replacements)

# Replacements in en.json
en_replacements = [
    ('"heroBadge": "First audit free"', '"heroBadge": "REAL-TIME AI AUDIT"'),
    ('"heroDescSub": "Connect your account in 3 clicks. The AI does the rest."', '"heroDescSub": "Aditor detects high frequency and inefficient campaigns automatically. Audit your account risk-free."'),
    ('"readonly": "✨ Read-only. We never modify your ads."', '"readonly": "✨ Read-only. We never touch your campaigns."'),
    ('"pricingTitle": "Simple plans, real results."', '"pricingTitle": "Invest less than a coffee a day. Recover thousands in ads."'),
    ('"pricingSubtitle": "A single report can save you 10 times the subscription value."', '"pricingSubtitle": "Pays for itself by detecting a single inefficient campaign."')
]
replace_in_file('messages/en.json', en_replacements)


# Replacements in page.tsx
page_tsx_path = 'src/app/page.tsx'

readonly_old = '<p className="mt-6 text-sm text-gray-500 font-medium">{t("readonly")}</p>'
readonly_new = readonly_old + '''
            <div className="mt-4 flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 w-fit">
                    <span className="text-lg">☕</span>
                    <div>
                        <span className="text-sm font-bold text-white">Solo $24 USD/mes</span>
                        <span className="text-xs text-slate-400 ml-1">— El costo de un café diario para salvar miles</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>🔒</span>
                    <span>Conexión 100% segura. Acceso de solo lectura vía Meta API oficial.</span>
                </div>
            </div>'''

live_old = '''<div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">{t("live")}</span>
              </div>'''
live_new = live_old + '''
              <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10 w-fit">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="6" cy="6" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>
                  </div>
                  <div>
                      <div className="text-xs font-bold text-white">Meta Ads Sync</div>
                      <div className="text-[10px] text-slate-400">Conexión oficial en vivo</div>
                  </div>
              </div>'''

page_replacements = [
    (readonly_old, readonly_new),
    (live_old, live_new)
]
replace_in_file(page_tsx_path, page_replacements)


# Replacements in DynamicPricingForm.tsx
pricing_form_path = 'src/components/DynamicPricingForm.tsx'

basic_title_old = '<h3 className="text-xl font-bold text-white">Básico</h3>'
basic_title_new = '<h3 className="text-xl font-bold text-white">Starter</h3>'

basic_desc_old = 'Perfecto para emprendedores que quieren entender sus campañas.'
basic_desc_new = 'Detecta campañas que queman tu presupuesto. Menos de un café al día.'

pro_desc_old = 'Para quienes quieren dominar Meta Ads y maximizar cada peso.'
pro_desc_new = 'Auditorías ilimitadas para dominar Meta Ads. El costo de un almuerzo al mes.'

pricing_replacements = [
    (basic_title_old, basic_title_new),
    (basic_desc_old, basic_desc_new),
    (pro_desc_old, pro_desc_new)
]
replace_in_file(pricing_form_path, pricing_replacements)

print("Done.")

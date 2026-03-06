import os
import json
import re

PAGE_PATH = 'src/app/page.tsx'
ES_PATH = 'messages/es.json'
EN_PATH = 'messages/en.json'

# --- 1. Modify page.tsx ---
print("Modifying page.tsx...")
with open(PAGE_PATH, 'r', encoding='utf-8') as f:
    page_content = f.read()

# Replace lucide-react import
import_regex = re.compile(r'import \{[^}]+\} from "lucide-react";')
new_import = 'import { ArrowRight, Search, TrendingUp, Clock, AlertTriangle, CheckCircle2, Zap, Repeat, Shield, Users, ShoppingCart, Briefcase, Eye, Brain, BarChart3, Mail } from "lucide-react";'
page_content = import_regex.sub(new_import, page_content, count=1)

insert_marker = '{/* 5. Precios */}'

sections_to_insert = """      {/* Security & Trust */}
      <section id="seguridad" className="py-24 bg-[#080D18] border-y border-white/5 w-full animate-on-scroll">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">{t("securityTitle")}</h2>
            <p className="text-slate-400 text-xl">{t("securitySubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 text-center">
              <div className="w-14 h-14 bg-[#00D4AA]/10 rounded-xl flex items-center justify-center mb-4 text-[#00D4AA] mx-auto">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("sec1Title")}</h3>
              <p className="text-slate-400 text-sm">{t("sec1Desc")}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 text-center">
              <div className="w-14 h-14 bg-[#00D4AA]/10 rounded-xl flex items-center justify-center mb-4 text-[#00D4AA] mx-auto">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("sec2Title")}</h3>
              <p className="text-slate-400 text-sm">{t("sec2Desc")}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 text-center">
              <div className="w-14 h-14 bg-[#00D4AA]/10 rounded-xl flex items-center justify-center mb-4 text-[#00D4AA] mx-auto">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("sec3Title")}</h3>
              <p className="text-slate-400 text-sm">{t("sec3Desc")}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 text-center">
              <div className="w-14 h-14 bg-[#00D4AA]/10 rounded-xl flex items-center justify-center mb-4 text-[#00D4AA] mx-auto">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("sec4Title")}</h3>
              <p className="text-slate-400 text-sm">{t("sec4Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section id="perfiles" className="py-24 w-full animate-on-scroll">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">{t("profilesTitle")}</h2>
            <p className="text-slate-400 text-xl">{t("profilesSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl animate-on-scroll" style={{ transitionDelay: '0ms' }}>
              <div className="w-14 h-14 bg-[#FF6B6B]/10 rounded-xl flex items-center justify-center mb-6 text-[#FF6B6B]">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("profile1Title")}</h3>
              <p className="text-slate-400 leading-relaxed mb-4">{t("profile1Desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" /> {t("profile1Perk1")}</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" /> {t("profile1Perk2")}</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" /> {t("profile1Perk3")}</li>
              </ul>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl animate-on-scroll" style={{ transitionDelay: '100ms' }}>
              <div className="w-14 h-14 bg-[#00D4AA]/10 rounded-xl flex items-center justify-center mb-6 text-[#00D4AA]">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("profile2Title")}</h3>
              <p className="text-slate-400 leading-relaxed mb-4">{t("profile2Desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" /> {t("profile2Perk1")}</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" /> {t("profile2Perk2")}</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" /> {t("profile2Perk3")}</li>
              </ul>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl animate-on-scroll" style={{ transitionDelay: '200ms' }}>
              <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mb-6 text-yellow-400">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("profile3Title")}</h3>
              <p className="text-slate-400 leading-relaxed mb-4">{t("profile3Desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" /> {t("profile3Perk1")}</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" /> {t("profile3Perk2")}</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" /> {t("profile3Perk3")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Ritual */}
      <section id="semanal" className="py-24 bg-[#080D18] border-y border-white/5 w-full animate-on-scroll">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">{t("weeklyTitle")}</h2>
            <p className="text-slate-400 text-xl">{t("weeklySubtitle")}</p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF6B6B] via-[#00D4AA] to-[#00D4AA] hidden md:block" />
            <div className="space-y-8">
              <div className="flex gap-6 items-start animate-on-scroll">
                <div className="w-12 h-12 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center text-[#FF6B6B] flex-shrink-0 border border-[#FF6B6B]/30">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{t("week1Title")}</h3>
                  <p className="text-slate-400">{t("week1Desc")}</p>
                </div>
              </div>
              <div className="flex gap-6 items-start animate-on-scroll">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 flex-shrink-0 border border-yellow-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{t("week2Title")}</h3>
                  <p className="text-slate-400">{t("week2Desc")}</p>
                </div>
              </div>
              <div className="flex gap-6 items-start animate-on-scroll">
                <div className="w-12 h-12 bg-[#00D4AA]/10 rounded-full flex items-center justify-center text-[#00D4AA] flex-shrink-0 border border-[#00D4AA]/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{t("week3Title")}</h3>
                  <p className="text-slate-400">{t("week3Desc")}</p>
                </div>
              </div>
              <div className="flex gap-6 items-start animate-on-scroll">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 flex-shrink-0 border border-blue-500/30">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{t("week4Title")}</h3>
                  <p className="text-slate-400">{t("week4Desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section id="diferencial" className="py-24 w-full animate-on-scroll">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">{t("diffTitle")}</h2>
            <p className="text-slate-400 text-xl">{t("diffSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-900 p-8 rounded-2xl border border-red-500/20">
              <h3 className="text-lg font-bold mb-4 text-red-400">{t("diffOthersTitle")}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-400 text-sm"><span className="text-red-400 mt-0.5">✕</span> {t("diffOthers1")}</li>
                <li className="flex items-start gap-3 text-slate-400 text-sm"><span className="text-red-400 mt-0.5">✕</span> {t("diffOthers2")}</li>
                <li className="flex items-start gap-3 text-slate-400 text-sm"><span className="text-red-400 mt-0.5">✕</span> {t("diffOthers3")}</li>
                <li className="flex items-start gap-3 text-slate-400 text-sm"><span className="text-red-400 mt-0.5">✕</span> {t("diffOthers4")}</li>
              </ul>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-[#00D4AA]/30">
              <h3 className="text-lg font-bold mb-4 text-[#00D4AA]">{t("diffAditorTitle")}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" /> {t("diffAditor1")}</li>
                <li className="flex items-start gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" /> {t("diffAditor2")}</li>
                <li className="flex items-start gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" /> {t("diffAditor3")}</li>
                <li className="flex items-start gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-4 h-4 text-[#00D4AA] mt-0.5 flex-shrink-0" /> {t("diffAditor4")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>\n"""

if "id=\"seguridad\"" not in page_content:
    if insert_marker in page_content:
        page_content = page_content.replace(insert_marker, sections_to_insert + "\n      " + insert_marker)
        with open(PAGE_PATH, 'w', encoding='utf-8') as f:
            f.write(page_content)
        print("Updated page.tsx")
    else:
        print("Could not find insert marker in page.tsx")
else:
    print("Page already updated")


def add_to_json(filepath, lang_dict):
    print(f"Modifying {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if "Landing" in data:
        new_landing = {}
        for k, v in data["Landing"].items():
            new_landing[k] = v
            if k == "feat3Desc":
                # Insert our keys here
                for nk, nv in lang_dict.items():
                    new_landing[nk] = nv
        data["Landing"] = new_landing
    
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Updated {filepath}")
    else:
        print(f"'Landing' not found in {filepath}")

es_translations = {
    "securityTitle": "Tu cuenta está segura con nosotros",
    "securitySubtitle": "Transparencia total sobre cómo manejamos tus datos.",
    "sec1Title": "Solo lectura",
    "sec1Desc": "Pedimos únicamente el permiso ads_read. No podemos modificar, pausar ni editar nada en tu cuenta.",
    "sec2Title": "OAuth 2.0 oficial",
    "sec2Desc": "Conexión encriptada directa con Meta. Nunca vemos ni almacenamos tu contraseña.",
    "sec3Title": "Datos temporales",
    "sec3Desc": "Procesamos tus métricas para generar el reporte y no las retenemos más allá de lo necesario.",
    "sec4Title": "Sin entrenar modelos",
    "sec4Desc": "Tus datos de campañas jamás se usan para entrenar modelos de IA. Son exclusivamente tuyos.",

    "profilesTitle": "Diseñado para quienes viven de los ads",
    "profilesSubtitle": "No importa tu rol, Aditor AI se adapta a tu flujo de trabajo.",
    "profile1Title": "Freelancers",
    "profile1Desc": "Manejas varias cuentas y no tienes tiempo de auditar cada una manualmente.",
    "profile1Perk1": "Auditorías automáticas cada lunes",
    "profile1Perk2": "Reportes listos para enviar a tus clientes",
    "profile1Perk3": "Detecta problemas antes de que el cliente pregunte",
    "profile2Title": "Agencias",
    "profile2Desc": "Tu equipo necesita un estándar de calidad consistente en todas las cuentas.",
    "profile2Perk1": "Múltiples cuentas publicitarias en un solo dashboard",
    "profile2Perk2": "Hallazgos priorizados por impacto en ROAS",
    "profile2Perk3": "Ahorra horas de análisis manual por semana",
    "profile3Title": "Dueños de E-commerce",
    "profile3Desc": "Inviertes en Meta Ads pero no sabes si tu agencia o trafficker está optimizando bien.",
    "profile3Perk1": "Segunda opinión imparcial sobre tus campañas",
    "profile3Perk2": "Entiende tu performance sin ser experto en ads",
    "profile3Perk3": "Alertas cuando algo requiere atención urgente",

    "weeklyTitle": "Tu ritual de los lunes",
    "weeklySubtitle": "Cada semana la IA trabaja para ti. Así es el ciclo:",
    "week1Title": "Lunes 9:00 AM — Análisis automático",
    "week1Desc": "La IA escanea todas tus campañas activas: estructura, métricas, frecuencia, creativos y segmentación.",
    "week2Title": "Detección de anomalías",
    "week2Desc": "Identifica campañas con ROAS en caída, frecuencia excesiva, CPM disparado o creativos agotados.",
    "week3Title": "Reporte en tu bandeja",
    "week3Desc": "Recibes un email con el score general de tu cuenta, los hallazgos críticos y un plan de acción priorizado.",
    "week4Title": "Tú ejecutas, el ROAS sube",
    "week4Desc": "Aplica las recomendaciones en 15 minutos. La semana siguiente, la IA mide si los cambios funcionaron.",

    "diffTitle": "No somos otro dashboard de métricas",
    "diffSubtitle": "Aditor AI es tu director de performance. Esto es lo que nos hace diferentes.",
    "diffOthersTitle": "Otras herramientas de IA",
    "diffOthers1": "Te muestran métricas sin decirte qué hacer",
    "diffOthers2": "Promesas genéricas de \"optimización con IA\"",
    "diffOthers3": "Requieren configuración compleja y onboarding largo",
    "diffOthers4": "Mezclan creativos, copy y análisis sin foco claro",
    "diffAditorTitle": "Aditor AI",
    "diffAditor1": "Te dice exactamente qué pausar, escalar o cambiar y por qué",
    "diffAditor2": "Auditoría técnica + táctica enfocada en ROAS real",
    "diffAditor3": "Conectas en 3 clics, primer reporte en 3 minutos",
    "diffAditor4": "Foco único: que tu inversión en Meta Ads sea rentable"
}

en_translations = {
    "securityTitle": "Your account is safe with us",
    "securitySubtitle": "Full transparency on how we handle your data.",
    "sec1Title": "Read-only access",
    "sec1Desc": "We only request the ads_read permission. We cannot modify, pause, or edit anything in your account.",
    "sec2Title": "Official OAuth 2.0",
    "sec2Desc": "Encrypted connection directly with Meta. We never see or store your password.",
    "sec3Title": "Temporary data",
    "sec3Desc": "We process your metrics to generate the report and don't retain them beyond what's necessary.",
    "sec4Title": "No model training",
    "sec4Desc": "Your campaign data is never used to train AI models. It's exclusively yours.",

    "profilesTitle": "Built for those who live and breathe ads",
    "profilesSubtitle": "No matter your role, Aditor AI adapts to your workflow.",
    "profile1Title": "Freelancers",
    "profile1Desc": "You manage multiple accounts and don't have time to audit each one manually.",
    "profile1Perk1": "Automatic audits every Monday",
    "profile1Perk2": "Reports ready to send to your clients",
    "profile1Perk3": "Detect issues before your client asks",
    "profile2Title": "Agencies",
    "profile2Desc": "Your team needs a consistent quality standard across all accounts.",
    "profile2Perk1": "Multiple ad accounts in a single dashboard",
    "profile2Perk2": "Findings prioritized by ROAS impact",
    "profile2Perk3": "Save hours of manual analysis per week",
    "profile3Title": "E-commerce Owners",
    "profile3Desc": "You invest in Meta Ads but don't know if your agency or media buyer is optimizing well.",
    "profile3Perk1": "Unbiased second opinion on your campaigns",
    "profile3Perk2": "Understand your performance without being an ads expert",
    "profile3Perk3": "Alerts when something needs urgent attention",

    "weeklyTitle": "Your Monday ritual",
    "weeklySubtitle": "Every week the AI works for you. Here's the cycle:",
    "week1Title": "Monday 9:00 AM — Automatic analysis",
    "week1Desc": "The AI scans all your active campaigns: structure, metrics, frequency, creatives, and targeting.",
    "week2Title": "Anomaly detection",
    "week2Desc": "Identifies campaigns with declining ROAS, excessive frequency, spiking CPM, or exhausted creatives.",
    "week3Title": "Report in your inbox",
    "week3Desc": "You receive an email with your account's overall score, critical findings, and a prioritized action plan.",
    "week4Title": "You execute, ROAS goes up",
    "week4Desc": "Apply the recommendations in 15 minutes. The following week, the AI measures if the changes worked.",

    "diffTitle": "We're not another metrics dashboard",
    "diffSubtitle": "Aditor AI is your performance director. Here's what makes us different.",
    "diffOthersTitle": "Other AI tools",
    "diffOthers1": "Show you metrics without telling you what to do",
    "diffOthers2": "Generic promises of \"AI optimization\"",
    "diffOthers3": "Require complex setup and long onboarding",
    "diffOthers4": "Mix creatives, copy, and analysis without clear focus",
    "diffAditorTitle": "Aditor AI",
    "diffAditor1": "Tells you exactly what to pause, scale, or change and why",
    "diffAditor2": "Technical + tactical audit focused on real ROAS",
    "diffAditor3": "Connect in 3 clicks, first report in 3 minutes",
    "diffAditor4": "Single focus: making your Meta Ads investment profitable"
}

add_to_json(ES_PATH, es_translations)
add_to_json(EN_PATH, en_translations)

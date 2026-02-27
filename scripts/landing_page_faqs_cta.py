import json
import os
import re

def update_json_file(filepath, new_keys):
    """Updates a JSON file with new keys if they don't exist."""
    print(f"[*] Revisando archivo {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if 'Landing' not in data:
            print(f"[!] Clave 'Landing' no encontrada en {filepath}. Creándola.")
            data['Landing'] = {}
        
        updated = False
        for key, value in new_keys.items():
            if key not in data['Landing']:
                data['Landing'][key] = value
                updated = True
                print(f" [+] Añadida clave: Landing.{key}")
            else:
                 print(f" [-] La clave: Landing.{key} ya existe. Saltando.")
        
        if updated:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            print(f"[+] Archivo {filepath} actualizado correctamente.")
        else:
            print(f"[-] No se requirieron cambios en {filepath}.")
            
    except FileNotFoundError:
        print(f"[!] Archivo {filepath} no encontrado.")
    except Exception as e:
        print(f"[!] Error al procesar {filepath}: {e}")

def update_landing_page(filepath):
    """Injects the FAQ and CTA sections into the landing page."""
    print(f"[*] Revisando archivo {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if "id=\"faq\"" in content or "id=\"cta\"" in content:
            print(f"[-] Las secciones FAQ o CTA ya parecen estar presentes en {filepath}. Saltando actualización UI.")
            return

        # Busca el pie de página para insertar antes de este componente
        target_marker = "{/* 6. Footer */}"
        if target_marker not in content:
            print(f"[!] No se encontró el marcador '{target_marker}' en {filepath}.")
            return
            
        jsx_to_insert = """
      {/* 5.5 FAQs */}
      <section id="faq" className="py-24 w-full">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">{t("faqTitle")}</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <details key={num} className="group bg-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 sm:p-8 font-bold text-lg sm:text-xl text-white">
                  <span>{t(`faq${num}Q` as any)}</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 text-base sm:text-lg leading-relaxed">
                  {t(`faq${num}A` as any)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 5.6 Final CTA */}
      <section id="cta" className="relative py-24 bg-[#080D18] border-y border-white/5 w-full overflow-hidden text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#FF6B6B]/20 to-[#00D4AA]/10 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 w-full">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            {t("ctaSectionTitle")}
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 mb-10">
            {t("ctaSectionSubtitle")}
          </p>
          <Link href="/conectar" className="inline-flex bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-10 py-5 rounded-full text-xl font-bold transition-all items-center gap-3 shadow-[0_8px_24px_rgba(255,107,107,0.25)] hover:shadow-[0_12px_32px_rgba(255,107,107,0.4)] hover:-translate-y-1">
            {t("ctaSectionBtn")} <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm text-gray-500 font-medium">
            {t("ctaSectionMicrocopy")}
          </p>
        </div>
      </section>
"""
        new_content = content.replace(target_marker, jsx_to_insert + "\n      " + target_marker)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"[+] Archivo {filepath} actualizado con las secciones FAQ y CTA.")

    except Exception as e:
        print(f"[!] Error al procesar {filepath}: {e}")

if __name__ == "__main__":
    print("Iniciando inyección de FAQs y CTA...")
    
    # Textos en español
    es_keys = {
        "faqTitle": "Preguntas Frecuentes",
        "faq1Q": "¿Aditor AI modifica mis campañas?",
        "faq1A": "No. Aditor AI solo tiene acceso de lectura a tus campañas. Nunca modifica, pausa ni edita ningún anuncio. Solo analiza y recomienda.",
        "faq2Q": "¿Necesito dar mi contraseña de Meta Ads?",
        "faq2A": "No. La conexión se hace mediante OAuth 2.0 oficial de Meta, el mismo sistema que usan apps como Hootsuite o Buffer. Nunca vemos tu contraseña.",
        "faq3Q": "¿Qué pasa cuando termina el trial de 7 días?",
        "faq3A": "Recibirás un email de aviso el día anterior. Si no activás tu suscripción, perderás acceso al dashboard pero tus datos quedan guardados.",
        "faq4Q": "¿Funciona para cualquier tipo de negocio?",
        "faq4A": "Sí. Aditor AI analiza cualquier cuenta de Meta Ads con campañas activas. Está optimizado para e-commerce pero funciona para cualquier vertical.",
        "faq5Q": "¿Con qué frecuencia se generan los reportes?",
        "faq5A": "Podés generar auditorías manualmente cuando quieras. Además, cada lunes a las 9AM la IA analiza automáticamente tus campañas y te envía el reporte por email.",
        "faq6Q": "¿Puedo cancelar cuando quiera?",
        "faq6A": "Sí. Sin permanencia ni penalizaciones. Cancelás desde el panel de configuración en cualquier momento.",
        "ctaSectionTitle": "Tu ROAS no va a mejorar solo.",
        "ctaSectionSubtitle": "La IA ya encontró los problemas. Solo falta que los veas.",
        "ctaSectionBtn": "Ver mi auditoría gratis",
        "ctaSectionMicrocopy": "7 días gratis · Sin tarjeta · Cancelás cuando quieras"
    }

    # Textos en inglés
    en_keys = {
        "faqTitle": "Frequently Asked Questions",
        "faq1Q": "Does Aditor AI modify my campaigns?",
        "faq1A": "No. Aditor AI only has read access to your campaigns. It never modifies, pauses or edits any ad. It only analyzes and recommends.",
        "faq2Q": "Do I need to give my Meta Ads password?",
        "faq2A": "No. The connection is made through Meta's official OAuth 2.0, the same system used by apps like Hootsuite or Buffer. We never see your password.",
        "faq3Q": "What happens when the 7-day trial ends?",
        "faq3A": "You will receive a warning email the day before. If you don't activate your subscription, you'll lose access to the dashboard but your data is saved.",
        "faq4Q": "Does it work for any type of business?",
        "faq4A": "Yes. Aditor AI analyzes any Meta Ads account with active campaigns. It's optimized for e-commerce but works for any vertical.",
        "faq5Q": "How often are reports generated?",
        "faq5A": "You can generate audits manually whenever you want. Also, every Monday at 9AM the AI automatically analyzes your campaigns and emails you the report.",
        "faq6Q": "Can I cancel anytime?",
        "faq6A": "Yes. No permanence or penalties. You cancel from the settings panel at any time.",
        "ctaSectionTitle": "Your ROAS won't improve on its own.",
        "ctaSectionSubtitle": "The AI has already found the problems. You just need to see them.",
        "ctaSectionBtn": "View my audit for free",
        "ctaSectionMicrocopy": "7 days free · No credit card · Cancel anytime"
    }

    # Paths (relative to root)
    es_json_path = os.path.join("messages", "es.json")
    en_json_path = os.path.join("messages", "en.json")
    landing_page_path = os.path.join("src", "app", "page.tsx")

    update_json_file(es_json_path, es_keys)
    update_json_file(en_json_path, en_keys)
    update_landing_page(landing_page_path)
    
    print("Ejecución completada.")

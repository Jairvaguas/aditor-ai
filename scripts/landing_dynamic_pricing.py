import os
import re

def update_dynamic_pricing_form(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    modified = False

    # Add Link import if missing
    if "import Link from 'next/link';" not in content and "import Link from" not in content:
        content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport Link from 'next/link';")
        modified = True

    # Update Props
    if "isLanding?: boolean;" not in content:
        content = content.replace("copRate: number;", "copRate: number;\n    isLanding?: boolean;")
        modified = True
    
    # Update function signature
    if "isLanding = false" not in content:
        content = content.replace("export default function DynamicPricingForm({ copRate }: DynamicPricingFormProps)", "export default function DynamicPricingForm({ copRate, isLanding = false }: DynamicPricingFormProps)")
        modified = True

    # Update CTA button
    old_cta_code = """                ) : (
                    <SubscribeButton accountsCount={accountsCount} formattedCop={formattedCop} />
                )}"""
    
    new_cta_code = """                ) : isLanding ? (
                    <Link
                        href="/conectar"
                        className="px-8 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53] text-white font-bold rounded-xl shadow-[0_6px_20px_rgba(255,107,107,0.35)] hover:shadow-[0_8px_25px_rgba(255,107,107,0.5)] transition-all duration-300 transform hover:-translate-y-1 w-full text-center"
                    >
                        Iniciar prueba gratis
                    </Link>
                ) : (
                    <SubscribeButton accountsCount={accountsCount} formattedCop={formattedCop} />
                )}"""
    
    if "isLanding ?" not in content:
        content = content.replace(old_cta_code, new_cta_code)
        modified = True

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[{file_path}] actualizado correctamente.")
    else:
        print(f"[{file_path}] no requirió cambios.")

def update_landing_page(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    modified = False

    # Import DynamicPricingForm
    if "import DynamicPricingForm" not in content:
        # replace useTranslations import with getTranslations
        content = content.replace('import { useTranslations } from "next-intl";', 'import { getTranslations } from "next-intl/server";\nimport DynamicPricingForm from "@/components/DynamicPricingForm";')
        modified = True

    # Check if Home is async
    if "export default function Home()" in content:
        content = content.replace('export default function Home()', 'export default async function Home()')
        
        # Replace useTranslations with getTranslations and fetch block
        old_t = 'const t = useTranslations("Landing");'
        new_t = """const t = await getTranslations("Landing");

  let estimatedCop = 185000;
  try {
      const copRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD", { next: { revalidate: 3600 } });
      if (copRes.ok) {
          const data = await copRes.json();
          if (data && data.rates && data.rates.COP) {
              estimatedCop = Math.round(47 * data.rates.COP);
          }
      }
  } catch (e) {
      console.error("Error fetching exchange rate:", e);
  }"""
        content = content.replace(old_t, new_t)
        modified = True

    # Logic to replace the whole "5. Precios" section
    start_tag = '{/* 5. Precios */}'
    end_tag = '{/* 5.5 FAQs */}'
    
    if start_tag in content and end_tag in content and "<DynamicPricingForm" not in content:
        start_idx = content.find(start_tag)
        end_idx = content.find(end_tag)
        
        replacement = """{/* 5. Precios */}
      <section id="precios" className="py-24 bg-[#080D18] border-y border-white/5 relative overflow-hidden w-full">
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#FF6B6B]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t("pricingTitle")}</h2>
            <p className="text-gray-400 text-xl">{t("pricingSubtitle")}</p>
          </div>

          <DynamicPricingForm copRate={estimatedCop / 47} isLanding={true} />

        </div>
      </section>

      """
        content = content[:start_idx] + replacement + content[end_idx:]
        modified = True

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[{file_path}] actualizado correctamente.")
    else:
        print(f"[{file_path}] no requirió cambios.")

if __name__ == "__main__":
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    form_path = os.path.join(base_path, "src", "components", "DynamicPricingForm.tsx")
    page_path = os.path.join(base_path, "src", "app", "page.tsx")
    
    update_dynamic_pricing_form(form_path)
    update_landing_page(page_path)
    print("Modificaciones realizadas con éxito.")

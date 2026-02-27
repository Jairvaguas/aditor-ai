import Link from "next/link";
import { ArrowRight, Search, TrendingUp, Clock, AlertTriangle, CheckCircle2, Zap, Repeat } from "lucide-react";
import { getTranslations } from "next-intl/server";
import DynamicPricingForm from "@/components/DynamicPricingForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";

export default async function Home() {
  const t = await getTranslations("Landing");

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
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#0B1120] text-[#F0F0F0] font-sans selection:bg-[#FF6B6B]/30">
      <ScrollAnimations />
      {/* 1. Navbar Fija */}
      <Navbar />

      {/* 2. Hero Section (2 Columnas) */}
      <section className="relative min-h-screen pt-20 pb-20 overflow-hidden w-full">
        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#FF6B6B]/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00D4AA]/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full px-6 max-w-7xl mx-auto relative z-10 w-full">
          {/* Columna Izquierda: Texto */}
          <div className="max-w-2xl text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D4AA]/30 bg-[#00D4AA]/10 text-[#00D4AA] text-sm font-bold uppercase tracking-widest mb-6">
              <Zap className="w-4 h-4" /> {t("heroBadge")}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight font-display" style={{ animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '0ms' }}>
              {t("heroTitle")} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53]">
                {t("heroTitleHighlight")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl" style={{ animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '150ms' }}>
              {t("heroDesc")}
            </p>
            <div className="flex justify-start" style={{ animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '300ms' }}>
              <Link href="/conectar" className="inline-flex bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-4 rounded-full text-lg font-bold transition-all text-center items-center justify-center gap-3 shadow-[0_8px_24px_rgba(255,107,107,0.25)] hover:shadow-[0_12px_32px_rgba(255,107,107,0.4)] hover:-translate-y-1">
                {t("cta")} <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500 font-medium">{t("readonly")}</p>
          </div>

          {/* Columna Derecha: Mockup Animado */}
          <div className="relative w-full max-w-lg mx-auto lg:mr-0 lg:ml-auto" style={{ animation: 'fadeSlideUp 0.8s ease forwards', opacity: 0, animationDelay: '450ms' }}>
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-2xl relative transform lg:rotate-2 lg:hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">{t("live")}</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">{t("camp1")}</div>
                    <div className="font-semibold text-white">{t("roasActual")}</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-[#FF6B6B] font-bold text-xl flex items-center sm:justify-end gap-1"><TrendingUp className="w-4 h-4 rotate-180" /> 0.8x</div>
                    <div className="text-xs text-slate-400 mt-1">{t("pausar")}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#00D4AA]/30 bg-[#00D4AA]/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00D4AA]" />
                  <div>
                    <div className="text-sm text-[#00D4AA] mb-1 font-medium">{t("oportunidad")}</div>
                    <div className="font-semibold text-white">{t("anuncioVideo")}</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-[#00D4AA] font-bold text-xl flex items-center sm:justify-end gap-1"><TrendingUp className="w-4 h-4" /> 4.2x</div>
                    <div className="text-xs text-slate-400 mt-1">{t("escalar")}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">{t("camp2")}</div>
                    <div className="font-semibold text-white">{t("frecuenciaAlta")}</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-yellow-500 font-bold text-xl">5.4</div>
                    <div className="text-xs text-slate-400 mt-1">{t("cambiar")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos decorativos traseros */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B6B] to-[#00D4AA] opacity-10 blur-2xl -z-10 rounded-3xl" />
          </div>
        </div>
      </section>

      {/* 3. Pain Points (3 Columnas) */}
      <section id="como-funciona" className="py-24 bg-[#080D18] border-y border-white/5 w-full animate-on-scroll">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">{t("painTitle")}</h2>
            <p className="text-slate-400 text-xl">{t("painSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 text-red-500">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("pain1Title")}</h3>
              <p className="text-slate-400 leading-relaxed">{t("pain1Desc")}</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-500">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("pain2Title")}</h3>
              <p className="text-slate-400 leading-relaxed">{t("pain2Desc")}</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("pain3Title")}</h3>
              <p className="text-slate-400 leading-relaxed">{t("pain3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features (3 Columnas) */}
      <section id="caracteristicas" className="py-24 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display">{t("featTitle")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center animate-on-scroll" style={{ transitionDelay: '0ms' }}>
              <div className="w-20 h-20 bg-[#131D2E] border border-white/10 rounded-3xl flex items-center justify-center mb-6 text-[#FF6B6B] shadow-lg">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("feat1Title")}</h3>
              <p className="text-gray-400 text-lg">{t("feat1Desc")}</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center animate-on-scroll" style={{ transitionDelay: '100ms' }}>
              <div className="w-20 h-20 bg-[#131D2E] border border-white/10 rounded-3xl flex items-center justify-center mb-6 text-[#00D4AA] shadow-lg">
                <TrendingUp className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("feat2Title")}</h3>
              <p className="text-gray-400 text-lg">{t("feat2Desc")}</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center animate-on-scroll" style={{ transitionDelay: '200ms' }}>
              <div className="w-20 h-20 bg-[#131D2E] border border-white/10 rounded-3xl flex items-center justify-center mb-6 text-yellow-400 shadow-lg">
                <Repeat className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("feat3Title")}</h3>
              <p className="text-gray-400 text-lg">{t("feat3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Precios */}
      <section id="precios" className="py-24 bg-[#080D18] border-y border-white/5 relative overflow-hidden w-full animate-on-scroll">
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#FF6B6B]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">{t("pricingTitle")}</h2>
            <p className="text-gray-400 text-xl">{t("pricingSubtitle")}</p>
          </div>

          <DynamicPricingForm copRate={estimatedCop / 47} isLanding={true} />

        </div>
      </section>

      {/* 5.5 FAQs */}
      <section id="faq" className="py-24 w-full">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display">{t("faqTitle")}</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <details key={num} className="group bg-slate-900 rounded-2xl border border-slate-700 shadow-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden animate-on-scroll" style={{ transitionDelay: `${num * 100}ms` }}>
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
      <section id="cta" className="relative py-24 bg-[#080D18] border-y border-white/5 w-full overflow-hidden text-center animate-on-scroll">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#FF6B6B]/20 to-[#00D4AA]/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 w-full">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight font-display">
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

      {/* 6. Footer */}
      <Footer />
    </main>
  );
}
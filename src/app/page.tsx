import Link from "next/link";
import { ArrowRight, Search, TrendingUp, Clock, AlertTriangle, CheckCircle2, Zap, Repeat, Shield, Users, ShoppingCart, Briefcase, Eye, Brain, BarChart3, Mail } from "lucide-react";
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
    <main className="flex min-h-screen flex-col bg-[#0a0f1e] text-[#f8fafc] font-sans selection:bg-[#ef4444]/20">
      <ScrollAnimations />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 pb-20 overflow-hidden w-full">
        <div className="glow-red" style={{ top: '10%', left: '-15%', width: '600px', height: '600px' }} />
        <div className="glow-green" style={{ bottom: '-10%', right: '-15%', width: '700px', height: '700px' }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full px-6 max-w-7xl mx-auto relative z-10 w-full">
          {/* Left Column */}
          <div className="max-w-2xl text-left" style={{ animation: 'fadeSlideUp 0.8s ease forwards' }}>
            <div className="badge-glow mb-6">
              <Zap className="w-3.5 h-3.5" /> {t("heroBadge")}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-[68px] font-extrabold leading-[1.05] mb-6 tracking-tight font-display">
              {t("heroTitle")} <br className="hidden md:block" />
              <span className="gradient-text">{t("heroTitleHighlight")}</span>
            </h1>
            <p className="text-lg text-slate-400 mb-2 leading-relaxed max-w-xl">
              {t("heroDesc")}
            </p>
            <p className="text-sm text-slate-500 mb-8 max-w-xl">
              {t("heroDescSub")}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/conectar" className="gradient-btn inline-flex text-white px-8 py-4 rounded-full text-base font-bold items-center gap-3">
                {t("cta")} <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-slate-500">{t("readonly")}</p>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-[#0a0f1e]" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-[#0a0f1e]" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-[#0a0f1e]" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-[#0a0f1e]" />
              </div>
              <span className="text-xs text-slate-500"><strong className="text-emerald-400">+50 cuentas</strong> auditadas esta semana</span>
            </div>
          </div>

          {/* Right Column - Scrollable Mockup */}
          <div className="relative w-full max-w-lg mx-auto lg:mr-0 lg:ml-auto" style={{ animation: 'fadeSlideUp 0.8s ease forwards', animationDelay: '300ms', opacity: 0 }}>
            <div className="glass-card p-5 relative">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-semibold tracking-wide">{t("live")}</span>
              </div>

              {/* Scrollable findings */}
              <div className="scroll-container">
                <div className="scroll-item w-[280px]">
                  <div className="p-4 rounded-xl bg-red-500/[0.08] border border-red-500/20">
                    <div className="text-xs text-slate-400 mb-1">{t("camp1")}</div>
                    <div className="font-semibold text-white text-sm">{t("roasActual")}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-red-400 font-bold text-xl flex items-center gap-1"><TrendingUp className="w-4 h-4 rotate-180" /> 0.8x</span>
                      <span className="text-[10px] text-red-400/70 bg-red-400/10 px-2 py-0.5 rounded-full">{t("pausar")}</span>
                    </div>
                  </div>
                </div>

                <div className="scroll-item w-[280px]">
                  <div className="p-4 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20">
                    <div className="text-xs text-emerald-400 mb-1 font-medium">{t("oportunidad")}</div>
                    <div className="font-semibold text-white text-sm">{t("anuncioVideo")}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-emerald-400 font-bold text-xl flex items-center gap-1"><TrendingUp className="w-4 h-4" /> 4.2x</span>
                      <span className="text-[10px] text-emerald-400/70 bg-emerald-400/10 px-2 py-0.5 rounded-full">{t("escalar")}</span>
                    </div>
                  </div>
                </div>

                <div className="scroll-item w-[280px]">
                  <div className="p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/20">
                    <div className="text-xs text-slate-400 mb-1">{t("camp2")}</div>
                    <div className="font-semibold text-white text-sm">{t("frecuenciaAlta")}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-amber-400 font-bold text-xl">5.4</span>
                      <span className="text-[10px] text-amber-400/70 bg-amber-400/10 px-2 py-0.5 rounded-full">{t("cambiar")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-3 md:hidden">
                  <div className="w-5 h-1 rounded-full bg-emerald-400/60" />
                  <div className="w-1.5 h-1 rounded-full bg-white/20" />
                  <div className="w-1.5 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] text-slate-500 ml-2">Desliza para ver más</span>
              </div>

              {/* Score bar */}
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Score: 72/100 — Tu cuenta tiene potencial</span>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 opacity-[0.06] blur-3xl -z-10 rounded-3xl" />
          </div>
        </div>
      </section>

      {/* Pain Points - Horizontal Scroll */}
      <section id="como-funciona" className="py-24 bg-[#080d18] border-y border-white/[0.04] w-full animate-on-scroll">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">{t("painTitle")}</h2>
            <p className="text-slate-400 text-lg">{t("painSubtitle")}</p>
          </div>

          <div className="scroll-container md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            <div className="scroll-item w-[300px] md:w-auto glass-card p-7 transition-all duration-300 hover:border-red-500/20">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-5 text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{t("pain1Title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t("pain1Desc")}</p>
            </div>
            <div className="scroll-item w-[300px] md:w-auto glass-card p-7 transition-all duration-300 hover:border-amber-500/20">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-5 text-amber-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{t("pain2Title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t("pain2Desc")}</p>
            </div>
            <div className="scroll-item w-[300px] md:w-auto glass-card p-7 transition-all duration-300 hover:border-blue-500/20">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 text-blue-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">{t("pain3Title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t("pain3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Horizontal Scroll */}
      <section id="caracteristicas" className="py-24 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-display">{t("featTitle")}</h2>
          </div>

          <div className="scroll-container md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
            <div className="scroll-item w-[300px] md:w-auto glass-card p-7 flex flex-col items-center text-center transition-all duration-300 hover:border-red-500/20 animate-on-scroll">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/10 rounded-2xl flex items-center justify-center mb-5 text-red-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("feat1Title")}</h3>
              <p className="text-slate-400 text-sm">{t("feat1Desc")}</p>
            </div>
            <div className="scroll-item w-[300px] md:w-auto glass-card p-7 flex flex-col items-center text-center transition-all duration-300 hover:border-emerald-500/20 animate-on-scroll" style={{ transitionDelay: '100ms' }}>
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/10 rounded-2xl flex items-center justify-center mb-5 text-emerald-400">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("feat2Title")}</h3>
              <p className="text-slate-400 text-sm">{t("feat2Desc")}</p>
            </div>
            <div className="scroll-item w-[300px] md:w-auto glass-card p-7 flex flex-col items-center text-center transition-all duration-300 hover:border-amber-500/20 animate-on-scroll" style={{ transitionDelay: '200ms' }}>
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/10 rounded-2xl flex items-center justify-center mb-5 text-amber-400">
                <Repeat className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t("feat3Title")}</h3>
              <p className="text-slate-400 text-sm">{t("feat3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section id="seguridad" className="py-24 bg-[#080d18] border-y border-white/[0.04] w-full animate-on-scroll">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">{t("securityTitle")}</h2>
            <p className="text-slate-400 text-lg">{t("securitySubtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-5 text-center transition-all duration-300 hover:border-emerald-500/20">
              <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3 text-emerald-400 mx-auto">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">{t("sec1Title")}</h3>
              <p className="text-slate-500 text-xs">{t("sec1Desc")}</p>
            </div>
            <div className="glass-card p-5 text-center transition-all duration-300 hover:border-emerald-500/20">
              <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3 text-emerald-400 mx-auto">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">{t("sec2Title")}</h3>
              <p className="text-slate-500 text-xs">{t("sec2Desc")}</p>
            </div>
            <div className="glass-card p-5 text-center transition-all duration-300 hover:border-emerald-500/20">
              <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3 text-emerald-400 mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">{t("sec3Title")}</h3>
              <p className="text-slate-500 text-xs">{t("sec3Desc")}</p>
            </div>
            <div className="glass-card p-5 text-center transition-all duration-300 hover:border-emerald-500/20">
              <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3 text-emerald-400 mx-auto">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">{t("sec4Title")}</h3>
              <p className="text-slate-500 text-xs">{t("sec4Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section id="perfiles" className="py-24 w-full animate-on-scroll">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">{t("profilesTitle")}</h2>
            <p className="text-slate-400 text-lg">{t("profilesSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-7 transition-all duration-300 hover:border-red-500/20 animate-on-scroll">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-5 text-red-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("profile1Title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{t("profile1Desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {t("profile1Perk1")}</li>
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {t("profile1Perk2")}</li>
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {t("profile1Perk3")}</li>
              </ul>
            </div>
            <div className="glass-card p-7 transition-all duration-300 hover:border-emerald-500/20 animate-on-scroll" style={{ transitionDelay: '100ms' }}>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("profile2Title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{t("profile2Desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {t("profile2Perk1")}</li>
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {t("profile2Perk2")}</li>
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {t("profile2Perk3")}</li>
              </ul>
            </div>
            <div className="glass-card p-7 transition-all duration-300 hover:border-amber-500/20 animate-on-scroll" style={{ transitionDelay: '200ms' }}>
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-5 text-amber-400">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{t("profile3Title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{t("profile3Desc")}</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {t("profile3Perk1")}</li>
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {t("profile3Perk2")}</li>
                <li className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> {t("profile3Perk3")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Ritual */}
      <section id="semanal" className="py-24 bg-[#080d18] border-y border-white/[0.04] w-full animate-on-scroll">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">{t("weeklyTitle")}</h2>
            <p className="text-slate-400 text-lg">{t("weeklySubtitle")}</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-red-500 via-amber-500 to-emerald-500 hidden md:block opacity-30" />
            <div className="space-y-6">
              <div className="flex gap-5 items-start animate-on-scroll">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 flex-shrink-0 border border-red-500/20">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1">{t("week1Title")}</h3>
                  <p className="text-slate-400 text-sm">{t("week1Desc")}</p>
                </div>
              </div>
              <div className="flex gap-5 items-start animate-on-scroll">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 flex-shrink-0 border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1">{t("week2Title")}</h3>
                  <p className="text-slate-400 text-sm">{t("week2Desc")}</p>
                </div>
              </div>
              <div className="flex gap-5 items-start animate-on-scroll">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 flex-shrink-0 border border-blue-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1">{t("week3Title")}</h3>
                  <p className="text-slate-400 text-sm">{t("week3Desc")}</p>
                </div>
              </div>
              <div className="flex gap-5 items-start animate-on-scroll">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 flex-shrink-0 border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-1">{t("week4Title")}</h3>
                  <p className="text-slate-400 text-sm">{t("week4Desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What makes us different */}
      <section id="diferencial" className="py-24 w-full animate-on-scroll">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">{t("diffTitle")}</h2>
            <p className="text-slate-400 text-lg">{t("diffSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-7 border-red-500/15">
              <h3 className="text-base font-bold mb-4 text-red-400">{t("diffOthersTitle")}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-400 text-sm"><span className="text-red-400 mt-0.5">&#10005;</span> {t("diffOthers1")}</li>
                <li className="flex items-start gap-3 text-slate-400 text-sm"><span className="text-red-400 mt-0.5">&#10005;</span> {t("diffOthers2")}</li>
                <li className="flex items-start gap-3 text-slate-400 text-sm"><span className="text-red-400 mt-0.5">&#10005;</span> {t("diffOthers3")}</li>
                <li className="flex items-start gap-3 text-slate-400 text-sm"><span className="text-red-400 mt-0.5">&#10005;</span> {t("diffOthers4")}</li>
              </ul>
            </div>
            <div className="glass-card p-7 border-emerald-500/20">
              <h3 className="text-base font-bold mb-4 text-emerald-400">{t("diffAditorTitle")}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> {t("diffAditor1")}</li>
                <li className="flex items-start gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> {t("diffAditor2")}</li>
                <li className="flex items-start gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> {t("diffAditor3")}</li>
                <li className="flex items-start gap-3 text-slate-300 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> {t("diffAditor4")}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" className="py-24 bg-[#080d18] border-y border-white/[0.04] relative overflow-hidden w-full animate-on-scroll">
        <div className="glow-red" style={{ top: '20%', right: '-10%', width: '400px', height: '400px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-display">{t("pricingTitle")}</h2>
            <p className="text-slate-400 text-lg">{t("pricingSubtitle")}</p>
          </div>
          <DynamicPricingForm copRate={estimatedCop / 47} isLanding={true} />
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-24 w-full">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-display">{t("faqTitle")}</h2>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <details key={num} className="group glass-card overflow-hidden [&_summary::-webkit-details-marker]:hidden animate-on-scroll" style={{ transitionDelay: `${num * 80}ms` }}>
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-base text-white">
                  <span>{t(`faq${num}Q` as any)}</span>
                  <span className="transition group-open:rotate-180 text-slate-500">
                    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed">
                  {t(`faq${num}A` as any)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="relative py-24 bg-[#080d18] border-y border-white/[0.04] w-full overflow-hidden text-center animate-on-scroll">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/10 to-orange-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 w-full">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight font-display">
            {t("ctaSectionTitle")}
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            {t("ctaSectionSubtitle")}
          </p>
          <Link href="/conectar" className="gradient-btn inline-flex text-white px-10 py-4 rounded-full text-lg font-bold items-center gap-3">
            {t("ctaSectionBtn")} <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-5 text-xs text-slate-500">
            {t("ctaSectionMicrocopy")}
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
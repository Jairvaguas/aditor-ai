import Link from "next/link";
import { ArrowRight, Search, TrendingUp, Clock, AlertTriangle, CheckCircle2, Zap, Repeat } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0B1120] text-[#F0F0F0] font-sans selection:bg-[#FF6B6B]/30">
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
              <Zap className="w-4 h-4" /> Primera auditoría gratis
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              Deja de quemar dinero en <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53]">
                Meta Ads.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
              Conecta tu cuenta en 3 clicks. Nuestra IA audita tus campañas y te dice exactamente qué pausar, qué escalar y qué cambiar para disparar tu ROAS.
            </p>
            <div className="flex justify-start">
              <Link href="/conectar" className="inline-flex bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-4 rounded-full text-lg font-bold transition-all text-center items-center justify-center gap-3 shadow-[0_8px_24px_rgba(255,107,107,0.25)] hover:shadow-[0_12px_32px_rgba(255,107,107,0.4)] hover:-translate-y-1">
                Auditar mis campañas <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500 font-medium">✨ Solo lectura. No modificamos tus anuncios.</p>
          </div>

          {/* Columna Derecha: Mockup Animado */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 w-full max-w-lg mx-auto lg:mr-0 lg:ml-auto">
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-2xl relative transform lg:rotate-2 lg:hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">En vivo</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Campaña: Conversiones Q3</div>
                    <div className="font-semibold text-white">ROAS Actual</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-[#FF6B6B] font-bold text-xl flex items-center sm:justify-end gap-1"><TrendingUp className="w-4 h-4 rotate-180" /> 0.8x</div>
                    <div className="text-xs text-slate-400 mt-1">Pausar inmediatamente</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#00D4AA]/30 bg-[#00D4AA]/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00D4AA]" />
                  <div>
                    <div className="text-sm text-[#00D4AA] mb-1 font-medium">Oportunidad detectada</div>
                    <div className="font-semibold text-white">Anuncio "Video Testimonial"</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-[#00D4AA] font-bold text-xl flex items-center sm:justify-end gap-1"><TrendingUp className="w-4 h-4" /> 4.2x</div>
                    <div className="text-xs text-slate-400 mt-1">Escalar presupuesto 20%</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Campaña: Retargeting</div>
                    <div className="font-semibold text-white">Frecuencia Alta</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-yellow-500 font-bold text-xl">5.4</div>
                    <div className="text-xs text-slate-400 mt-1">Cambiar creativos pronto</div>
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
      <section id="como-funciona" className="py-24 bg-[#080D18] border-y border-white/5 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Cuánto te está costando no auditar tus ads?</h2>
            <p className="text-slate-400 text-xl">El Administrador de Anuncios es complejo. Si no lo analizas constantemente, estás perdiendo dinero todos los días.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 text-red-500">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Presupuesto quemado</h3>
              <p className="text-slate-400 leading-relaxed">Campañas fantasma que consumen tu saldo diario sin traer un solo cliente. Aditor las detecta al instante.</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-500">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Decisiones sin datos</h3>
              <p className="text-slate-400 leading-relaxed">Apagar anuncios buenos por intuición o escalar los equivocados. La IA cruza métricas que el ojo humano omite.</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4">Sin tiempo para analizar</h3>
              <p className="text-slate-400 leading-relaxed">Pasar horas cruzando datos en Excel es inviable. Recibe un reporte listo para ejecutar en menos de 3 minutos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features (3 Columnas) */}
      <section id="caracteristicas" className="py-24 w-full">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Tu cuenta, pero rentable.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#131D2E] border border-white/10 rounded-3xl flex items-center justify-center mb-6 text-[#FF6B6B] shadow-lg">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Diagnóstico Profundo</h3>
              <p className="text-gray-400 text-lg">Analizamos el funnel completo: desde el CTR del anuncio hasta la tasa de conversión en tu landing page.</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#131D2E] border border-white/10 rounded-3xl flex items-center justify-center mb-6 text-[#00D4AA] shadow-lg">
                <TrendingUp className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Plan de Acción Claro</h3>
              <p className="text-gray-400 text-lg">Nada de dashboards confusos. Te decimos "Sube un 15% aquí" y "Pausa este creativo urgente".</p>
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#131D2E] border border-white/10 rounded-3xl flex items-center justify-center mb-6 text-yellow-400 shadow-lg">
                <Repeat className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Auditoría Recurrente</h3>
              <p className="text-gray-400 text-lg">Con el plan Pro, la IA revisa tu cuenta cada semana para asegurar que el rendimiento no caiga.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Precios */}
      <section id="precios" className="py-24 bg-[#080D18] border-y border-white/5 relative overflow-hidden w-full">
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#FF6B6B]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Invierte en optimización.</h2>
            <p className="text-gray-400 text-xl">Un solo reporte puede ahorrarte 10 veces el valor de la suscripción.</p>
          </div>

          <div className="max-w-xl mx-auto bg-[#131D2E] rounded-3xl border border-[#FF6B6B]/30 p-10 shadow-2xl relative">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53] text-white text-sm font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
                Más popular
              </span>
            </div>

            <h3 className="text-3xl font-bold mb-3">Plan Profesional</h3>
            <p className="text-gray-400 text-lg mb-8">Todo lo que necesitas para dominar Meta Ads.</p>
            <div className="mb-10 border-b border-white/10 pb-10">
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-extrabold text-white">$185.000</span>
                <span className="text-gray-500 font-medium text-xl">COP / mes</span>
              </div>
              <p className="text-base text-[#00D4AA] font-medium mt-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Incluye 7 días de prueba gratis
              </p>
            </div>

            <ul className="space-y-5 mb-10">
              {['Auditorías ilimitadas de todas tus cuentas', 'Recomendaciones de IA avanzadas', 'Generador de copys y hooks', 'Soporte prioritario'].map((feature, i) => (
                <li key={i} className="flex items-start gap-4 text-gray-300 text-lg">
                  <CheckCircle2 className="w-6 h-6 text-[#00D4AA] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/subscribe" className="block w-full text-center bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-5 rounded-xl text-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(255,107,107,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,107,0.23)] hover:-translate-y-0.5">
              Iniciar prueba gratis
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <Footer />
    </main>
  );
}
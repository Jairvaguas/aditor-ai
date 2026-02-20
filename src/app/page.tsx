import Link from "next/link";
import { ArrowRight, Search, TrendingUp, Clock, AlertTriangle, CheckCircle2, Zap, Repeat } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0B1120] text-[#F0F0F0] font-sans selection:bg-[#FF6B6B]/30">
      {/* 1. Navbar Fija */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0B1120]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B6B] to-[#ff8e53] flex items-center justify-center font-bold text-white text-lg">A</div>
            <span className="text-xl font-bold tracking-tight">Aditor AI</span>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#caracteristicas" className="hover:text-white transition-colors">Beneficios</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/registro" className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/conectar" className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,107,107,0.3)] hover:shadow-[0_0_25px_rgba(255,107,107,0.5)]">
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section (2 Columnas) */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#FF6B6B]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00D4AA]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
          {/* Columna Izquierda: Texto */}
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00D4AA]/30 bg-[#00D4AA]/10 text-[#00D4AA] text-xs font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3.5 h-3.5" /> Primera auditoría gratis
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              Deja de quemar dinero en <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53]">
                Meta Ads.
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
              Conecta tu cuenta en 3 clicks. Nuestra IA audita tus campañas y te dice exactamente qué pausar, qué escalar y qué cambiar para disparar tu ROAS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/conectar" className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-4 rounded-xl text-lg font-bold transition-all text-center flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,107,107,0.25)] hover:shadow-[0_12px_32px_rgba(255,107,107,0.4)] hover:-translate-y-1">
                Auditar mis campañas <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500 font-medium">✨ Solo lectura. No modificamos tus anuncios.</p>
          </div>

          {/* Columna Derecha: Mockup Animado */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="bg-[#131D2E] border border-white/5 rounded-2xl p-6 shadow-2xl relative z-10 transform lg:rotate-2 lg:hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs font-mono text-gray-500">aditor_report_v2.json</div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Campaña: Conversiones Q3</div>
                    <div className="font-semibold text-white">ROAS Actual</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#FF6B6B] font-bold text-xl flex items-center gap-1 justify-end"><TrendingUp className="w-4 h-4 rotate-180" /> 0.8x</div>
                    <div className="text-xs text-gray-500">Pausar inmediatamente</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#00D4AA]/30 bg-[#00D4AA]/5 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00D4AA]" />
                  <div>
                    <div className="text-sm text-[#00D4AA] mb-1 font-medium">Oportunidad detectada</div>
                    <div className="font-semibold text-white">Anuncio "Video Testimonial"</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#00D4AA] font-bold text-xl flex items-center gap-1 justify-end"><TrendingUp className="w-4 h-4" /> 4.2x</div>
                    <div className="text-xs text-gray-400">Escalar presupuesto 20%</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Campaña: Retargeting</div>
                    <div className="font-semibold text-white">Frecuencia Alta</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-500 font-bold text-xl">5.4</div>
                    <div className="text-xs text-gray-500">Cambiar creativos pronto</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos decorativos traseros */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B6B] to-[#00D4AA] opacity-20 blur-2xl -z-10 rounded-3xl" />
          </div>
        </div>
      </section>

      {/* 3. Pain Points (3 Columnas) */}
      <section id="como-funciona" className="py-24 bg-[#080D18] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Cuánto te está costando no auditar tus ads?</h2>
            <p className="text-gray-400 text-lg">El Administrador de Anuncios es complejo. Si no lo analizas constantemente, estás perdiendo dinero todos los días.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#131D2E] p-8 rounded-2xl border border-white/5">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Presupuesto quemado</h3>
              <p className="text-gray-400 leading-relaxed">Campañas fantasma que consumen tu saldo diario sin traer un solo cliente. Aditor las detecta al instante.</p>
            </div>
            <div className="bg-[#131D2E] p-8 rounded-2xl border border-white/5">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-yellow-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Decisiones sin datos</h3>
              <p className="text-gray-400 leading-relaxed">Apagar anuncios buenos por intuición o escalar los equivocados. La IA cruza métricas que el ojo humano omite.</p>
            </div>
            <div className="bg-[#131D2E] p-8 rounded-2xl border border-white/5">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sin tiempo para analizar</h3>
              <p className="text-gray-400 leading-relaxed">Pasar horas cruzando datos en Excel es inviable. Recibe un reporte listo para ejecutar en menos de 3 minutos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features (3 Columnas) */}
      <section id="caracteristicas" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Tu cuenta, pero rentable.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#131D2E] border border-white/10 rounded-2xl flex items-center justify-center mb-6 text-[#FF6B6B]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Diagnóstico Profundo</h3>
              <p className="text-gray-400">Analizamos el funnel completo: desde el CTR del anuncio hasta la tasa de conversión en tu landing page.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#131D2E] border border-white/10 rounded-2xl flex items-center justify-center mb-6 text-[#00D4AA]">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Plan de Acción Claro</h3>
              <p className="text-gray-400">Nada de dashboards confusos. Te decimos "Sube un 15% aquí" y "Pausa este creativo urgente".</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#131D2E] border border-white/10 rounded-2xl flex items-center justify-center mb-6 text-yellow-400">
                <Repeat className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Auditoría Recurrente</h3>
              <p className="text-gray-400">Con el plan Pro, la IA revisa tu cuenta cada semana para asegurar que el rendimiento no caiga.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Precios */}
      <section id="precios" className="py-24 bg-[#080D18] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#FF6B6B]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Invierte en optimización.</h2>
            <p className="text-gray-400 text-lg">Un solo reporte puede ahorrarte 10 veces el valor de la suscripción.</p>
          </div>

          <div className="max-w-lg mx-auto bg-[#131D2E] rounded-3xl border border-[#FF6B6B]/30 p-8 shadow-2xl relative">
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#ff8e53] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Más popular
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2">Plan Profesional</h3>
            <p className="text-gray-400 mb-6">Todo lo que necesitas para dominar Meta Ads.</p>
            <div className="mb-8 border-b border-white/10 pb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-white">$185.000</span>
                <span className="text-gray-500 font-medium">COP / mes</span>
              </div>
              <p className="text-sm text-[#00D4AA] font-medium mt-2">Incluye 7 días de prueba gratis</p>
            </div>

            <ul className="space-y-4 mb-8">
              {['Auditorías ilimitadas de todas tus cuentas', 'Recomendaciones de IA avanzadas', 'Generador de copys y hooks', 'Soporte prioritario'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-[#00D4AA] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/subscribe" className="block w-full text-center bg-white text-[#0B1120] hover:bg-gray-100 px-6 py-4 rounded-xl font-bold transition-colors">
              Iniciar prueba gratis
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-[#0B1120] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center font-bold text-gray-400 text-xs">A</div>
              <span className="font-bold text-gray-400">Aditor AI</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
              <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
              <Link href="/eliminar-datos" className="hover:text-white transition-colors">Eliminar Datos</Link>
              <a href="mailto:info@aditor-ai.com" className="hover:text-white transition-colors">Contacto</a>
            </div>

            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} Aditor AI.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
// Landing Teaser Asilada para Tráfico de Meta Ads.
"use client";

import Link from "next/link";
import { ArrowRight, Search, TrendingUp, Zap, CheckCircle2, AlertTriangle, Clock, Activity, Target, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TeaserLanding() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0B1120] text-[#F0F0F0] font-sans selection:bg-[#FF6B6B]/30 relative pb-24 md:pb-0">
      
      {/* 1. Hero Section (High Stakes) */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-12 pb-20 overflow-hidden w-full">
        {/* Glow Effects */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#FF6B6B]/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00D4AA]/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full px-6 max-w-7xl mx-auto relative z-10 w-full">
          {/* Columna Izquierda: Copy Puntiagudo */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-left"
          >
             {/* Logo Minimalista para dar confianza sin distraer */}
            <div className="mb-12 inline-block">
                <span className="text-2xl font-bold font-display tracking-tight text-white">Aditor<span className="text-[#00D4AA]">.ai</span></span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-sm font-bold uppercase tracking-widest mb-6">
              <Activity className="w-4 h-4" /> Alerta de Campañas
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight font-display">
              Deja de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#ff5252]">quemar presupuesto</span> en Facebook Ads.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
              Conecta tu cuenta publicitaria y descubre los anuncios basura que están drenando tu rentabilidad antes de que termine el día.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link href="/sign-up" className="inline-flex bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-4 rounded-full text-lg font-bold transition-all text-center items-center justify-center gap-3 shadow-[0_8px_24px_rgba(255,107,107,0.25)] hover:shadow-[0_12px_32px_rgba(255,107,107,0.4)] hover:-translate-y-1">
                Auditar mi cuenta gratis <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Conexión 100% segura. Acceso de solo lectura vía Meta API.</span>
                </div>
            </div>
          </motion.div>

          {/* Columna Derecha: Mockup 3D con Alertas */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 4, rotateY: -6 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full max-w-lg mx-auto lg:mr-0 lg:ml-auto perspective-[1200px]"
          >
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-2xl relative transition-transform duration-500 transform-style-3d">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-red-500 text-sm font-medium">3 Alertas Críticas</span>
                </div>
                <div className="text-xs text-slate-500">ROAS Global: <span className="text-red-400 font-bold">1.2x</span></div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  <div>
                    <div className="text-sm text-red-400 mb-1 font-medium">Fuga de Presupuesto</div>
                    <div className="font-semibold text-white">Campaña Retargeting</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-red-400 font-bold text-xl flex items-center sm:justify-end gap-1"><TrendingUp className="w-4 h-4 rotate-180" /> 0.8x</div>
                    <div className="text-xs text-slate-400 mt-1">Sugerencia: Pausar</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Fatiga Creativa</div>
                    <div className="font-semibold text-white">Imagen Producto 03</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-yellow-500 font-bold text-xl">5.4</div>
                    <div className="text-xs text-slate-400 mt-1">Frecuencia Alta</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#00D4AA]/30 bg-[#00D4AA]/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00D4AA]" />
                  <div>
                    <div className="text-sm text-[#00D4AA] mb-1 font-medium">Oportunidad de Escala</div>
                    <div className="font-semibold text-white">Video UGC - Testimonio</div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-[#00D4AA] font-bold text-xl flex items-center sm:justify-end gap-1"><TrendingUp className="w-4 h-4" /> 4.2x</div>
                    <div className="text-xs text-slate-400 mt-1">Aumentar 20%</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decoración trasera */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B6B] to-red-600 opacity-20 blur-2xl -z-10 rounded-3xl" />
          </motion.div>
        </div>
      </section>

      {/* 2. Social Proof */}
      <section className="py-10 border-y border-white/5 bg-[#080D18]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-70">
            <span className="text-sm text-slate-400 font-medium uppercase tracking-widest text-center">Tecnología Confiable</span>
            <div className="flex flex-wrap justify-center gap-8 items-center">
                <div className="text-white font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-blue-600 rounded-md"></div> Meta API</div>
                <div className="text-white font-bold text-xl drop-shadow-md">Vercel</div>
                <div className="text-white font-bold text-xl drop-shadow-md">Clerk Security</div>
            </div>
        </div>
      </section>

      {/* 3. The Why */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display"><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] via-[#a78bfa] to-[#c084fc]">¿Por qué necesitas esta auditoría?</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-[#131D2E] border border-white/10 rounded-3xl flex items-center justify-center mb-6 text-[#FF6B6B]">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Encuentra anuncios basura</h3>
              <p className="text-gray-400 text-lg">Detectamos exactamente qué campañas están gastando tu presupuesto sin generar retornos, para que las apagues hoy mismo.</p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-[#131D2E] border border-white/10 rounded-3xl flex items-center justify-center mb-6 text-[#00D4AA]">
                <TrendingUp className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Escala los ganadores</h3>
              <p className="text-gray-400 text-lg">Identificamos los anuncios que tienen el mayor ROAS oculto para que concentres tu dinero donde realmente funciona.</p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="bg-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-[#131D2E] border border-white/10 rounded-3xl flex items-center justify-center mb-6 text-yellow-400">
                <Clock className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Reportes en 60 segundos</h3>
              <p className="text-gray-400 text-lg">Sin agencias. Sin esperas. Conecta tu cuenta y recibe un diagnóstico completo, claro y sin lenguaje confuso.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. How it Works */}
      <section className="py-24 bg-[#080D18] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 w-full text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 font-display">Tan simple que asusta.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
            >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-2xl font-bold mb-4 border border-blue-500/30">1</div>
                <h3 className="text-xl font-bold mb-2">Crea tu cuenta</h3>
                <p className="text-slate-400">Regístrate en segundos.</p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center"
            >
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 text-2xl font-bold mb-4 border border-purple-500/30">2</div>
                <h3 className="text-xl font-bold mb-2">Conecta Meta</h3>
                <p className="text-slate-400">Acceso de solo lectura seguro.</p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center"
            >
                <div className="w-16 h-16 rounded-full bg-[#00D4AA]/10 flex items-center justify-center text-[#00D4AA] text-2xl font-bold mb-4 border border-[#00D4AA]/30">3</div>
                <h3 className="text-xl font-bold mb-2">Descubre fallas</h3>
                <p className="text-slate-400">Obtén tu reporte instantáneo.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Anti-audience (Polarización) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 w-full">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <motion.div 
                 initial={{ opacity: 0, x: -30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="bg-red-500/10 rounded-3xl p-8 sm:p-12 border border-red-500/20"
               >
                   <h2 className="text-3xl font-bold mb-6 text-red-500 font-display">¿Para quién NO es esto?</h2>
                   <ul className="space-y-4">
                       <li className="flex items-start gap-3 text-slate-300"><XCircle className="w-6 h-6 text-red-500 flex-shrink-0" /> Agencias con 100+ clientes y equipos dedicados de media buyers.</li>
                       <li className="flex items-start gap-3 text-slate-300"><XCircle className="w-6 h-6 text-red-500 flex-shrink-0" /> Empresas que gastan millones y usan herramientas de BI complejas.</li>
                   </ul>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
               >
                   <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display text-white">Esto es para el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-blue-400">emprendedor real.</span></h2>
                   <p className="text-xl text-slate-400 leading-relaxed">
                       Para ti, que revisas el Ads Manager desde el celular en el tráfico y no entiendes por qué las ventas bajaron.<br/><br/>
                       Para ti, que no tienes tiempo de estudiar 40 métricas confusas y solo necesitas que te digan: <strong>"Apaga este anuncio, sube el presupuesto de este otro".</strong>
                   </p>
               </motion.div>
           </div>
        </div>
      </section>

      {/* 6. Sticky CTA Mobile + Footer CTA Destkop */}
      <section className="py-24 bg-[#080D18] border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-8 font-display">No pierdas un dólar más.</h2>
            <Link href="/sign-up" className="hidden md:inline-flex bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-10 py-5 rounded-full text-xl font-bold transition-all items-center gap-3 shadow-[0_8px_24px_rgba(255,107,107,0.25)] hover:-translate-y-1">
                Crear cuenta y conectar Meta <ArrowRight className="w-6 h-6" />
            </Link>
        </div>
      </section>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#0B1120]/90 backdrop-blur-md border-t border-white/10 z-50">
        <Link href="/sign-up" className="flex bg-[#FF6B6B] active:bg-[#ff5252] text-white w-full py-4 rounded-xl text-lg font-bold transition-all justify-center items-center gap-2 shadow-lg">
           Auditar cuenta gratis <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

    </main>
  );
}

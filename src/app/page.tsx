import Link from "next/link";
import { ArrowRight, Search, TrendingUp, Repeat } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 relative overflow-hidden pt-20 md:pt-32">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E94560] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4ECDC4] rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-block px-4 py-1.5 rounded-full border border-[#FFE66D]/30 bg-[#FFE66D]/10 text-[#FFE66D] text-xs font-bold uppercase tracking-widest mb-2">
          ⚡ Primera auditoría gratis
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight font-syne">
          Tu Director de<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E94560] to-[#FFE66D]">
            Performance en IA
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto leading-relaxed">
          Conectá tu Meta Ads gratis. En 3 minutos la IA te dice exactamente qué pausar, qué escalar y qué cambiar.
        </p>

        {/* CTA Button */}
        <div className="pt-6 pb-2">
          <Link href="/conectar" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #E94560, #ff8e53)',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '14px',
            fontWeight: '700',
            fontSize: '16px',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(233,69,96,0.35)'
          }}>
            Auditar mis campañas gratis →
          </Link>
          <p className="text-xs text-gray-500 mt-3">
            Sin tarjeta. <span className="text-[#4ECDC4] font-semibold">Sin registro todavía.</span>
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-12 w-full max-w-4xl">
        {[
          { label: "1ra auditoría", value: "Gratis" },
          { label: "/ mes luego", value: "$47" },
          { label: "cada semana", value: "Auto" },
        ].map((stat, i) => (
          <div key={i} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm min-w-[120px] text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-[#FF6B6B] mb-0 font-syne leading-tight">{stat.value}</div>
            <div className="text-[10px] md:text-xs text-gray-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(233,69,96,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '20px' }}>🔍</div>
            <h3 style={{ color: '#FAFAFA', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>Detecta campañas que pierden plata</h3>
            <p style={{ color: '#8892A4', fontSize: '13px', lineHeight: '1.6' }}>Identifica qué campañas consumen presupuesto sin retorno antes de que sea tarde.</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(78,205,196,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '20px' }}>📈</div>
            <h3 style={{ color: '#FAFAFA', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>Dice qué escalar con confianza</h3>
            <p style={{ color: '#8892A4', fontSize: '13px', lineHeight: '1.6' }}>Encuentra oportunidades con ROAS alto y presupuesto bajo listas para crecer.</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ width: '40px', height: '40px', background: 'rgba(255,230,109,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '20px' }}>🔁</div>
            <h3 style={{ color: '#FAFAFA', fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>Auditoría automática cada lunes</h3>
            <p style={{ color: '#8892A4', fontSize: '13px', lineHeight: '1.6' }}>Nunca más te olvidés de revisar tus campañas. Llega sola a tu email.</p>
          </div>

        </div>
      </section>
    </main>
  );
}
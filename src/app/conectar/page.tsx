"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConnectPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120] text-[#F0F0F0] font-sans selection:bg-[#FF6B6B]/30 pt-32">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden mb-12">

        <div className="w-full max-w-[480px] mx-auto px-6 py-10 flex flex-col items-center text-center">

          {/* Title */}
          <h1 className="text-[28px] font-bold font-syne mb-3 leading-tight">
            Conectá tu cuenta de Meta Ads
          </h1>

          {/* Subtitle */}
          <p className="text-[#8892A4] text-[15px] leading-relaxed mb-8">
            Solo necesitás un clic. Vas a ver los primeros hallazgos gratis, sin registrarte.
          </p>

          {/* Permissions List */}
          <div className="w-full text-left bg-[#16213E] rounded-xl p-5 mb-8 border border-white/5">
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3 text-[13px] text-gray-300">
                <span className="text-[#4ECDC4] mt-0.5">✅</span>
                <span>Leer campañas y métricas (ROAS, CTR, CPM, CPC)</span>
              </li>
              <li className="flex items-start gap-3 text-[13px] text-gray-300">
                <span className="text-[#4ECDC4] mt-0.5">✅</span>
                <span>Ver creativos activos</span>
              </li>
              <li className="flex items-start gap-3 text-[13px] text-gray-300">
                <span className="text-[#4ECDC4] mt-0.5">✅</span>
                <span>Analizar frecuencia e impresiones</span>
              </li>
              <li className="flex items-start gap-3 text-[13px] text-gray-400">
                <span className="text-[#EE5253] mt-0.5">❌</span>
                <span>Modificar campañas — <span className="text-white font-semibold">nunca</span></span>
              </li>
              <li className="flex items-start gap-3 text-[13px] text-gray-400">
                <span className="text-[#EE5253] mt-0.5">❌</span>
                <span>Acceder a datos de pago — <span className="text-white font-semibold">nunca</span></span>
              </li>
            </ul>
          </div>

          {/* Facebook Button */}
          <button
            onClick={() => {
              console.log("FACEBOOK_APP_ID client side:", process.env.NEXT_PUBLIC_FACEBOOK_APP_ID);
              window.location.href = "https://www.facebook.com/dialog/oauth?client_id=1559690031775292&redirect_uri=https://www.aditor-ai.com/api/auth/callback&scope=ads_read&response_type=code";
            }}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-[16px] py-[14px] rounded-[14px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ boxShadow: '0 6px 20px rgba(24,119,242,0.35)' }}
          >
            {/* Facebook "f" icon */}
            <span className="font-bold text-[20px] leading-none mb-0.5">f</span>
            Conectar con Facebook
          </button>



          {/* Footer Text */}
          <p className="text-[#8892A4] text-[11px] mt-6">
            Conexión encriptada vía OAuth 2.0 · Nunca modificamos tus campañas
          </p>

        </div>
      </main>
      <Footer />
    </div>
  );
}
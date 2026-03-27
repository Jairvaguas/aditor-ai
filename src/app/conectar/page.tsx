"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { connectMetaAction } from "./actions";

export default function ConnectPage() {
  const { userId, isLoaded } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (isMobile && userId) {
      fetch('/api/auth/send-desktop-reminder', {
        method: 'POST',
        credentials: 'include',
      });
    }
  }, [isMobile, userId]);

  const isInAppBrowser = () => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent || navigator.vendor;
    return /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|Twitter|Line\/|musical_ly/i.test(ua);
  };

  const router = useRouter();
  const t = useTranslations("Conectar");

  useEffect(() => {
    if (isLoaded && !userId) {
      // Agregar un pequeño delay para que Clerk termine de inicializar en móvil
      const timer = setTimeout(() => {
        router.push("/login?redirect=/conectar");
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B1120] text-[#F0F0F0] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ECDC4]"></div>
      </div>
    );
  }

  // Si ya cargó pero no hay userId, no mostrar nada (el useEffect ya redirige)
  if (!userId) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120] text-[#F0F0F0] font-sans selection:bg-[#FF6B6B]/30 pt-32">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden mb-12">

        <div className="w-full max-w-[480px] mx-auto px-6 py-10 flex flex-col items-center text-center">

          {/* Title */}
          <h1 className="text-[28px] font-bold font-display mb-3 leading-tight">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-[#8892A4] text-[15px] leading-relaxed mb-8">
            {t("subtitle")}
          </p>

          {/* Permissions List */}
          <div className="w-full text-left bg-[#16213E] rounded-xl p-5 mb-8 border border-white/5">
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3 text-[13px] text-gray-300">
                <span className="text-[#4ECDC4] mt-0.5">✅</span>
                <span>{t("perm1")}</span>
              </li>
              <li className="flex items-start gap-3 text-[13px] text-gray-300">
                <span className="text-[#4ECDC4] mt-0.5">✅</span>
                <span>{t("perm2")}</span>
              </li>
              <li className="flex items-start gap-3 text-[13px] text-gray-300">
                <span className="text-[#4ECDC4] mt-0.5">✅</span>
                <span>{t("perm3")}</span>
              </li>
              <li className="flex items-start gap-3 text-[13px] text-gray-400">
                <span className="text-[#EE5253] mt-0.5">❌</span>
                <span dangerouslySetInnerHTML={{ __html: t.raw("perm4") || "" }} />
              </li>
              <li className="flex items-start gap-3 text-[13px] text-gray-400">
                <span className="text-[#EE5253] mt-0.5">❌</span>
                <span dangerouslySetInnerHTML={{ __html: t.raw("perm5") || "" }} />
              </li>
            </ul>
          </div>

          {isInAppBrowser() && (
            <div className="bg-yellow-100/10 border border-yellow-500/50 text-yellow-200 text-sm px-4 py-3 rounded-xl mb-6 text-left shadow-lg">
              ⚠️ <strong>Navegador In-App Detectado:</strong><br/>
              Para conectar tu cuenta de Meta sin errores, necesitamos que uses Safari o Chrome directamente.<br/><br/>
              ↳ Toca los 3 puntos (···) y selecciona <strong>"Abrir en navegador externo"</strong>.
            </div>
          )}

          {/* Action Area based on Mobile/Desktop */}
          {isMobile ? (
            <div className="w-full bg-blue-900 border border-blue-500 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">💻</div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Continuá desde tu computadora
              </h3>
              <p className="text-blue-200 text-sm mb-4">
                Te enviamos un email con el link para continuar. 
                Abrilo desde tu computadora para conectar Meta Ads.
              </p>
              <div className="bg-blue-800 rounded-lg p-3 mb-4">
                <p className="text-blue-100 text-xs font-mono">
                  aditor-ai.com/conectar
                </p>
              </div>
              <p className="text-blue-400 text-xs">
                ¿No recibiste el email? Revisá tu carpeta de spam.
              </p>
            </div>
          ) : (
            <form action={connectMetaAction} className="w-full mt-8 mb-4">
              <input type="hidden" name="userId" value={userId || ''} />
              <button
                type="submit"
                disabled={!userId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="font-bold">f</span>
                {t("connectBtn")}
              </button>
            </form>
          )}

          {/* Footer Text */}
          <p className="text-[#8892A4] text-[11px] mt-6">
            {t("footer")}
          </p>

        </div>
      </main>
      <Footer />
    </div>
  );
}
"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConnectPage() {
  const { userId, isLoaded } = useAuth();
  const [metaUrl, setMetaUrl] = useState<string>('');
  const [loadingUrl, setLoadingUrl] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const prefetchUrl = async () => {
      try {
        const res = await fetch('/api/auth/meta-connect-init-json', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-clerk-user-id': userId,
          },
        });
        const data = await res.json();
        if (data.redirectUrl) {
          setMetaUrl(data.redirectUrl);
        }
      } catch (err) {
        console.error('Error pre-fetching meta URL:', err);
      } finally {
        setLoadingUrl(false);
      }
    };
    
    prefetchUrl();
  }, [userId]);

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

          {/* Facebook Button */}
          {loadingUrl ? (
            <div className="w-full flex items-center justify-center gap-3 bg-[#1877F2]/70 text-white font-bold text-[16px] py-[14px] rounded-[14px] opacity-70 cursor-wait">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Preparando conexión...</span>
            </div>
          ) : metaUrl ? (
            <a
              href={metaUrl}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-bold text-[16px] py-[14px] rounded-[14px] transition-all transform hover:bg-[#166fe5] hover:scale-[1.02] active:scale-[0.98]"
              style={{ boxShadow: '0 6px 20px rgba(24,119,242,0.35)' }}
            >
              <span className="font-bold text-[20px] leading-none mb-0.5">f</span>
              {t("connectBtn")}
            </a>
          ) : (
            <div className="w-full bg-red-600/20 border border-red-500/50 text-red-200 text-sm font-semibold py-4 px-6 rounded-[14px] text-center">
              Error cargando. Recargá la página.
            </div>
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
import Link from "next/link";
import Image from "next/image";
import LanguageSelector from "./LanguageSelector";
import { useTranslations } from "next-intl";

export default function Navbar() {
    const t = useTranslations("Nav");
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/[0.06] py-3">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5">
                    <Image src="/favicon.png" alt="Aditor AI" width={28} height={28} />
                    <span className="text-xl font-bold tracking-tight text-white">Aditor AI</span>
                </Link>

                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                    <Link href="/#como-funciona" className="hover:text-white transition-colors duration-200">{t("howItWorks")}</Link>
                    <Link href="/#caracteristicas" className="hover:text-white transition-colors duration-200">{t("features")}</Link>
                    <Link href="/#precios" className="hover:text-white transition-colors duration-200">{t("pricing")}</Link>
                </div>

                <div className="flex items-center gap-4">
                    <LanguageSelector />
                    <Link href="/registro" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">
                        {t("login")}
                    </Link>
                    <Link href="/conectar" className="gradient-btn text-white px-5 py-2.5 rounded-full text-sm font-bold">
                        {t("startFree")}
                    </Link>
                </div>
            </div>
        </nav>
    );
}

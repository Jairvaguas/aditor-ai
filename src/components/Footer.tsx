import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("Footer");
    return (
        <footer className="bg-[#0a0f1e] py-16 border-t border-white/[0.04] w-full">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <Image src="/favicon.png" alt="Aditor AI" width={24} height={24} />
                        <span className="font-bold text-slate-500 text-sm">Aditor AI</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
                        <Link href="/privacidad" className="hover:text-slate-300 transition-colors duration-200">{t("privacy")}</Link>
                        <Link href="/terminos" className="hover:text-slate-300 transition-colors duration-200">{t("terms")}</Link>
                        <Link href="/eliminar-datos" className="hover:text-slate-300 transition-colors duration-200">{t("dataDelete")}</Link>
                        <a href="mailto:info@aditor-ai.com" className="hover:text-slate-300 transition-colors duration-200">{t("contact")}</a>
                    </div>
                    <div className="text-xs text-slate-700">
                        © {new Date().getFullYear()} Aditor AI
                    </div>
                </div>
            </div>
        </footer>
    );
}

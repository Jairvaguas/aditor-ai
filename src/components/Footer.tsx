import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("Footer");
    return (
        <footer className="bg-[#0B1120] py-24 border-t border-white/5 w-full">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Image src="/favicon.png" alt="Aditor AI" width={32} height={32} />
                        <span className="font-bold text-gray-400 text-lg">Aditor AI</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-base text-gray-500">
                        <Link href="/privacidad" className="hover:text-white transition-colors">{t("privacy")}</Link>
                        <Link href="/terminos" className="hover:text-white transition-colors">{t("terms")}</Link>
                        <Link href="/eliminar-datos" className="hover:text-white transition-colors">{t("dataDelete")}</Link>
                        <a href="mailto:info@aditor-ai.com" className="hover:text-white transition-colors">{t("contact")}</a>
                    </div>

                    <div className="text-sm text-gray-600">
                        © {new Date().getFullYear()} Aditor AI.
                    </div>
                </div>
            </div>
        </footer>
    );
}

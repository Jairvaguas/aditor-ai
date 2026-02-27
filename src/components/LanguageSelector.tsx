"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LanguageSelector() {
    const router = useRouter();
    const [locale, setLocale] = useState<"es" | "en">("es");

    useEffect(() => {
        // Al montar, leemos de localStorage según el requerimiento.
        const saved = localStorage.getItem('NEXT_LOCALE') as "es" | "en";
        if (saved && (saved === "es" || saved === "en")) {
            setLocale(saved);
            // Sincronizamos la cookie por si no está seteada (el servidor la necesita)
            document.cookie = `NEXT_LOCALE=${saved}; path=/; max-age=31536000`;
        }
    }, []);

    const toggleLanguage = () => {
        const nextLocale = locale === "es" ? "en" : "es";
        setLocale(nextLocale);

        // Guardamos en localStorage como fue requerido por el prompt
        localStorage.setItem("NEXT_LOCALE", nextLocale);

        // Sincronizamos con cookie para que los Server Components (SSR) de next-intl lo lean
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;

        // Recargamos silenciosamente los datos del servidor para que devuelvan el nuevo idioma
        router.refresh();
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
            title="Cambiar idioma / Change language"
        >
            <span className="text-lg leading-none">{locale === 'es' ? '🇪🇸' : '🇺🇸'}</span>
            <span className="text-white uppercase text-xs tracking-wider">{locale}</span>
        </button>
    );
}

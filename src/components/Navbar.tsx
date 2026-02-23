import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4">
            <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <Image src="/favicon.png" alt="Aditor AI" width={32} height={32} />
                    <span className="text-2xl font-bold tracking-tight text-white">Aditor AI</span>
                </Link>

                {/* These anchor links work best on the main landing page, but providing them anyway */}
                <div className="hidden md:flex gap-8 text-base font-medium text-gray-400">
                    <Link href="/#como-funciona" className="hover:text-white transition-colors">Cómo funciona</Link>
                    <Link href="/#caracteristicas" className="hover:text-white transition-colors">Beneficios</Link>
                    <Link href="/#precios" className="hover:text-white transition-colors">Precios</Link>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/registro" className="hidden sm:block text-base font-medium text-gray-300 hover:text-white transition-colors">
                        Iniciar sesión
                    </Link>
                    <Link href="/conectar" className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-6 py-3 rounded-full text-base font-bold transition-all shadow-[0_0_15px_rgba(255,107,107,0.3)] hover:shadow-[0_0_25px_rgba(255,107,107,0.5)]">
                        Empezar gratis
                    </Link>
                </div>
            </div>
        </nav>
    );
}

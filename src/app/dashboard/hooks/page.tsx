import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { checkSubscription } from "@/lib/checkSubscription";
import {
    Bell,
    Search,
    Sparkles,
    Settings,
    BarChart2,
    Wand2,
    Copy,
    LayoutTemplate,
    Lightbulb
} from "lucide-react";

export default async function HooksPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/registro");
    }

    const hasAccess = await checkSubscription(user.id);
    if (!hasAccess) {
        redirect("/subscribe");
    }

    const displayName = user.firstName || user.username || "Usuario";

    // Static examples of hooks for layout visualization
    const hooksList = [
        {
            id: 1,
            type: "Atención al Dolor",
            content: "«¿Sientes que el ROAS cae aunque subas tu presupuesto? Este error en tu retargeting te está robando ventas.»",
            angle: "Contraintuitivo / Miedo a la pérdida"
        },
        {
            id: 2,
            type: "Prueba Social Directa",
            content: "«Cómo 3,450 tiendas dejaron de depender del tráfico frío y aumentaron su LTV en 45 días.»",
            angle: "Curiosidad por casos de éxito"
        },
        {
            id: 3,
            type: "Oferta Irresistible",
            content: "«Deja de regalar descuentos. Así es como estructuramos una oferta que tus clientes se sientan tontos si la rechazan.»",
            angle: "Educacional / Valor percibo"
        }
    ];

    return (
        <main className="min-h-screen bg-[#0B1120] text-white font-sans flex overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF6B6B] opacity-[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00D4AA] opacity-[0.03] rounded-full blur-[150px]" />
            </div>

            {/* Sidebar Fixa (Desktop) */}
            <aside className="fixed top-0 left-0 w-64 h-full bg-[#0B1120] border-r border-slate-800 z-40 hidden lg:flex flex-col">
                <div className="h-20 flex items-center px-8 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/favicon.ico" alt="Aditor AI" width={32} height={32} />
                        <span className="text-xl font-bold font-syne text-white tracking-tight">Aditor AI</span>
                    </Link>
                </div>

                <div className="flex-1 py-8 px-4 flex flex-col gap-2">
                    <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menú Principal</div>

                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors">
                        <BarChart2 className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link href="/dashboard/auditorias" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors">
                        <Search className="w-5 h-5" />
                        <span>Auditorías</span>
                    </Link>

                    <Link href="/dashboard/hooks" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00D4AA]/10 text-[#00D4AA] font-medium transition-colors">
                        <Sparkles className="w-5 h-5" />
                        <span>Hooks IA</span>
                    </Link>

                    <Link href="/dashboard/config" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors mt-auto">
                        <Settings className="w-5 h-5" />
                        <span>Configuración</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative z-10 flex flex-col h-screen overflow-y-auto w-full">

                {/* Header Superior */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/50 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold font-syne text-white">Laboratorio de Hooks</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative cursor-pointer hover:bg-slate-700 transition-colors">
                            <Bell className="w-5 h-5 text-slate-300" />
                        </div>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 border-2 border-slate-700 hover:border-[#00D4AA] transition-colors",
                                }
                            }}
                        />
                    </div>
                </header>

                {/* Content */}
                <div className="p-8 pb-32 flex flex-col gap-8 max-w-6xl mx-auto w-full">

                    {/* Explicación y CTA */}
                    <div className="bg-gradient-to-r from-slate-900 to-[#131D2E] border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#00D4AA]/10 rounded-full blur-[40px] pointer-events-none"></div>
                        <div className="relative z-10 max-w-xl">
                            <h2 className="text-xl font-bold font-syne text-white mb-2 flex items-center gap-2">
                                <Lightbulb className="w-6 h-6 text-[#00D4AA]" />
                                Ideación de Copywriting Creativo
                            </h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Genera hooks y copies para tus anuncios basados en los datos y el rendimiento técnico de tus campañas analizadas por Aditor AI.
                            </p>
                        </div>
                        <button className="whitespace-nowrap flex items-center gap-2 py-3.5 px-6 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold text-sm shadow-[0_4px_14px_rgba(255,107,107,0.35)] hover:scale-[1.02] transition-transform relative z-10">
                            <Wand2 className="w-4 h-4" /> Generar nuevo hook
                        </button>
                    </div>

                    {/* Grid de Ejemplos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {hooksList.map((hook) => (
                            <div key={hook.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col group hover:border-[#00D4AA]/40 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20 line-clamp-1">
                                        {hook.type}
                                    </span>
                                    <div className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors" title="Copiar al portapapeles">
                                        <Copy className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-800/30 rounded-xl p-4 mb-4 border border-slate-800">
                                    <p className="text-sm text-slate-200 font-medium italic leading-relaxed">
                                        {hook.content}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-800/80">
                                    <LayoutTemplate className="w-3.5 h-3.5" />
                                    <span>Ángulo: <strong className="text-slate-400">{hook.angle}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 pb-5 pt-3 flex justify-around items-center z-50 px-2 transition-transform">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                    <BarChart2 className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Dashboard</span>
                </Link>

                <Link href="/dashboard/auditorias" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Auditorías</span>
                </Link>

                <Link href="/dashboard/hooks" className="flex flex-col items-center gap-1 text-[#00D4AA] w-16">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Hooks IA</span>
                </Link>

                <Link href="/dashboard/config" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Config</span>
                </Link>
            </div>
        </main>
    );
}

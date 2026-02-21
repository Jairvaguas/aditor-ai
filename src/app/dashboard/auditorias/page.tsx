import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { checkSubscription } from "@/lib/checkSubscription";
import { supabaseAdmin } from "@/lib/supabase";
import {
    Bell,
    Search,
    Sparkles,
    Settings,
    BarChart2,
    Calendar,
    Target,
    ArrowRight,
    SearchX
} from "lucide-react";

export default async function AuditoriasPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/registro");
    }

    const hasAccess = await checkSubscription(user.id);
    if (!hasAccess) {
        redirect("/subscribe");
    }

    const displayName = user.firstName || user.username || "Usuario";

    // Fetch audits for this user from Supabase
    // Using a robust query, but if the table doesn't have campaigns_analyzed, it will still safely return data
    const { data: auditsList } = await supabaseAdmin
        .from('audits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    const audits = auditsList || [];

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

                    <Link href="/dashboard/auditorias" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] font-medium transition-colors">
                        <Search className="w-5 h-5" />
                        <span>Auditorías</span>
                    </Link>

                    <Link href="/dashboard/hooks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors">
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
                        <h1 className="text-2xl font-bold font-syne text-white">Historial de Auditorías</h1>
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
                <div className="p-8 pb-32 flex flex-col gap-6 max-w-5xl mx-auto w-full">

                    <p className="text-slate-400 mb-2 text-sm">
                        Aquí encontrarás el registro histórico de todos los análisis generados por la IA para tus campañas.
                    </p>

                    {audits.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {audits.map((audit: any) => (
                                <div key={audit.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-colors flex flex-col group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700">
                                            <Calendar className="w-5 h-5 text-slate-300" />
                                        </div>
                                        {audit.status === 'completed' || audit.status === 'Completada' ? (
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20">
                                                Completada
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#ffe66d]/10 text-[#ffe66d] border border-[#ffe66d]/20">
                                                Pendiente
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base font-bold text-white mb-2 font-syne">
                                        {new Date(audit.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </h3>

                                    <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
                                        <Target className="w-4 h-4 text-slate-500" />
                                        <span>Campañas analizadas</span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-slate-800/80">
                                        <Link href={`/reporte/${audit.id}`} className="flex items-center justify-between text-sm font-bold text-[#FF6B6B] group-hover:text-[#ff8e53] transition-colors">
                                            <span>Ver reporte</span>
                                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-4">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <SearchX className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-bold font-syne text-white mb-2">Aún no tienes auditorías</h3>
                            <p className="text-sm text-slate-400 max-w-sm mb-6">
                                Conecta tu cuenta publicitaria de Meta Ads y activa la IA para generar tu primer reporte de rendimiento.
                            </p>
                            <Link href="/conectar" className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-sm py-3 px-6 rounded-xl transition-colors shadow-lg">
                                Conectar Meta Ads
                            </Link>
                        </div>
                    )}

                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 pb-5 pt-3 flex justify-around items-center z-50 px-2 transition-transform">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                    <BarChart2 className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Dashboard</span>
                </Link>

                <Link href="/dashboard/auditorias" className="flex flex-col items-center gap-1 text-[#FF6B6B] w-16">
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Auditorías</span>
                </Link>

                <Link href="/dashboard/hooks" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
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

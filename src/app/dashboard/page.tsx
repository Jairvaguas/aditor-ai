
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { checkSubscription } from "@/lib/checkSubscription";
import { supabaseAdmin } from "@/lib/supabase";
import {
    Bell,
    Search,
    Sparkles,
    Settings,
    BarChart2,
    TrendingUp,
    TrendingDown,
    DollarSign,
    MousePointer,
    Megaphone,
    CheckCircle2
} from "lucide-react";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/registro");
    }

    const hasAccess = await checkSubscription(user.id);
    if (!hasAccess) {
        redirect("/subscribe");
    }

    // Determine displayName
    const displayName = user.firstName || user.username || "Usuario";

    // 1. Fetch user profile from Supabase to check Meta connection status
    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('meta_access_token')
        .eq('clerk_user_id', user.id)
        .single();

    const isConnectedToMeta = !!profile?.meta_access_token;

    return (
        <main className="min-h-screen bg-[#1A1A2E] text-white font-sans pb-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E94560] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4ECDC4] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-md mx-auto">
                {/* Notch simulation */}
                <div className="w-[110px] h-[26px] bg-[#1A1A2E] rounded-b-[18px] mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-50"></div>

                {/* 1. Header */}
                <div className="pt-20 px-5 pb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold font-syne">
                            Hola, <span className="text-white">{displayName}</span> 👋
                        </h1>
                        <p className="text-[11px] text-[#8892A4] mt-1">23 campañas activas · Última auditoría: hoy</p>
                    </div>
                    <div className="w-[34px] h-[34px] bg-white/5 border border-white/10 rounded-[10px] flex items-center justify-center relative cursor-pointer">
                        <Bell className="w-4 h-4 text-white" />
                        <div className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[#FF6B6B] rounded-full"></div>
                    </div>
                </div>

                {/* Meta Connect Status Card */}
                <div className="mx-5 mb-4">
                    {isConnectedToMeta ? (
                        <div className="bg-slate-900/50 border border-green-500/30 rounded-[18px] p-4 flex flex-col items-center justify-center text-center">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="font-bold text-green-500 text-sm">Meta Ads conectado</span>
                            </div>
                            <p className="text-xs text-slate-400 mb-3 block">Analizando tus campañas de forma segura.</p>
                            <Link href="/conectar" className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-full transition-colors border border-slate-700">
                                Reconectar cuenta
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-slate-900 border border-[#FF6B6B] rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
                            <h3 className="text-lg font-bold text-white mb-2 font-syne">Conectar Meta Ads</h3>
                            <p className="text-sm text-slate-400 mb-5 px-2">
                                Habilita la lectura de campañas para iniciar tu primera auditoría automática.
                            </p>
                            <Link href="/conectar" className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-[14px] py-3 rounded-xl transition-transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(24,119,242,0.35)]">
                                <span className="font-bold text-[14px] leading-none mb-0.5">f</span>
                                Conectar Meta Ads
                            </Link>
                        </div>
                    )}
                </div>

                {/* 2. Auto Audit Card */}
                <div className="mx-5 mb-4 bg-gradient-to-br from-[#74B9FF]/12 to-[#4ECDC4]/12 border border-[#74B9FF]/25 rounded-[18px] p-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-[12px] font-bold text-[#74B9FF] flex items-center gap-1.5">
                            <span>🔁</span> Auditoría automática
                        </h4>
                        <div className="text-[9px] bg-[#74B9FF]/20 text-[#74B9FF] px-2.5 py-0.5 rounded-full font-bold">Activa</div>
                    </div>
                    <p className="text-[11px] text-[#8892A4] leading-snug">
                        Tu próxima auditoría automática es el <strong className="text-white">lunes</strong>. Recibirás un email cuando esté lista.
                    </p>
                </div>

                {/* 3. Metrics Row */}
                <div className="flex gap-4 px-5 pb-6 overflow-x-auto scrollbar-hide">
                    {/* ROAS */}
                    <div className="shrink-0 w-[120px] bg-slate-900 border border-slate-700 rounded-2xl p-5 flex flex-col">
                        <div className="text-xl mb-2">💰</div>
                        <div className="text-2xl font-extrabold font-syne text-[#FFE66D] leading-none mb-1">2.4x</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">ROAS Total</div>
                        <div className="text-xs font-semibold text-[#FF6B6B] flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" /> -0.3
                        </div>
                    </div>

                    {/* CTR */}
                    <div className="shrink-0 w-[120px] bg-slate-900 border border-slate-700 rounded-2xl p-5 flex flex-col">
                        <div className="text-xl mb-2">🖱️</div>
                        <div className="text-2xl font-extrabold font-syne text-[#4ECDC4] leading-none mb-1">1.8%</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">CTR Prom.</div>
                        <div className="text-xs font-semibold text-[#4ECDC4] flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> +0.2%
                        </div>
                    </div>

                    {/* CPM */}
                    <div className="shrink-0 w-[120px] bg-slate-900 border border-slate-700 rounded-2xl p-5 flex flex-col">
                        <div className="text-xl mb-2">📣</div>
                        <div className="text-2xl font-extrabold font-syne text-[#FF6B6B] leading-none mb-1">$14.2</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">CPM Prom.</div>
                        <div className="text-xs font-semibold text-[#FF6B6B]">
                            ▼ Alto
                        </div>
                    </div>

                    {/* Spend */}
                    <div className="shrink-0 w-[120px] bg-slate-900 border border-slate-700 rounded-2xl p-5 flex flex-col">
                        <div className="text-xl mb-2">💸</div>
                        <div className="text-2xl font-extrabold font-syne text-[#74B9FF] leading-none mb-1">$1,240</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2">Gasto 7d</div>
                        <div className="text-xs font-semibold text-[#74B9FF] flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> +15%
                        </div>
                    </div>
                </div>

                {/* 4. Manual Audit Button */}
                <div className="mx-5 mb-8">
                    <Link href="/teaser" className="max-w-xs mx-auto flex items-center justify-center gap-2 py-3.5 rounded-[14px] bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(255,107,107,0.35)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all">
                        <Sparkles className="w-4 h-4" /> Auditar ahora
                    </Link>
                    <p className="text-center text-[11px] text-slate-400 mt-3">Análisis manual fuera del ciclo semanal.</p>
                </div>

                {/* 5. Campaign List */}
                <div className="mx-5 mb-6">
                    <h3 className="text-sm font-bold font-syne mb-4 pl-1 text-white">Tus campañas</h3>
                    <div className="space-y-3">

                        {/* Campaign 1: Green */}
                        <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
                            <div className="w-2 h-2 rounded-full bg-[#4ECDC4] shadow-[0_0_6px_rgba(78,205,196,0.6)] shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate text-white">Retargeting 7 días</div>
                                <div className="text-xs text-slate-400 mt-0.5">$340 · ROAS 4.2x</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold font-syne text-[#4ECDC4]">4.2x</div>
                                <div className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">ROAS</div>
                            </div>
                        </div>

                        {/* Campaign 2: Yellow */}
                        <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
                            <div className="w-2 h-2 rounded-full bg-[#FFE66D] shadow-[0_0_6px_rgba(255,230,109,0.6)] shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate text-white">Lookalike 1% compradores</div>
                                <div className="text-xs text-slate-400 mt-0.5">$280 · ROAS 1.9x</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold font-syne text-[#FFE66D]">1.9x</div>
                                <div className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">ROAS</div>
                            </div>
                        </div>

                        {/* Campaign 3: Red */}
                        <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
                            <div className="w-2 h-2 rounded-full bg-[#FF6B6B] shadow-[0_0_6px_rgba(255,107,107,0.6)] shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate text-white">Intereses — Ropa Mujer</div>
                                <div className="text-xs text-slate-400 mt-0.5">$340 · ROAS 0.8x</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold font-syne text-[#FF6B6B]">0.8x</div>
                                <div className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">ROAS</div>
                            </div>
                        </div>

                        {/* Campaign 4: Green */}
                        <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
                            <div className="w-2 h-2 rounded-full bg-[#4ECDC4] shadow-[0_0_6px_rgba(78,205,196,0.6)] shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate text-white">Carrito abandonado</div>
                                <div className="text-xs text-slate-400 mt-0.5">$180 · ROAS 5.1x</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold font-syne text-[#4ECDC4]">5.1x</div>
                                <div className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">ROAS</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 6. Bottom Navigation */}
                <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700 pb-5 pt-3 flex justify-around items-center z-40 px-2 lg:hidden">
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#FF6B6B] w-16">
                        <BarChart2 className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Dashboard</span>
                    </Link>

                    <Link href="/dashboard/auditorias" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                        <Search className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Auditorías</span>
                    </Link>

                    <Link href="/hooks" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Hooks IA</span>
                    </Link>

                    <Link href="/dashboard/config" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Config</span>
                    </Link>
                </div>

            </div>
        </main>
    );
}

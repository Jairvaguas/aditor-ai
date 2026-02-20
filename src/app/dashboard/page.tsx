
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { checkSubscription } from "@/lib/checkSubscription";
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
    Megaphone
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
                <div className="pt-12 px-5 pb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-[17px] font-extrabold font-syne">
                            Hola, <span className="text-[#FF6B6B]">{displayName}</span> 👋
                        </h1>
                        <p className="text-[10px] text-[#8892A4] mt-0.5">23 campañas activas · Última auditoría: hoy</p>
                    </div>
                    <div className="w-[34px] h-[34px] bg-white/5 border border-white/10 rounded-[10px] flex items-center justify-center relative cursor-pointer">
                        <Bell className="w-4 h-4 text-white" />
                        <div className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-[#FF6B6B] rounded-full"></div>
                    </div>
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
                <div className="flex gap-2.5 px-5 pb-4 overflow-x-auto scrollbar-hide">
                    {/* ROAS */}
                    <div className="shrink-0 w-[105px] bg-white/5 border border-white/10 rounded-[14px] p-3 flex flex-col">
                        <div className="text-lg mb-1">💰</div>
                        <div className="text-[18px] font-extrabold font-syne text-[#FFE66D] leading-none mb-0.5">2.4x</div>
                        <div className="text-[9px] text-[#8892A4] uppercase tracking-wider font-bold mb-1">ROAS Total</div>
                        <div className="text-[10px] font-semibold text-[#FF6B6B] flex items-center gap-0.5">
                            <TrendingDown className="w-3 h-3" /> -0.3
                        </div>
                    </div>

                    {/* CTR */}
                    <div className="shrink-0 w-[105px] bg-white/5 border border-white/10 rounded-[14px] p-3 flex flex-col">
                        <div className="text-lg mb-1">🖱️</div>
                        <div className="text-[18px] font-extrabold font-syne text-[#4ECDC4] leading-none mb-0.5">1.8%</div>
                        <div className="text-[9px] text-[#8892A4] uppercase tracking-wider font-bold mb-1">CTR Prom.</div>
                        <div className="text-[10px] font-semibold text-[#4ECDC4] flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> +0.2%
                        </div>
                    </div>

                    {/* CPM */}
                    <div className="shrink-0 w-[105px] bg-white/5 border border-white/10 rounded-[14px] p-3 flex flex-col">
                        <div className="text-lg mb-1">📣</div>
                        <div className="text-[18px] font-extrabold font-syne text-[#FF6B6B] leading-none mb-0.5">$14.2</div>
                        <div className="text-[9px] text-[#8892A4] uppercase tracking-wider font-bold mb-1">CPM Prom.</div>
                        <div className="text-[10px] font-semibold text-[#FF6B6B]">
                            ▼ Alto
                        </div>
                    </div>

                    {/* Spend */}
                    <div className="shrink-0 w-[105px] bg-white/5 border border-white/10 rounded-[14px] p-3 flex flex-col">
                        <div className="text-lg mb-1">💸</div>
                        <div className="text-[18px] font-extrabold font-syne text-[#74B9FF] leading-none mb-0.5">$1,240</div>
                        <div className="text-[9px] text-[#8892A4] uppercase tracking-wider font-bold mb-1">Gasto 7d</div>
                        <div className="text-[10px] font-semibold text-[#74B9FF] flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                        </div>
                    </div>
                </div>

                {/* 4. Manual Audit Button */}
                <div className="mx-5 mb-4">
                    {/* Wrapping in simple div or directly Link. User asked for "Botón... Por ahora que redirija a /teaser" */}
                    <Link href="/teaser" className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] bg-gradient-to-br from-[#E94560] to-[#ff8e53] text-white font-bold text-[14px] shadow-[0_4px_14px_rgba(233,69,96,0.35)] hover:scale-[1.02] transition-transform">
                        <Sparkles className="w-4 h-4" /> Auditar ahora
                    </Link>
                    <p className="text-center text-[10px] text-[#8892A4] mt-2">Análisis manual fuera del ciclo semanal.</p>
                </div>

                {/* 5. Campaign List */}
                <div className="mx-5">
                    <h3 className="text-[13px] font-bold font-syne mb-2.5 pl-1">Tus campañas</h3>
                    <div className="space-y-0 text-white">

                        {/* Campaign 1: Green */}
                        <div className="flex items-center gap-3 py-2.5 border-b border-white/10 last:border-0">
                            <div className="w-[7px] h-[7px] rounded-full bg-[#4ECDC4] shadow-[0_0_6px_rgba(78,205,196,0.6)] shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-bold truncate">Retargeting 7 días</div>
                                <div className="text-[10px] text-[#8892A4]">$340 · ROAS 4.2x</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[13px] font-bold font-syne text-[#4ECDC4]">4.2x</div>
                                <div className="text-[9px] text-[#8892A4]">ROAS</div>
                            </div>
                        </div>

                        {/* Campaign 2: Yellow */}
                        <div className="flex items-center gap-3 py-2.5 border-b border-white/10 last:border-0">
                            <div className="w-[7px] h-[7px] rounded-full bg-[#FFE66D] shadow-[0_0_6px_rgba(255,230,109,0.6)] shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-bold truncate">Lookalike 1% compradores</div>
                                <div className="text-[10px] text-[#8892A4]">$280 · ROAS 1.9x</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[13px] font-bold font-syne text-[#FFE66D]">1.9x</div>
                                <div className="text-[9px] text-[#8892A4]">ROAS</div>
                            </div>
                        </div>

                        {/* Campaign 3: Red */}
                        <div className="flex items-center gap-3 py-2.5 border-b border-white/10 last:border-0">
                            <div className="w-[7px] h-[7px] rounded-full bg-[#FF6B6B] shadow-[0_0_6px_rgba(255,107,107,0.6)] shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-bold truncate">Intereses — Ropa Mujer</div>
                                <div className="text-[10px] text-[#8892A4]">$340 · ROAS 0.8x</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[13px] font-bold font-syne text-[#FF6B6B]">0.8x</div>
                                <div className="text-[9px] text-[#8892A4]">ROAS</div>
                            </div>
                        </div>

                        {/* Campaign 4: Green */}
                        <div className="flex items-center gap-3 py-2.5 border-b border-white/10 last:border-0">
                            <div className="w-[7px] h-[7px] rounded-full bg-[#4ECDC4] shadow-[0_0_6px_rgba(78,205,196,0.6)] shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-bold truncate">Carrito abandonado</div>
                                <div className="text-[10px] text-[#8892A4]">$180 · ROAS 5.1x</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[13px] font-bold font-syne text-[#4ECDC4]">5.1x</div>
                                <div className="text-[9px] text-[#8892A4]">ROAS</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 6. Bottom Navigation */}
                <div className="fixed bottom-0 left-0 w-full bg-[#16213E]/95 backdrop-blur-md border-t border-white/10 pb-4 pt-2.5 flex justify-around items-center z-40">
                    <div className="flex flex-col items-center gap-1 text-[#FF6B6B] bg-[#FF6B6B]/10 px-3 py-1 rounded-[10px]">
                        <BarChart2 className="w-4 h-4" />
                        <span className="text-[9px] font-medium">Dashboard</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 text-[#8892A4] hover:text-white px-3 py-1">
                        <Search className="w-4 h-4" />
                        <span className="text-[9px] font-medium">Auditorías</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 text-[#8892A4] hover:text-white px-3 py-1">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[9px] font-medium">Hooks IA</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 text-[#8892A4] hover:text-white px-3 py-1">
                        <Settings className="w-4 h-4" />
                        <span className="text-[9px] font-medium">Config</span>
                    </div>
                </div>

            </div>
        </main>
    );
}

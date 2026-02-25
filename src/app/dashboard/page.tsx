import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuditTriggerButton from "@/components/AuditTriggerButton";
import ClientTableRow from "@/components/ClientTableRow";
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
    CheckCircle2,
    ChevronRight
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

    const displayName = user.firstName || user.username || "Usuario";

    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('meta_access_token')
        .eq('clerk_user_id', user.id)
        .single();

    const isConnectedToMeta = !!profile?.meta_access_token;

    const { data: lastAudit } = await supabaseAdmin
        .from('auditorias')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    const isZeroState = !lastAudit;

    console.log('--- DEBUG START ---');
    console.log('User ID from Clerk:', user.id);
    console.log('Last audit ID:', lastAudit?.id);
    console.log('XML raw preview:', lastAudit?.xml_raw?.substring(0, 500));

    let metrics = { roas: "--", ctr: "--", cpm: "$0", spend: "$0" };
    let hallazgos: any[] = [];

    if (lastAudit && lastAudit.xml_raw) {
        const extract = (xml: string, tag: string) => {
            const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
            const match = xml.match(regex);
            return match ? match[1].trim() : '';
        };

        // Try 'metricas_globales', fallback to 'resumen_ejecutivo' or 'metricas_cuenta'
        const metricasXml = extract(lastAudit.xml_raw, 'metricas_globales') || extract(lastAudit.xml_raw, 'resumen_ejecutivo') || extract(lastAudit.xml_raw, 'metricas_cuenta');
        console.log('Parsed metricasXml:', metricasXml);
        if (metricasXml) {
            metrics = {
                roas: (extract(metricasXml, 'roas_promedio') || extract(metricasXml, 'roas') || "--") + "x",
                ctr: (extract(metricasXml, 'ctr_promedio') || extract(metricasXml, 'ctr') || "--") + "%",
                cpm: "$" + (extract(metricasXml, 'cpm_promedio') || extract(metricasXml, 'cpm') || "0"),
                spend: "$" + (extract(metricasXml, 'gasto_total_30d') || extract(metricasXml, 'gasto_total') || extract(metricasXml, 'gasto') || "0"),
            };
        }

        // Extraer los top 4 hallazgos para la tabla
        const hallazgoRegex = /<hallazgo id="(\d+)">([\s\S]*?)<\/hallazgo>/g;
        let match;
        while ((match = hallazgoRegex.exec(lastAudit.xml_raw)) !== null) {
            if (hallazgos.length >= 4) break;
            const content = match[2];
            const extractInner = (tag: string) => {
                const r = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
                const m = content.match(r);
                return m ? m[1].trim() : '';
            };

            const tipo = extractInner('tipo');
            const urgencia = extractInner('urgencia');

            let bg = 'bg-[#FFE66D]/10';
            let border = 'border-[#FFE66D]/20';
            let dot = 'bg-[#FFE66D] shadow-[0_0_5px_rgba(255,230,109,0.8)]';
            let text = 'text-[#FFE66D]';
            let estado = 'Observación';

            if (tipo.toLowerCase().includes('pausa') || urgencia.toLowerCase().includes('alta')) {
                bg = 'bg-[#FF6B6B]/10'; border = 'border-[#FF6B6B]/20';
                dot = 'bg-[#FF6B6B] shadow-[0_0_5px_rgba(255,107,107,0.8)]';
                text = 'text-[#FF6B6B]'; estado = 'Riesgo';
            } else if (tipo.toLowerCase().includes('escala') || urgencia.toLowerCase().includes('oportunidad')) {
                bg = 'bg-[#00D4AA]/10'; border = 'border-[#00D4AA]/20';
                dot = 'bg-[#00D4AA] shadow-[0_0_5px_rgba(0,212,170,0.8)]';
                text = 'text-[#00D4AA]'; estado = 'Óptimo';
            }

            hallazgos.push({
                id: match[1],
                campana: extractInner('campana_nombre'),
                estado,
                styles: { bg, border, dot, text },
                roi: (extractInner('impacto_roi') || "1.0") + "x"
            });
        }
    }

    return (
        <main className="min-h-screen bg-[#0B1120] text-white font-sans flex overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF6B6B] opacity-[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00D4AA] opacity-[0.03] rounded-full blur-[150px]" />
            </div>

            {/* Sidebar Fixa (Desktop) */}
            <aside className="fixed top-0 left-0 w-64 h-full bg-[#0B1120] border-r border-slate-800 z-40 hidden lg:flex flex-col">
                {/* Logo */}
                <div className="h-20 flex items-center px-8 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/favicon.ico" alt="Aditor AI" width={32} height={32} />
                        <span className="text-xl font-bold font-syne text-white tracking-tight">Aditor AI</span>
                    </Link>
                </div>

                {/* Navegación */}
                <div className="flex-1 py-8 px-4 flex flex-col gap-2">
                    <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menú Principal</div>

                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] font-medium transition-colors">
                        <BarChart2 className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link href="/dashboard/auditorias" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors">
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
                        <h1 className="text-2xl font-bold font-syne text-white">Hola, {displayName} 👋</h1>
                        <div className="hidden sm:flex px-3 py-1 bg-gradient-to-r from-[#FF6B6B]/20 to-[#ff8e53]/20 border border-[#FF6B6B]/30 rounded-full text-[#FF6B6B] text-xs font-bold tracking-wide shadow-[0_0_10px_rgba(255,107,107,0.1)]">
                            PLAN PRO
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative cursor-pointer hover:bg-slate-700 transition-colors">
                            <Bell className="w-5 h-5 text-slate-300" />
                            <div className="absolute top-2 right-2.5 w-2 h-2 bg-[#FF6B6B] rounded-full ring-2 ring-slate-800"></div>
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

                {/* Dashboard Content */}
                <div className="p-8 pb-32 lg:pb-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">

                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {/* ROAS */}
                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-slate-400 font-medium text-sm">ROAS Global</div>
                                <div className="p-2 bg-[#ffe66d]/10 rounded-lg"><div className="text-lg">💰</div></div>
                            </div>
                            <div className="text-3xl font-extrabold font-syne text-white mb-2 group-hover:text-[#ffe66d] transition-colors">{isZeroState ? "--" : metrics.roas}</div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="flex items-center text-[#FF6B6B] font-bold"><TrendingDown className="w-3 h-3 mr-0.5" /> -0.3 </span>
                                <span className="text-slate-500">vs semana ant.</span>
                            </div>
                            {/* Mini SVG Graph */}
                            <svg className="absolute bottom-0 left-0 w-full h-12 opacity-30 text-[#ffe66d]" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M0 30 L10 25 L30 15 L50 20 L70 10 L90 5 L100 15 L100 30 Z" fill="currentColor" />
                            </svg>
                        </div>

                        {/* CTR */}
                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-slate-400 font-medium text-sm">CTR Promedio</div>
                                <div className="p-2 bg-[#00D4AA]/10 rounded-lg"><div className="text-lg">🖱️</div></div>
                            </div>
                            <div className="text-3xl font-extrabold font-syne text-white mb-2 group-hover:text-[#00D4AA] transition-colors">{isZeroState ? "--" : metrics.ctr}</div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="flex items-center text-[#00D4AA] font-bold"><TrendingUp className="w-3 h-3 mr-0.5" /> +0.2% </span>
                                <span className="text-slate-500">vs semana ant.</span>
                            </div>
                            {/* Mini SVG Graph */}
                            <svg className="absolute bottom-0 left-0 w-full h-12 opacity-30 text-[#00D4AA]" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M0 30 L20 25 L40 10 L60 15 L80 5 L100 0 L100 30 Z" fill="currentColor" />
                            </svg>
                        </div>

                        {/* CPM */}
                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-slate-400 font-medium text-sm">CPM Promedio</div>
                                <div className="p-2 bg-[#FF6B6B]/10 rounded-lg"><div className="text-lg">📣</div></div>
                            </div>
                            <div className="text-3xl font-extrabold font-syne text-white mb-2 group-hover:text-[#FF6B6B] transition-colors">{isZeroState ? "$0" : metrics.cpm}</div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="flex items-center text-[#FF6B6B] font-bold">ALTO</span>
                                <span className="text-slate-500">Requiere atención</span>
                            </div>
                            {/* Mini SVG Graph */}
                            <svg className="absolute bottom-0 left-0 w-full h-12 opacity-30 text-[#FF6B6B]" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M0 30 L15 15 L35 20 L55 5 L75 10 L100 2 L100 30 Z" fill="currentColor" />
                            </svg>
                        </div>

                        {/* Spend */}
                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-slate-400 font-medium text-sm">Gasto 7 días</div>
                                <div className="p-2 bg-[#74B9FF]/10 rounded-lg"><div className="text-lg">💸</div></div>
                            </div>
                            <div className="text-3xl font-extrabold font-syne text-white mb-2 group-hover:text-[#74B9FF] transition-colors">{isZeroState ? "$0" : metrics.spend}</div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <span className="flex items-center text-[#00D4AA] font-bold"><TrendingUp className="w-3 h-3 mr-0.5" /> +15% </span>
                                <span className="text-slate-500">vs semana ant.</span>
                            </div>
                            {/* Mini SVG Graph */}
                            <svg className="absolute bottom-0 left-0 w-full h-12 opacity-30 text-[#74B9FF]" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M0 30 L10 28 L30 20 L50 22 L70 12 L90 10 L100 5 L100 30 Z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>

                    {/* Main Panels Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Col: Campaigns Table */}
                        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                                <div>
                                    <h2 className="text-lg font-bold font-syne text-white">Rendimiento de Campañas</h2>
                                    <p className="text-sm text-slate-400 mt-1">Monitoreo activo por la IA.</p>
                                </div>
                                <button className="text-[#FF6B6B] bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1">
                                    Ver todas <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                                            <th className="py-4 px-6 font-medium">Campaña</th>
                                            <th className="py-4 px-6 font-medium">Estado</th>
                                            <th className="py-4 px-6 font-medium">Gasto</th>
                                            <th className="py-4 px-6 font-medium text-right">ROAS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {isZeroState ? (
                                            <tr>
                                                <td colSpan={4} className="py-12 px-6 text-center text-slate-500">
                                                    Aún no hay datos. Conecta Meta e inicia tu primera auditoría interactiva.
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                {hallazgos.map((h, i) => (
                                                    <ClientTableRow key={i} item={h} auditId={lastAudit.id} />
                                                ))}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Col: Action Panels */}
                        <div className="flex flex-col gap-6">

                            {/* Auditar Ahora / Acciones */}
                            <div className="bg-gradient-to-br from-slate-900 to-[#1A1A2E] border border-slate-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                                {/* Decoración fondo */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF6B6B]/10 rounded-full blur-[40px]"></div>

                                <h3 className="text-lg font-bold font-syne text-white mb-2 relative z-10">Análisis bajo demanda</h3>
                                <p className="text-sm text-slate-400 mb-6 relative z-10">Genera una auditoría instantánea de tus campañas activas.</p>

                                <AuditTriggerButton />
                            </div>

                            {/* Próxima auditoría automática */}
                            <div className="bg-slate-900/40 border border-[#00D4AA]/20 rounded-3xl p-6 relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#00D4AA]/20 flex items-center justify-center">
                                        <span className="text-lg">🤖</span>
                                    </div>
                                    <span className="bg-[#00D4AA]/10 text-[#00D4AA] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-[#00D4AA]/20">Programado</span>
                                </div>
                                <h4 className="text-base font-bold text-white mb-2">Auditoría Semanal</h4>
                                <p className="text-sm text-slate-400 mb-0">La IA analizará tus campañas el próximo <strong className="text-white">Lunes a las 09:00 AM</strong>. Recibirás un correo con el PDF.</p>
                            </div>

                            {/* Meta Connect Card */}
                            {isConnectedToMeta ? (
                                <div className="bg-[#0B1120] border border-[#00D4AA]/40 rounded-3xl p-6 text-center shadow-[0_4px_20px_rgba(0,212,170,0.05)]">
                                    <div className="w-14 h-14 bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-7 h-7 text-[#00D4AA]" />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2 font-syne">Meta Ads Conectado</h3>
                                    <p className="text-xs text-slate-400 mb-5">
                                        Analizando campañas en tiempo real de forma segura.
                                    </p>
                                    <Link href="/conectar" className="inline-block text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium py-2.5 px-5 rounded-lg transition-colors border border-slate-700">
                                        Reconectar cuenta
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-[#0B1120] border border-[#FF6B6B] rounded-3xl p-6 text-center shadow-[0_4px_20px_rgba(255,107,107,0.1)] relative overflow-hidden">
                                    {/* Subtly glow from border */}
                                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#FF6B6B]/15 rounded-full blur-[30px]"></div>

                                    <h3 className="text-base font-bold text-white mb-2 font-syne relative z-10">Conectar Meta Ads</h3>
                                    <p className="text-xs text-slate-400 mb-5 relative z-10">
                                        Habilita la lectura para iniciar tu primera auditoría automática.
                                    </p>
                                    <Link href="/conectar" className="w-full relative z-10 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-[14px] py-3.5 rounded-xl transition-transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(24,119,242,0.3)]">
                                        <span className="font-bold text-lg leading-none mb-0.5">f</span>
                                        Conectar Cuenta
                                    </Link>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Bottom Navigation (Only visible on tight screens if users visit on mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 pb-5 pt-3 flex justify-around items-center z-50 px-2 transition-transform">
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

        </main>
    );
}

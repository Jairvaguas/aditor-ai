import os
import json

FILE_REPORTE = "src/app/reporte/[id]/page.tsx"
FILE_AUDITORIAS = "src/app/dashboard/auditorias/page.tsx"
FILE_ES = "messages/es.json"
FILE_EN = "messages/en.json"

CONTENT_REPORTE = """import { getSupabaseAdmin } from "@/lib/supabase";
import { XMLParser } from "fast-xml-parser";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import {
    AlertTriangle,
    ArrowRight,
    ArrowLeft,
    BarChart2,
    CheckCircle,
    DollarSign,
    PauseCircle,
    TrendingUp,
    ChevronRight
} from "lucide-react";

export const revalidate = 0;

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ReportePage(props: PageProps) {
    const t = await getTranslations("Reporte");
    const params = await props.params;
    const { id } = params;

    // 1. Fetch Audit
    const { data: audit, error } = await getSupabaseAdmin()
        .from('auditorias')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !audit) {
        return (
            <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">{t("notFoundTitle")}</h1>
                    <p className="text-gray-400">{t("notFoundDesc")}</p>
                    <NextLink href="/dashboard" className="mt-4 inline-block text-[#FF6B6B] hover:underline">
                        {t("backToDashboard")}
                    </NextLink>
                </div>
            </div>
        );
    }

    // 2. Parse XML
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    let parsedData;
    try {
        const result = parser.parse(audit.xml_raw);
        parsedData = result.auditoria;
    } catch (e) {
        console.error("XML Parse Error", e);
        return <div className="text-white p-10">{t("errorParsing")}</div>;
    }

    const { score_cuenta, hallazgos, redistribucion_presupuesto } = parsedData;

    const findingsList = Array.isArray(hallazgos?.hallazgo)
        ? hallazgos.hallazgo
        : (hallazgos?.hallazgo ? [hallazgos.hallazgo] : []);

    const score = parseInt(score_cuenta?.valor || 0);
    let scoreColor = '#FFE66D';
    if (score > 70) scoreColor = '#00D4AA';
    if (score < 40) scoreColor = '#FF6B6B';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    // Separar hallazgos por tipo
    const criticalFindings = findingsList.filter((f: any) => {
        const type = (f.tipo || '').toUpperCase();
        return type.includes('CRÍTICO') || type.includes('PAUSAR') || type.includes('FATIGA');
    });
    const warningFindings = findingsList.filter((f: any) => {
        const type = (f.tipo || '').toUpperCase();
        return type.includes('ALERTA') || type.includes('ATENCION') || type.includes('ATENCIÓN') || type.includes('OPTIMIZACIÓN') || type.includes('OPTIMIZACION');
    });
    const opportunityFindings = findingsList.filter((f: any) => {
        const type = (f.tipo || '').toUpperCase();
        return type.includes('OPORTUNIDAD') || type.includes('ESCALAR');
    });
    // Anything that doesn't match goes to warnings
    const categorized = [...criticalFindings, ...warningFindings, ...opportunityFindings];
    const uncategorized = findingsList.filter((f: any) => !categorized.includes(f));
    const allWarnings = [...warningFindings, ...uncategorized];

    return (
        <main className="min-h-screen bg-[#0B1120] text-white font-sans relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF6B6B] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00D4AA] rounded-full blur-[120px]" />
            </div>

            {/* Header Bar */}
            <header className="sticky top-0 z-30 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <NextLink href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                            <ArrowLeft className="w-4 h-4" />
                            {t("back")}
                        </NextLink>
                        <div className="hidden sm:block w-px h-5 bg-slate-700" />
                        <h1 className="hidden sm:block text-lg font-bold font-display">{t("title")}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{formatDate(audit.created_at)}</span>
                        {audit.tipo === 'automatica' && (
                            <span className="px-2 py-1 rounded-md bg-[#00D4AA]/10 text-[#00D4AA] text-[10px] font-bold border border-[#00D4AA]/20">
                                {t("autoBadge")}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content - 2 Column Layout */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column - Score + Summary + Budget */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Score Card */}
                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-8 text-center">
                            <div className="flex justify-center mb-6">
                                <div className="relative w-36 h-36 flex items-center justify-center">
                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: `conic-gradient(${scoreColor} ${score}%, rgba(255,255,255,0.1) ${score}%)`,
                                            maskImage: 'radial-gradient(transparent 55%, black 56%)',
                                            WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
                                        }}
                                    />
                                    <div className="flex flex-col items-center">
                                        <span className="text-5xl font-extrabold font-display" style={{ color: scoreColor }}>{score}</span>
                                        <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">{t("scoreBox")}</span>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-3" style={{ color: scoreColor }}>{score_cuenta?.nivel}</h2>
                            <p className="text-sm text-gray-400 leading-relaxed">{score_cuenta?.resumen}</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-white">{findingsList.length}</div>
                                <div className="text-xs text-slate-400 mt-1">{t("findingsTitle")}</div>
                            </div>
                            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold" style={{ color: criticalFindings.length > 0 ? '#FF6B6B' : '#00D4AA' }}>
                                    {criticalFindings.length}
                                </div>
                                <div className="text-xs text-slate-400 mt-1">{t("criticalLabel")}</div>
                            </div>
                        </div>

                        {/* Budget Redistribution */}
                        {redistribucion_presupuesto && (
                            <div className="bg-[#1877F2]/10 border border-[#1877F2]/30 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-[#1877F2]/20 text-[#1877F2]">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#1877F2] font-bold uppercase tracking-wider">{t("budgetLiberated")}</div>
                                        <div className="text-2xl font-bold text-white">{redistribucion_presupuesto?.presupuesto_liberado}</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-300 border-t border-[#1877F2]/20 pt-3 leading-relaxed">
                                    {redistribucion_presupuesto?.sugerencia}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Findings */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Critical Findings */}
                        {criticalFindings.length > 0 && (
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-[#FF6B6B] uppercase tracking-wider mb-3">
                                    <PauseCircle className="w-4 h-4" /> {t("criticalLabel")} ({criticalFindings.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {criticalFindings.map((finding: any, i: number) => (
                                        <FindingCard key={`critical-${i}`} finding={finding} colors={{
                                            bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.25)', text: '#FF6B6B', badge: '#FF6B6B'
                                        }} icon={<PauseCircle className="w-4 h-4" />} t={t} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Warning Findings */}
                        {allWarnings.length > 0 && (
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-[#FFE66D] uppercase tracking-wider mb-3">
                                    <AlertTriangle className="w-4 h-4" /> {t("warningLabel")} ({allWarnings.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {allWarnings.map((finding: any, i: number) => (
                                        <FindingCard key={`warning-${i}`} finding={finding} colors={{
                                            bg: 'rgba(255,230,109,0.08)', border: 'rgba(255,230,109,0.25)', text: '#FFE66D', badge: '#FFE66D'
                                        }} icon={<AlertTriangle className="w-4 h-4" />} t={t} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Opportunity Findings */}
                        {opportunityFindings.length > 0 && (
                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-[#00D4AA] uppercase tracking-wider mb-3">
                                    <TrendingUp className="w-4 h-4" /> {t("opportunityLabel")} ({opportunityFindings.length})
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {opportunityFindings.map((finding: any, i: number) => (
                                        <FindingCard key={`opp-${i}`} finding={finding} colors={{
                                            bg: 'rgba(0,212,170,0.08)', border: 'rgba(0,212,170,0.25)', text: '#00D4AA', badge: '#00D4AA'
                                        }} icon={<TrendingUp className="w-4 h-4" />} t={t} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

// Finding Card Component (inline for simplicity)
function FindingCard({ finding, colors, icon, t }: { finding: any; colors: any; icon: any; t: any }) {
    return (
        <div className="rounded-2xl p-5 border backdrop-blur-sm flex flex-col h-full" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1 rounded-md bg-black/20" style={{ color: colors.text }}>
                    {icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: colors.badge }}>
                    {finding.tipo}
                </span>
            </div>
            <h4 className="font-bold text-sm mb-2 text-white break-all overflow-hidden text-ellipsis line-clamp-2">{finding.campana_nombre}</h4>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed line-clamp-3">
                {finding.diagnostico}
            </p>
            <div className="flex items-start gap-3 bg-black/20 p-3 rounded-xl mt-auto">
                <div className="mt-0.5 flex-shrink-0" style={{ color: colors.text }}><ArrowRight className="w-3 h-3" /></div>
                <div>
                    <span className="text-[10px] font-bold block mb-0.5 uppercase tracking-wider" style={{ color: colors.text }}>{t("recommendedAction")}</span>
                    <p className="text-xs text-white leading-relaxed">{finding.accion_concreta}</p>
                </div>
            </div>
        </div>
    );
}
"""

CONTENT_AUDITORIAS = """import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NextLink from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { checkSubscription } from "@/lib/checkSubscription";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, FileText, Calendar, ChevronRight } from "lucide-react";

export default async function AuditoriasPage() {
    const t = await getTranslations("Auditorias");
    const user = await currentUser();
    if (!user) redirect("/registro");

    const hasAccess = await checkSubscription(user.id);
    if (!hasAccess) redirect("/subscribe");

    // Obtener cuenta seleccionada
    const { data: profile } = await getSupabaseAdmin()
        .from('profiles')
        .select('selected_ad_account_id')
        .eq('clerk_user_id', user.id)
        .single();

    const selectedAccount = profile?.selected_ad_account_id;

    // Obtener auditorías filtradas por cuenta
    let query = getSupabaseAdmin()
        .from('auditorias')
        .select('id, created_at, tipo, ad_account_id, score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    if (selectedAccount) {
        query = query.eq('ad_account_id', selectedAccount);
    }

    const { data: auditorias } = await query;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#0B1120] text-white font-sans">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-8">
                    <NextLink href="/dashboard" className="mt-1 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </NextLink>
                    <div>
                        <h1 className="text-2xl font-bold font-display">{t("title")}</h1>
                        <p className="text-sm text-slate-400 mt-1">{t("subtitle")}</p>
                    </div>
                </div>

                {/* Lista de auditorías */}
                {(!auditorias || auditorias.length === 0) ? (
                    <div className="text-center py-16 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{t("empty")}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {auditorias.map((audit: any) => {
                            const score = audit.score || 0;
                            let scoreColor = '#FFE66D';
                            if (score > 70) scoreColor = '#00D4AA';
                            if (score < 40) scoreColor = '#FF6B6B';

                            return (
                                <NextLink
                                    key={audit.id}
                                    href={`/reporte/${audit.id}`}
                                    className="flex items-center justify-between p-5 bg-slate-900/80 border border-slate-700/80 rounded-2xl hover:bg-slate-800/80 hover:border-slate-600 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold font-display text-lg" style={{ backgroundColor: `${scoreColor}15`, color: scoreColor }}>
                                            {score}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white group-hover:text-[#FF6B6B] transition-colors">
                                                {t("auditLabel")} — {formatDate(audit.created_at)}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {audit.tipo === 'automatica' ? (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20">
                                                        AUTO
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                                        MANUAL
                                                    </span>
                                                )}
                                                {audit.ad_account_id && (
                                                    <span className="text-xs text-slate-500">ID: {audit.ad_account_id}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                                </NextLink>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
"""

def update_json(filepath, lang="es"):
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # Add to "Reporte"
    if "Reporte" in data:
        if lang == "es":
            data["Reporte"]["criticalLabel"] = "Críticos"
            data["Reporte"]["warningLabel"] = "Atención"
            data["Reporte"]["opportunityLabel"] = "Oportunidades"
        else:
            data["Reporte"]["criticalLabel"] = "Critical"
            data["Reporte"]["warningLabel"] = "Warnings"
            data["Reporte"]["opportunityLabel"] = "Opportunities"
            
    # Add "Auditorias"
    if "Auditorias" not in data:
        if lang == "es":
            data["Auditorias"] = {
                "title": "Historial de Auditorías",
                "subtitle": "Todas las auditorías generadas para tu cuenta seleccionada.",
                "empty": "No hay auditorías todavía. Genera tu primera auditoría desde el dashboard.",
                "auditLabel": "Auditoría IA"
            }
        else:
            data["Auditorias"] = {
                "title": "Audit History",
                "subtitle": "All audits generated for your selected account.",
                "empty": "No audits yet. Generate your first audit from the dashboard.",
                "auditLabel": "AI Audit"
            }
            
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {filepath}")

def execute():
    # Replace layout 
    os.makedirs(os.path.dirname(FILE_REPORTE), exist_ok=True)
    with open(FILE_REPORTE, 'w', encoding='utf-8') as f:
        f.write(CONTENT_REPORTE)
    print(f"Replaced {FILE_REPORTE}")
    
    # Create Auditorias Page 
    os.makedirs(os.path.dirname(FILE_AUDITORIAS), exist_ok=True)
    with open(FILE_AUDITORIAS, 'w', encoding='utf-8') as f:
        f.write(CONTENT_AUDITORIAS)
    print(f"Created/Replaced {FILE_AUDITORIAS}")
    
    # Update i18n
    update_json(FILE_ES, "es")
    update_json(FILE_EN, "en")

if __name__ == "__main__":
    execute()

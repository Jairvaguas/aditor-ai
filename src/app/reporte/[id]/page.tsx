import { getSupabaseAdmin } from "@/lib/supabase";
import { XMLParser } from "fast-xml-parser";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import FindingsTabs from "@/components/FindingsTabs";
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
        const urgency = (f.urgencia || '').toUpperCase();
        return type.includes('CRÍTICO') || type.includes('PAUSAR') || type.includes('FATIGA') || 
               type.includes('SIN GASTO') || type.includes('ENGAÑOSO') || type.includes('PROBLEMA') ||
               urgency.includes('CRÍTICA') || urgency.includes('ALTA');
    });

    const opportunityFindings = findingsList.filter((f: any) => {
        const type = (f.tipo || '').toUpperCase();
        const urgency = (f.urgencia || '').toUpperCase();
        return type.includes('OPORTUNIDAD') || type.includes('ESCALAR') || 
               type.includes('MEJOR RENDIMIENTO') ||
               urgency.includes('OPORTUNIDAD');
    });

    const warningFindings = findingsList.filter((f: any) => {
        const type = (f.tipo || '').toUpperCase();
        const urgency = (f.urgencia || '').toUpperCase();
        return type.includes('ALERTA') || type.includes('ATENCION') || type.includes('ATENCIÓN') || 
               type.includes('OPTIMIZACIÓN') || type.includes('OPTIMIZACION') || type.includes('OPTIMIZAR') ||
               type.includes('COSTO') || type.includes('ALTO') || type.includes('ESTACIONAL') ||
               type.includes('DESORDENADA') || type.includes('ESTRUCTURA') ||
               urgency.includes('MEDIA');
    });

    // Anything not categorized goes to warnings
    const categorized = [...criticalFindings, ...opportunityFindings];
    const uncategorized = findingsList.filter((f: any) => !categorized.includes(f));
    const allWarnings = [...warningFindings.filter((f: any) => !categorized.includes(f)), ...uncategorized.filter((f: any) => !warningFindings.includes(f))];

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

                    {/* Right Column - Findings with Tabs */}
                    <div className="lg:col-span-8">
                        <FindingsTabs
                            criticalFindings={criticalFindings}
                            warningFindings={allWarnings}
                            opportunityFindings={opportunityFindings}
                            labels={{
                                summary: t("summaryTab"),
                                critical: t("criticalLabel"),
                                warnings: t("warningLabel"),
                                opportunities: t("opportunityLabel"),
                                recommendedAction: t("recommendedAction"),
                                campaign: t("campaignCol"),
                                type: t("typeCol"),
                                urgency: t("urgencyCol"),
                                viewDetail: t("viewDetail"),
                            }}
                        />
                    </div>
</div>
            </div>
        </main>
    );
}


import { getSupabaseAdmin } from "@/lib/supabase";
import { XMLParser } from "fast-xml-parser";
import { Link } from "lucide-react"; // Wait, using Next Link, not lucide
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import {
    AlertTriangle,
    ArrowRight,
    BarChart2,
    CheckCircle,
    DollarSign,
    PauseCircle,
    TrendingUp
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
            <div className="min-h-screen bg-[#1A1A2E] text-white flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">{t("notFoundTitle")}</h1>
                    <p className="text-gray-400">{t("notFoundDesc")}</p>
                    <NextLink href="/dashboard" className="mt-4 inline-block text-[#E94560] hover:underline">
                        {t("backToDashboard")}
                    </NextLink>
                </div>
            </div>
        );
    }

    // 2. Parse XML
    const parser = new XMLParser();
    let parsedData;
    try {
        const result = parser.parse(audit.xml_raw);
        parsedData = result.auditoria;
    } catch (e) {
        console.error("XML Parse Error", e);
        return <div className="text-white p-10">{t("errorParsing")}</div>;
    }

    const { score_cuenta, hallazgos, redistribucion_presupuesto } = parsedData;

    // Ensure hallazgos.hallazgo is an array
    const findingsList = Array.isArray(hallazgos?.hallazgo)
        ? hallazgos.hallazgo
        : (hallazgos?.hallazgo ? [hallazgos.hallazgo] : []);

    // Score helpers
    const score = parseInt(score_cuenta?.valor || 0);
    let scoreColor = '#FFE66D'; // Yellow default
    if (score > 70) scoreColor = '#4ECDC4'; // Green
    if (score < 40) scoreColor = '#E94560'; // Red

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <main className="min-h-screen bg-[#1A1A2E] text-white font-sans pb-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E94560] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4ECDC4] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-md mx-auto px-5 py-8">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <NextLink href="/dashboard" className="text-xs text-gray-400 mb-1 block hover:text-white">{t("back")}</NextLink>
                        <h1 className="text-2xl font-bold font-syne flex items-center gap-2">
                            {t("title")}
                        </h1>
                        <p className="text-xs text-[#8892A4] mt-1">
                            {formatDate(audit.created_at)}
                        </p>
                    </div>
                    {audit.tipo === 'automatica' && (
                        <span className="px-2 py-1 rounded-md bg-[#4ECDC4]/10 text-[#4ECDC4] text-[10px] font-bold border border-[#4ECDC4]/20">
                            {t("autoBadge")}
                        </span>
                    )}
                </div>

                {/* Score Circular */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* Conic Gradient Ring */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(${scoreColor} ${score}%, rgba(255,255,255,0.1) ${score}%)`,
                                maskImage: 'radial-gradient(transparent 55%, black 56%)',
                                WebkitMaskImage: 'radial-gradient(transparent 55%, black 56%)'
                            }}
                        />
                        <div className="flex flex-col items-center">
                            <span className="text-5xl font-extrabold font-syne" style={{ color: scoreColor }}>{score}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">{t("scoreBox")}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-8 px-4">
                    <h2 className="text-lg font-bold mb-2" style={{ color: scoreColor }}>{score_cuenta?.nivel}</h2>
                    <p className="text-sm text-gray-400 leading-relaxed">{score_cuenta?.resumen}</p>
                </div>

                {/* Hallazgos */}
                <div className="space-y-4 mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{t("findingsTitle")}</h3>

                    {findingsList.map((finding: any, i: number) => {
                        const type = (finding.tipo || '').toUpperCase();
                        // Default
                        let colors = { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#fff', badge: 'gray' };
                        let icon = <AlertTriangle className="w-4 h-4" />;

                        if (type.includes('CRÍTICO') || type.includes('PAUSAR') || type.includes('FATIGA')) {
                            colors = { bg: 'rgba(233,69,96,0.12)', border: 'rgba(233,69,96,0.3)', text: '#E94560', badge: '#E94560' };
                            icon = <PauseCircle className="w-4 h-4" />;
                        } else if (type.includes('OPORTUNIDAD') || type.includes('ESCALAR')) {
                            colors = { bg: 'rgba(78,205,196,0.12)', border: 'rgba(78,205,196,0.3)', text: '#4ECDC4', badge: '#4ECDC4' };
                            icon = <TrendingUp className="w-4 h-4" />;
                        } else if (type.includes('ALERTA') || type.includes('ATENCION') || type.includes('ATENCIÓN') || type.includes('OPTIMIZACIÓN') || type.includes('OPTIMIZACION')) {
                            colors = { bg: 'rgba(255,230,109,0.12)', border: 'rgba(255,230,109,0.3)', text: '#FFE66D', badge: '#FFE66D' };
                            icon = <AlertTriangle className="w-4 h-4" />;
                        }

                        return (
                            <div key={i} className="rounded-2xl p-5 border backdrop-blur-sm" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 rounded-md bg-black/20" style={{ color: colors.text }}>
                                        {icon}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: colors.badge }}>
                                        {finding.tipo}
                                    </span>
                                </div>

                                <h4 className="font-bold text-base mb-2">{finding.campana_nombre}</h4>
                                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                                    {finding.diagnostico}
                                </p>

                                <div className="flex items-start gap-3 bg-black/20 p-3 rounded-xl">
                                    <div className="mt-0.5" style={{ color: colors.text }}><ArrowRight className="w-4 h-4" /></div>
                                    <div>
                                        <span className="text-xs font-bold block mb-0.5" style={{ color: colors.text }}>{t("recommendedAction")}</span>
                                        <p className="text-xs text-white">{finding.accion_concreta}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Redistribución de Presupuesto */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{t("budgetTitle")}</h3>
                    <div className="bg-[#1877F2]/10 border border-[#1877F2]/30 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-full bg-[#1877F2]/20 text-[#1877F2]">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm text-[#1877F2] font-bold">{t("budgetLiberated")}</div>
                                <div className="text-2xl font-bold text-white">{redistribucion_presupuesto?.presupuesto_liberado}</div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-300 border-t border-[#1877F2]/20 pt-3">
                            {redistribucion_presupuesto?.sugerencia}
                        </p>
                    </div>
                </div>



            </div>
        </main>
    );
}

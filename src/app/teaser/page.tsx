import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { getTranslations } from "next-intl/server";

async function getAuditData(auditId: string) {
    const { data, error } = await getSupabaseAdmin()
        .from('auditorias')
        .select('*')
        .eq('id', auditId)
        .single();

    if (error || !data) return null;
    return data;
}

function parseAuditXML(xml: string) {
    // Parser simple y robusto para extraer datos clave del XML
    const extract = (tag: string) => {
        // pattern: <tag>content</tag> matching newlines
        const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
        const match = xml.match(regex);
        return match ? match[1].trim() : '';
    };

    const score = parseInt(extract('valor'), 10) || 0;
    const nivel = extract('nivel');
    const resumen = extract('resumen');

    // Extraer hallazgos (simple regex loop)
    const hallazgos = [];
    const hallazgoRegex = /<hallazgo id="(\d+)">([\s\S]*?)<\/hallazgo>/g;
    let match;
    while ((match = hallazgoRegex.exec(xml)) !== null) {
        const content = match[2];
        const extractInner = (tag: string) => {
            const r = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
            const m = content.match(r);
            return m ? m[1].trim() : '';
        };
        hallazgos.push({
            id: match[1],
            tipo: extractInner('tipo'),
            urgencia: extractInner('urgencia'),
            campana: extractInner('campana_nombre'),
            diagnostico: extractInner('diagnostico'),
            accion: extractInner('accion_concreta')
        });
    }

    return { score, nivel, resumen, hallazgos };
}

export default async function TeaserPage(props: { searchParams: Promise<{ auditId?: string }> }) {
    const t = await getTranslations("Teaser");
    const searchParams = await props.searchParams;
    const auditId = searchParams?.auditId;

    let score = 64;
    let nivel = "Requiere Atención";
    let resumen = "Analizamos tu cuenta publicitaria y detectamos fugas de presupuesto importantes en campañas con bajo rendimiento, así como oportunidades claras de escala en segmentos de retargeting que podrían incrementar tu ROAS general.";
    let hallazgos: any[] = [
        { tipo: "Pausar", urgencia: "Alta", campana: "LAL 1% Compradores - Broad", diagnostico: "ROAS menor a 1.0 tras invertir $150. El costo por clic es excesivo y los creativos presentan fatiga alta.", accion: "Pausar adset y regenerar público." },
        { tipo: "Escalar", urgencia: "Oportunidad", campana: "Retargeting DPA (Catálogo)", diagnostico: "ROAS sostenido de 4.2x con CPM de $8, muy por debajo de la media de la industria.", accion: "Incrementar presupuesto 20% paulatinamente." },
        { tipo: "Optimización", urgencia: "Media", campana: "Tráfico Frío - Colección Inverno", diagnostico: "CTR de 0.6%, por debajo del benchmark del e-commerce (1.5%). La tasa de conversión es buena, pero faltan clics.", accion: "Renovar ángulos visuales urgentes." },
        { tipo: "Pausar", urgencia: "Alta", campana: "Test Creativos CBO", diagnostico: "---", accion: "---" },
        { tipo: "Oportunidad", urgencia: "Baja", campana: "Black Friday Promo", diagnostico: "---", accion: "---" },
        { tipo: "Alerta", urgencia: "Media", campana: "Intereses Moda E-commerce", diagnostico: "---", accion: "---" }
    ];

    if (auditId) {
        const auditData = await getAuditData(auditId);
        if (!auditData) {
            return (
                <div className="min-h-screen bg-[#1A1A2E] text-white flex items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">{t("notFoundTitle")}</h1>
                        <p className="text-[#8892A4] mb-4">{t("notFoundDesc")}</p>
                        <Link href="/conectar" className="text-[#E94560] underline">{t("retry")}</Link>
                    </div>
                </div>
            );
        }

        const parsed = parseAuditXML(auditData.xml_raw || '');
        score = parsed.score;
        nivel = parsed.nivel;
        resumen = parsed.resumen;
        hallazgos = parsed.hallazgos;
    }

    // Separamos hallazgos visibles (loss primeros 3) de los ocultos
    const visibleHallazgos = hallazgos.slice(0, 3);
    const hiddenHallazgosCount = Math.max(0, hallazgos.length - 3);

    // Tipos de color segun urgencia/tipo
    const getColors = (tipo: string, urgencia: string) => {
        const t = tipo.toLowerCase();
        const u = urgencia.toLowerCase();
        if (t.includes('pausa') || u.includes('alta')) return {
            bg: 'bg-[#FF6B6B]/8', border: 'border-[#FF6B6B]/20',
            badgeBg: 'bg-[#FF6B6B]/20', badgeText: 'text-[#FF6B6B]', emoji: '🔴'
        };
        if (t.includes('escala') || u.includes('oportunidad')) return {
            bg: 'bg-[#4ECDC4]/8', border: 'border-[#4ECDC4]/20',
            badgeBg: 'bg-[#4ECDC4]/20', badgeText: 'text-[#4ECDC4]', emoji: '🟢'
        };
        return {
            bg: 'bg-[#FFE66D]/8', border: 'border-[#FFE66D]/20',
            badgeBg: 'bg-[#FFE66D]/20', badgeText: 'text-[#FFE66D]', emoji: '🟡'
        };
    };

    return (
        <main className="min-h-screen bg-[#1A1A2E] text-white font-sans pb-20">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E94560] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4ECDC4] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-md mx-auto relative">
                {/* Notch simulation */}
                <div className="w-[110px] h-[26px] bg-[#1A1A2E] rounded-b-[18px] mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-50"></div>

                {/* Header */}
                <div className="pt-12 px-5 pb-4">
                    <h2 className="text-[19px] font-extrabold font-display mb-1">{t("readyTitle")}</h2>
                    <p className="text-[11px] text-[#8892A4]">{t("readyDesc")}</p>
                </div>

                {/* Score Card */}
                <div className="mx-5 mb-4 bg-gradient-to-br from-[#FF6B6B]/12 to-[#FF8E53]/12 border border-[#FF6B6B]/25 rounded-[18px] p-4 flex items-center gap-3.5">
                    {/* Circular Score */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 relative"
                        style={{ background: `conic-gradient(${score > 70 ? '#4ECDC4' : score > 40 ? '#FFE66D' : '#FF6B6B'} 0deg ${score * 3.6}deg, rgba(255,255,255,0.08) ${score * 3.6}deg 360deg)` }}>
                        <div className="w-[46px] h-[46px] bg-[#16213E] rounded-full flex flex-col items-center justify-center">
                            <span className={`text-base font-extrabold font-display leading-none ${score > 70 ? 'text-[#4ECDC4]' : score > 40 ? 'text-[#FFE66D]' : 'text-[#FF6B6B]'}`}>{score}</span>
                            <span className="text-[8px] text-[#8892A4]">/100</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-[15px] font-extrabold font-display mb-1">{t("health", { nivel })}</h3>
                        <p className="text-[11px] text-[#8892A4] leading-snug">
                            {resumen.substring(0, 120)}...
                        </p>
                    </div>
                </div>

                {/* Findings List */}
                <div className="px-5 pb-4">
                    <div className="text-[11px] font-bold text-[#8892A4] tracking-widest uppercase mb-2.5">{t("findingsPrefix")} ({hallazgos.length})</div>

                    {visibleHallazgos.map((hallazgo, idx) => {
                        const styles = getColors(hallazgo.tipo, hallazgo.urgencia);
                        return (
                            <div key={idx} className={`${styles.bg} border ${styles.border} rounded-[14px] p-3 mb-2`}>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className={`px-2 py-0.5 rounded-[5px] ${styles.badgeBg} ${styles.badgeText} text-[9px] font-bold tracking-wider uppercase`}>
                                        {styles.emoji} {hallazgo.tipo}
                                    </div>
                                    <div className="text-[12px] font-semibold flex-1 truncate">{hallazgo.campana}</div>
                                </div>
                                <p className="text-[11px] text-[#8892A4] leading-snug">{hallazgo.diagnostico}</p>
                            </div>
                        );
                    })}

                    {/* Locked/Blurred Findings if any */}
                    {hiddenHallazgosCount > 0 && (
                        <div className="relative mt-2">
                            {/* Lock Overlay Banner */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] bg-[#1A1A2E]/95 backdrop-blur-md border border-[#FF6B6B]/30 rounded-[16px] p-4 text-center z-20 shadow-2xl">
                                <div className="text-2xl mb-2">🔒</div>
                                <h3 className="text-[15px] font-extrabold font-display mb-1 text-white">{t("lockedTitle", { count: hiddenHallazgosCount })}</h3>
                                <p className="text-[11px] text-[#8892A4] mb-3 leading-snug">
                                    {t("lockedDesc")}
                                </p>
                                <Link href="/conectar" className="block w-full py-3 bg-gradient-to-br from-[#E94560] to-[#ff8e53] rounded-[14px] text-white text-[14px] font-bold shadow-[0_6px_20px_rgba(255,107,107,0.35)] hover:scale-[1.02] transition-transform">
                                    {t("lockedCta")}
                                </Link>
                                <div className="text-[10px] text-[#8892A4] mt-2">{t("lockedFooter")}</div>
                            </div>

                            {/* Fake Blurred Content for visual effect */}
                            <div className="opacity-50 filter blur-[4px] pointer-events-none select-none">
                                <div className="bg-[#4ECDC4]/8 border border-[#4ECDC4]/20 rounded-[14px] p-3 mb-2">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="px-2 py-0.5 rounded-[5px] bg-[#4ECDC4]/20 text-[#4ECDC4] text-[9px] font-bold tracking-wider uppercase">{t("fakeTag")}</div>
                                        <div className="text-[12px] font-semibold flex-1">{t("fakeCamp")}</div>
                                    </div>
                                    <div className="text-[11px] text-[#8892A4]">{t("fakeDesc")}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

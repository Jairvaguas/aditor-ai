import { currentUser } from "@clerk/nextjs/server";
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

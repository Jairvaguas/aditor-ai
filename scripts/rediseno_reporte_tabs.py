import os
import json
import re

# Constantes de Rutas
BASE_DIR = os.getcwd()
FINDINGS_TAB_PATH = os.path.join(BASE_DIR, "src", "components", "FindingsTabs.tsx")
REPORT_PAGE_PATH = os.path.join(BASE_DIR, "src", "app", "reporte", "[id]", "page.tsx")
ES_JSON_PATH = os.path.join(BASE_DIR, "messages", "es.json")
EN_JSON_PATH = os.path.join(BASE_DIR, "messages", "en.json")

def create_findings_tabs_component():
    print("Creando src/components/FindingsTabs.tsx...")
    content = """'use client';
import { useState } from 'react';
import { AlertTriangle, ArrowRight, PauseCircle, TrendingUp, List } from 'lucide-react';

interface Finding {
    tipo: string;
    campana_nombre: string;
    diagnostico: string;
    accion_concreta: string;
}

interface FindingsTabsProps {
    criticalFindings: Finding[];
    warningFindings: Finding[];
    opportunityFindings: Finding[];
    labels: {
        summary: string;
        critical: string;
        warnings: string;
        opportunities: string;
        recommendedAction: string;
        campaign: string;
        type: string;
        urgency: string;
        viewDetail: string;
    };
}

type TabKey = 'summary' | 'critical' | 'warnings' | 'opportunities';

export default function FindingsTabs({ criticalFindings, warningFindings, opportunityFindings, labels }: FindingsTabsProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('summary');

    const allFindings = [
        ...criticalFindings.map(f => ({ ...f, category: 'critical' as const })),
        ...warningFindings.map(f => ({ ...f, category: 'warning' as const })),
        ...opportunityFindings.map(f => ({ ...f, category: 'opportunity' as const })),
    ];

    const tabs: { key: TabKey; label: string; count: number; color: string; icon: any }[] = [
        { key: 'summary', label: labels.summary, count: allFindings.length, color: '#74B9FF', icon: List },
        { key: 'critical', label: labels.critical, count: criticalFindings.length, color: '#FF6B6B', icon: PauseCircle },
        { key: 'warnings', label: labels.warnings, count: warningFindings.length, color: '#FFE66D', icon: AlertTriangle },
        { key: 'opportunities', label: labels.opportunities, count: opportunityFindings.length, color: '#00D4AA', icon: TrendingUp },
    ];

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'critical':
                return { bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.25)', text: '#FF6B6B' };
            case 'warning':
                return { bg: 'rgba(255,230,109,0.08)', border: 'rgba(255,230,109,0.25)', text: '#FFE66D' };
            case 'opportunity':
                return { bg: 'rgba(0,212,170,0.08)', border: 'rgba(0,212,170,0.25)', text: '#00D4AA' };
            default:
                return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#fff' };
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'critical': return <PauseCircle className="w-4 h-4" />;
            case 'warning': return <AlertTriangle className="w-4 h-4" />;
            case 'opportunity': return <TrendingUp className="w-4 h-4" />;
            default: return <List className="w-4 h-4" />;
        }
    };

    const getActiveFindings = (): (Finding & { category: string })[] => {
        switch (activeTab) {
            case 'critical': return criticalFindings.map(f => ({ ...f, category: 'critical' }));
            case 'warnings': return warningFindings.map(f => ({ ...f, category: 'warning' }));
            case 'opportunities': return opportunityFindings.map(f => ({ ...f, category: 'opportunity' }));
            default: return allFindings;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Tab Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                                ${isActive 
                                    ? 'bg-slate-800 border border-slate-600 text-white shadow-lg' 
                                    : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" style={{ color: isActive ? tab.color : undefined }} />
                            <span>{tab.label}</span>
                            <span 
                                className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                                style={{ 
                                    backgroundColor: isActive ? `${tab.color}20` : 'rgba(255,255,255,0.05)',
                                    color: isActive ? tab.color : 'inherit'
                                }}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {activeTab === 'summary' ? (
                /* Summary View - Compact list */
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
                                <th className="py-3 px-5 font-medium">{labels.type}</th>
                                <th className="py-3 px-5 font-medium">{labels.campaign}</th>
                                <th className="py-3 px-5 font-medium hidden md:table-cell">{labels.urgency}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {allFindings.map((finding, i) => {
                                const styles = getCategoryStyles(finding.category);
                                return (
                                    <tr 
                                        key={i} 
                                        className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                                        onClick={() => {
                                            if (finding.category === 'critical') setActiveTab('critical');
                                            else if (finding.category === 'warning') setActiveTab('warnings');
                                            else setActiveTab('opportunities');
                                        }}
                                    >
                                        <td className="py-3 px-5">
                                            <span 
                                                className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border"
                                                style={{ 
                                                    backgroundColor: styles.bg, 
                                                    borderColor: styles.border, 
                                                    color: styles.text 
                                                }}
                                            >
                                                {getCategoryIcon(finding.category)}
                                                {finding.tipo}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 text-sm text-white font-medium truncate max-w-[250px]">
                                            {finding.campana_nombre}
                                        </td>
                                        <td className="py-3 px-5 text-xs text-slate-400 hidden md:table-cell truncate max-w-[200px]">
                                            {finding.diagnostico?.substring(0, 80)}...
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Detail View - Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getActiveFindings().map((finding, i) => {
                        const styles = getCategoryStyles(finding.category);
                        return (
                            <div 
                                key={i} 
                                className="rounded-2xl p-5 border backdrop-blur-sm flex flex-col" 
                                style={{ backgroundColor: styles.bg, borderColor: styles.border }}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1 rounded-md bg-black/20" style={{ color: styles.text }}>
                                        {getCategoryIcon(finding.category)}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: styles.text }}>
                                        {finding.tipo}
                                    </span>
                                </div>
                                <h4 className="font-bold text-sm mb-2 text-white break-all overflow-hidden text-ellipsis line-clamp-2">
                                    {finding.campana_nombre}
                                </h4>
                                <p className="text-xs text-gray-300 mb-4 leading-relaxed flex-grow">
                                    {finding.diagnostico}
                                </p>
                                <div className="flex items-start gap-3 bg-black/20 p-3 rounded-xl mt-auto">
                                    <div className="mt-0.5 flex-shrink-0" style={{ color: styles.text }}>
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold block mb-0.5 uppercase tracking-wider" style={{ color: styles.text }}>
                                            {labels.recommendedAction}
                                        </span>
                                        <p className="text-xs text-white leading-relaxed">{finding.accion_concreta}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
"""
    os.makedirs(os.path.dirname(FINDINGS_TAB_PATH), exist_ok=True)
    with open(FINDINGS_TAB_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print("Componente FindingsTabs creado.")

def modify_report_page():
    print(f"Modificando {REPORT_PAGE_PATH}...")
    with open(REPORT_PAGE_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Agregar import
    bad_import = 'import {\nimport FindingsTabs from "@/components/FindingsTabs";\n    AlertTriangle,'
    if bad_import in content:
        content = content.replace(bad_import, 'import FindingsTabs from "@/components/FindingsTabs";\nimport {\n    AlertTriangle,')
        print("Import de FindingsTabs reparado.")
    elif "import FindingsTabs" not in content:
        target_import = 'import { getTranslations } from "next-intl/server";'
        if target_import in content:
            content = content.replace(target_import, target_import + '\nimport FindingsTabs from "@/components/FindingsTabs";')
        else:
            content = 'import FindingsTabs from "@/components/FindingsTabs";\n' + content
        print("Import de FindingsTabs agregado.")

    # 2. Reemplazo de Findings
    pattern_start = r'\{\/\*\s*Right Column - Findings\s*\*\/\}\s*<div\s+className="lg:col-span-8(\s+flex\s+flex-col\s+gap-6)?"[^>]*>'
    match = re.search(pattern_start, content)
    
    if match and "FindingsTabs" not in content[match.start():match.start()+1000]:
        start_idx = match.start()
        # Find the end by counting divs
        div_count = 0
        end_idx = -1
        i = content.find("<div", start_idx)
        
        while i < len(content):
            if content[i:i+4] == "<div":
                div_count += 1
                i += 4
                continue
            elif content[i:i+5] == "</div":
                div_count -= 1
                if div_count == 0:
                    end_idx = i + 6 # </div >
                    # skip spaces and newlines
                    while end_idx < len(content) and content[end_idx] in [' ', '\n', '\r', '\t']:
                        end_idx += 1
                    break
                i += 5
                continue
            i += 1
            
        if end_idx != -1:
            replacement_component = """{/* Right Column - Findings with Tabs */}
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
"""
            content = content[:start_idx] + replacement_component + content[end_idx:]
            print("Columna derecha de Findings reemplazada con Tabs.")
        else:
            print("No se encontró el final del div de Findings.")
    else:
        print("No se encontró el inicio de la columna de Findings para reemplazar o ya fue reemplazada.")

    # 3. Eliminar FindingCard
    finding_card_pattern = r'// Finding Card Component \(inline for simplicity\).*?function FindingCard.*'
    match_card = re.search(finding_card_pattern, content, flags=re.DOTALL)
    if match_card:
        # We need to find the entire block. Because regex with dotall will match to the end of file probably
        # Let's do it with string operations instead:
        match_start = content.find('// Finding Card Component (inline for simplicity)')
        if match_start != -1:
            card_func_idx = content.find('function FindingCard', match_start)
            if card_func_idx != -1:
                open_brace_idx = content.find('{', card_func_idx)
                if open_brace_idx != -1:
                    bracket_count = 1
                    i = open_brace_idx + 1
                    while i < len(content):
                        if content[i] == '{':
                            bracket_count += 1
                        elif content[i] == '}':
                            bracket_count -= 1
                            if bracket_count == 0:
                                # Found the end
                                content = content[:match_start].rstrip() + "\n"
                                print("Función FindingCard eliminada exitosamente.")
                                break
                        i += 1

    with open(REPORT_PAGE_PATH, "w", encoding="utf-8") as f:
        f.write(content)

def update_json(filepath, additions, section="Reporte"):
    print(f"Actualizando {filepath} en la sección {section}...")
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    if section in data:
        for k, v in additions.items():
            if k not in data[section]:
                data[section][k] = v
                print(f"  + {k}: {v}")
    else:
        print(f"Advertencia: Sección {section} no encontrada en {filepath}")

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        f.write("\n")

def main():
    try:
        if not os.path.exists(REPORT_PAGE_PATH):
            print(f"Error: No se encuentra {REPORT_PAGE_PATH}.")
            return
            
        create_findings_tabs_component()
        modify_report_page()
        
        es_additions = {
            "summaryTab": "Resumen",
            "campaignCol": "Campaña",
            "typeCol": "Tipo",
            "urgencyCol": "Diagnóstico",
            "viewDetail": "Ver detalle"
        }
        update_json(ES_JSON_PATH, es_additions, "Reporte")
        
        en_additions = {
            "summaryTab": "Summary",
            "campaignCol": "Campaign",
            "typeCol": "Type",
            "urgencyCol": "Diagnosis",
            "viewDetail": "View detail"
        }
        update_json(EN_JSON_PATH, en_additions, "Reporte")
        
        print("Directiva y Script ejecutados con éxito.")

    except Exception as e:
        print(f"Error en el script: {str(e)}")

if __name__ == '__main__':
    main()

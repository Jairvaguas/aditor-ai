'use client';
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

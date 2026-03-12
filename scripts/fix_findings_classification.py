import os

def update_page_tsx():
    filepath = "src/app/reporte/[id]/page.tsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    old_logic = """    // Separar hallazgos por tipo
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
    const allWarnings = [...warningFindings, ...uncategorized];"""

    new_logic = """    // Separar hallazgos por tipo
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
    const allWarnings = [...warningFindings.filter((f: any) => !categorized.includes(f)), ...uncategorized.filter((f: any) => !warningFindings.includes(f))];"""

    if old_logic in content:
        content = content.replace(old_logic, new_logic)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated page.tsx logic")
    else:
        print("Could not find old logic in page.tsx")


def update_findings_tabs():
    filepath = "src/components/FindingsTabs.tsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update interface Finding
    old_interface = """interface Finding {
    tipo: string;
    campana_nombre: string;
    diagnostico: string;
    accion_concreta: string;
}"""
    new_interface = """interface Finding {
    tipo: string;
    campana_nombre: string;
    diagnostico: string;
    accion_concreta: string;
    urgencia?: string;
}"""
    if old_interface in content:
        content = content.replace(old_interface, new_interface)
        print("Updated interface Finding")
    
    # 2. Update getCategoryStyles
    old_styles = """    const getCategoryStyles = (category: string) => {
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
    };"""

    new_styles = """    const getCategoryStyles = (finding: Finding & { category?: string }) => {
        const type = (finding.tipo || '').toUpperCase();
        const urgency = (finding.urgencia || '').toUpperCase();
        
        const isCritical = finding.category === 'critical' || type.includes('CRÍTICO') || type.includes('PAUSAR') || type.includes('FATIGA') || type.includes('SIN GASTO') || type.includes('ENGAÑOSO') || type.includes('PROBLEMA') || urgency.includes('CRÍTICA') || urgency.includes('ALTA');
        const isOpportunity = finding.category === 'opportunity' || type.includes('OPORTUNIDAD') || type.includes('ESCALAR') || type.includes('MEJOR RENDIMIENTO') || urgency.includes('OPORTUNIDAD');

        if (isCritical) {
            return { bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.25)', text: '#FF6B6B' };
        } else if (isOpportunity) {
            return { bg: 'rgba(0,212,170,0.08)', border: 'rgba(0,212,170,0.25)', text: '#00D4AA' };
        } else {
            return { bg: 'rgba(255,230,109,0.08)', border: 'rgba(255,230,109,0.25)', text: '#FFE66D' };
        }
    };"""

    if old_styles in content:
        content = content.replace(old_styles, new_styles)
        print("Updated getCategoryStyles")

    # 3. Update getCategoryIcon
    old_icon = """    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'critical': return <PauseCircle className="w-4 h-4" />;
            case 'warning': return <AlertTriangle className="w-4 h-4" />;
            case 'opportunity': return <TrendingUp className="w-4 h-4" />;
            default: return <List className="w-4 h-4" />;
        }
    };"""

    new_icon = """    const getCategoryIcon = (finding: Finding & { category?: string }) => {
        const type = (finding.tipo || '').toUpperCase();
        const urgency = (finding.urgencia || '').toUpperCase();
        
        const isCritical = finding.category === 'critical' || type.includes('CRÍTICO') || type.includes('PAUSAR') || type.includes('FATIGA') || type.includes('SIN GASTO') || type.includes('ENGAÑOSO') || type.includes('PROBLEMA') || urgency.includes('CRÍTICA') || urgency.includes('ALTA');
        const isOpportunity = finding.category === 'opportunity' || type.includes('OPORTUNIDAD') || type.includes('ESCALAR') || type.includes('MEJOR RENDIMIENTO') || urgency.includes('OPORTUNIDAD');

        if (isCritical) return <PauseCircle className="w-4 h-4" />;
        if (isOpportunity) return <TrendingUp className="w-4 h-4" />;
        return <AlertTriangle className="w-4 h-4" />;
    };"""
    
    if old_icon in content:
        content = content.replace(old_icon, new_icon)
        print("Updated getCategoryIcon")

    # 4. Replace function calls
    content = content.replace("getCategoryStyles(finding.category)", "getCategoryStyles(finding)")
    content = content.replace("getCategoryIcon(finding.category)", "getCategoryIcon(finding)")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated FindingsTabs.tsx file contents")

if __name__ == "__main__":
    current_dir = os.getcwd()
    print("Running in:", current_dir)
    update_page_tsx()
    update_findings_tabs()

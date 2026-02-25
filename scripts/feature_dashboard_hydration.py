import os
import subprocess

def hydrate_dashboard():
    file_path = "src/app/dashboard/page.tsx"
    print(f"Modifying {file_path}...")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return

    # Replace the count query with the lastAudit logic
    old_query = """    const { count: auditCount } = await supabaseAdmin
        .from('auditorias')
        .select('*', { count: 'exact', head: true })
        .eq('clerk_user_id', user.id);

    const isZeroState = !auditCount || auditCount === 0;"""

    new_query = """    const { data: lastAudit } = await supabaseAdmin
        .from('auditorias')
        .select('*')
        .eq('clerk_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    const isZeroState = !lastAudit;
    
    let metrics = { roas: "--", ctr: "--", cpm: "$0", spend: "$0" };
    let hallazgos: any[] = [];
    
    if (lastAudit && lastAudit.xml_raw) {
        const extract = (xml: string, tag: string) => {
            const regex = new RegExp(`<${tag}>([\\\\s\\\\S]*?)<\\\\/${tag}>`);
            const match = xml.match(regex);
            return match ? match[1].trim() : '';
        };
        
        const metricasXml = extract(lastAudit.xml_raw, 'metricas_globales');
        if (metricasXml) {
            metrics = {
                roas: (extract(metricasXml, 'roas') || "--") + "x",
                ctr: (extract(metricasXml, 'ctr') || "--") + "%",
                cpm: "$" + (extract(metricasXml, 'cpm_promedio') || "0"),
                spend: "$" + (extract(metricasXml, 'gasto_total') || "0"),
            };
        }
        
        // Extraer los top 4 hallazgos para la tabla
        const hallazgoRegex = /<hallazgo id="(\\\\d+)">([\\\\s\\\\S]*?)<\\\\/hallazgo>/g;
        let match;
        while ((match = hallazgoRegex.exec(lastAudit.xml_raw)) !== null) {
            if (hallazgos.length >= 4) break;
            const content = match[2];
            const extractInner = (tag: string) => {
                const r = new RegExp(`<${tag}>([\\\\s\\\\S]*?)<\\\\/${tag}>`);
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
    }"""
    
    if old_query in content:
        content = content.replace(old_query, new_query)
    
    # Replace metrics rendering
    content = content.replace('{isZeroState ? "--" : "2.4x"}', '{isZeroState ? "--" : metrics.roas}')
    content = content.replace('{isZeroState ? "--" : "1.8%"}', '{isZeroState ? "--" : metrics.ctr}')
    content = content.replace('{isZeroState ? "$0" : "$14.2"}', '{isZeroState ? "$0" : metrics.cpm}')
    content = content.replace('{isZeroState ? "$0" : "$1,240"}', '{isZeroState ? "$0" : metrics.spend}')
    
    # Replace Table rendering
    old_table_body = """                                                {/* Mock Data from previous version, waiting to be hydrated natively */}
                                                <tr className="hover:bg-slate-800/40 transition-colors group cursor-pointer">
                                                    <td className="py-4 px-6">
                                                        <div className="font-bold text-white text-sm group-hover:text-[#00D4AA] transition-colors">Retargeting 7 días</div>
                                                        <div className="text-xs text-slate-500 mt-1">Última ed.: Ayer</div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="inline-flex items-center gap-1.5 bg-[#00D4AA]/10 text-[#00D4AA] text-xs font-bold px-2.5 py-1 rounded-md border border-[#00D4AA]/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] shadow-[0_0_5px_rgba(0,212,170,0.8)]"></span> Óptimo
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-slate-300 font-medium">$340</td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="font-bold font-syne text-[#00D4AA] text-base">4.2x</div>
                                                    </td>
                                                </tr>"""
                                                
    new_table_body = """                                                {hallazgos.map((h, i) => (
                                                    <tr key={i} className="hover:bg-slate-800/40 transition-colors group cursor-pointer">
                                                        <td className="py-4 px-6">
                                                            <div className={`font-bold text-white text-sm group-hover:${h.styles.text} transition-colors`}>{h.campana}</div>
                                                            <div className="text-xs text-slate-500 mt-1">Detectado por IA</div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className={`inline-flex items-center gap-1.5 ${h.styles.bg} ${h.styles.text} text-xs font-bold px-2.5 py-1 rounded-md border ${h.styles.border}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${h.styles.dot}`}></span> {h.estado}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6 text-sm text-slate-300 font-medium">--</td>
                                                        <td className="py-4 px-6 text-right">
                                                            <div className={`font-bold font-syne ${h.styles.text} text-base`}>{h.roi}</div>
                                                        </td>
                                                    </tr>
                                                ))}"""
    
    if old_table_body in content:
        content = content.replace(old_table_body, new_table_body)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated src/app/dashboard/page.tsx with direct XML hydration.")

def write_directive():
    dir_path = "directivas"
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, "hydration_dashboard_metrics.md")
    
    content = """# Directiva: Hydration de Métricas Globales del Dashboard

## Objetivo
El Dashboard no estaba leyendo los resultados post-auditoría. Solo veía si existía > 0 auditorías, pero no extraía los datos.

## Resolución (SOP de Extracción)
1. **Fetch**: Usamos `supabaseAdmin.from('auditorias').select('*').eq('clerk_user_id', user.id).order('created_at', { ascending: false }).limit(1).single()`.
2. **Parseo**: Dado que la data se guarda en `xml_raw`, construimos un extractor Regex nativo que busca `<metricas_globales>`.
3. **Mapeo**: 
   - `ROAS`, `CTR`, `CPM`, y `Gasto` se vuelcan directamente en las tarjetas superiores.
   - Extraemos los top 4 `<hallazgo>` y parseamos su tipo, para asignarle un color (🔴, 🟡, 🟢) y renderizar la "Tabla de Campañas" orgánicamente.
4. Si el XML se rompe o no hay data, se activan los fallbacks (`--`, `$0`) sin crashear el Server Component.
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {file_path}")

def main():
    hydrate_dashboard()
    write_directive()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "feat: hydrate dashboard global metrics and campaign table directly from the latest XML audit data via Supabase"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

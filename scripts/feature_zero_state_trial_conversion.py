import os
import subprocess

def create_audit_start_route():
    dir_path = "src/app/api/audit/start"
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, "route.ts")
    
    content = """import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getCampaignInsights } from '@/lib/meta-auth';
import { generateAudit } from '@/lib/audit';

export async function POST(request: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Obtener Perfil (Tokens, Moneda, Plan)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('meta_access_token, selected_ad_account_id, moneda, plan')
            .eq('clerk_user_id', clerkUserId)
            .single();

        if (profileError || !profile || !profile.meta_access_token || !profile.selected_ad_account_id) {
            return NextResponse.json({ error: 'Missing profile data or tokens' }, { status: 400 });
        }

        const accessToken = profile.meta_access_token;
        const adAccountId = profile.selected_ad_account_id;
        const currency = profile.moneda || 'USD';
        const plan = profile.plan || 'trial';

        // 2. Regla de Trial a Conversión
        if (plan === 'trial') {
            const { count, error: countError } = await supabaseAdmin
                .from('auditorias')
                .select('*', { count: 'exact', head: true })
                .eq('clerk_user_id', clerkUserId);

            if (!countError && count && count > 0) {
                return NextResponse.json({ 
                    success: false, 
                    reason: 'trial_exhausted', 
                    redirectUrl: '/subscribe' 
                });
            }
        }

        // 3. Obtener Campañas de Meta
        let campaigns;
        try {
            campaigns = await getCampaignInsights(accessToken, adAccountId);
        } catch (metaErr: any) {
            console.error('Meta API Error fetching insights:', metaErr.message);
            return NextResponse.json({ error: 'meta_api_error', details: metaErr.message }, { status: 502 });
        }

        if (!campaigns || campaigns.length === 0) {
            return NextResponse.json({ error: 'no_campaign_data' }, { status: 400 });
        }

        // 4. Generar Auditoría (IA)
        const auditResult = await generateAudit(campaigns, clerkUserId, currency);

        // 5. Devolver Éxito
        return NextResponse.json({
            success: true,
            auditId: auditResult.id,
            redirectUrl: `/teaser?auditId=${auditResult.id}`
        });

    } catch (error: any) {
        console.error('Error in /api/audit/start:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {file_path}")

def create_audit_trigger_button():
    dir_path = "src/components"
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, "AuditTriggerButton.tsx")
    
    content = """'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AuditTriggerButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAudit = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/audit/start', {
                method: 'POST'
            });
            const data = await res.json();

            if (res.ok && data.success) {
                router.push(data.redirectUrl);
            } else if (data.reason === 'trial_exhausted') {
                alert('Has agotado tu auditoría gratuita. ¡Pásate a Pro para análisis ilimitados!');
                router.push(data.redirectUrl || '/subscribe');
            } else {
                alert(`Error: ${data.error || 'Algo salió mal al conectar con Meta o la IA.'}`);
            }
        } catch (err) {
            alert('Error de red Inesperado.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button 
            onClick={handleAudit} 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(255,107,107,0.35)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Analizando Campañas...
                </>
            ) : (
                <>
                    <Sparkles className="w-5 h-5" /> Iniciar Auditoría
                </>
            )}
        </button>
    );
}
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created {file_path}")

def modify_dashboard_page():
    file_path = "src/app/dashboard/page.tsx"
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Inject new import
    import_stmt = 'import AuditTriggerButton from "@/components/AuditTriggerButton";\n'
    if import_stmt not in content:
        content = content.replace('import { checkSubscription }', f'{import_stmt}import {{ checkSubscription }}')

    # Add auditcount DB call before returning the page layout
    old_profile_call = """    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('meta_access_token')
        .eq('clerk_user_id', user.id)
        .single();

    const isConnectedToMeta = !!profile?.meta_access_token;"""

    new_profile_call = """    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('meta_access_token')
        .eq('clerk_user_id', user.id)
        .single();

    const isConnectedToMeta = !!profile?.meta_access_token;

    const { count: auditCount } = await supabaseAdmin
        .from('auditorias')
        .select('*', { count: 'exact', head: true })
        .eq('clerk_user_id', user.id);

    const isZeroState = !auditCount || auditCount === 0;"""
    
    if old_profile_call in content:
        content = content.replace(old_profile_call, new_profile_call)

    # Replace hardcoded metrics with ternaries for isZeroState
    content = content.replace('>2.4x</div>', '>{isZeroState ? "--" : "2.4x"}</div>')
    content = content.replace('>1.8%</div>', '>{isZeroState ? "--" : "1.8%"}</div>')
    content = content.replace('>$14.2</div>', '>{isZeroState ? "$0" : "$14.2"}</div>')
    content = content.replace('>$1,240</div>', '>{isZeroState ? "$0" : "$1,240"}</div>')

    # Replace Campaign Table Body with Zero State check
    old_tbody_start = '<tbody className="divide-y divide-slate-800/60">'
    old_tbody_end = '</tbody>'
    
    idx_start = content.find(old_tbody_start)
    idx_end = content.find(old_tbody_end, idx_start)
    
    if idx_start != -1 and idx_end != -1:
        new_tbody_content = """<tbody className="divide-y divide-slate-800/60">
                                        {isZeroState ? (
                                            <tr>
                                                <td colSpan={4} className="py-12 px-6 text-center text-slate-500">
                                                    Aún no hay datos. Conecta Meta e inicia tu primera auditoría interactiva.
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                {/* Mock Data from previous version, waiting to be hydrated natively */}
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
                                                </tr>
                                            </>
                                        )}
                                    </tbody>"""
        
        content = content[:idx_start] + new_tbody_content + content[idx_end + len(old_tbody_end):]

    # Replace Link logic with Client Button
    old_button_link = """<Link href="/teaser" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(255,107,107,0.35)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all relative z-10">
                                    <Sparkles className="w-5 h-5" /> Iniciar Auditoría
                                </Link>"""
    
    new_button_client = """<AuditTriggerButton />"""
    
    if old_button_link in content:
        content = content.replace(old_button_link, new_button_client)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Modified src/app/dashboard/page.tsx")

def main():
    create_audit_start_route()
    create_audit_trigger_button()
    modify_dashboard_page()

    print("Executing git commands...")
    try:
        subprocess.run(["git", "add", "."], check=True)
        status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
        if status.stdout.strip():
            subprocess.run(["git", "commit", "-m", "feat: implement Zero-State Dashboard and interactive Trial conversion in Audit Trigger"], check=True)
            subprocess.run(["git", "push"], check=True)
            print("Successfully pushed changes to GitHub.")
        else:
            print("No changes to commit. Everything is up to date.")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

if __name__ == "__main__":
    main()

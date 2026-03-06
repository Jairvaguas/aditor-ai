import os

FILE_COMP_SWITCHER = "src/components/AccountSwitcher.tsx"
FILE_PAGE_DASHBOARD = "src/app/dashboard/page.tsx"
FILE_LIB_AUDIT = "src/lib/audit.ts"
FILE_CRON_WEEKLY = "src/app/api/cron/weekly-audit/route.ts"

CONTENT_COMP_SWITCHER = """'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, Loader2 } from 'lucide-react';

interface ConnectedAccount {
    ad_account_id: string;
    account_name: string;
    currency: string;
}

export default function AccountSwitcher({ 
    accounts, 
    selectedAccountId 
}: { 
    accounts: ConnectedAccount[];
    selectedAccountId: string | null;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentAccount = accounts.find(a => a.ad_account_id === selectedAccountId);
    const displayName = currentAccount?.account_name || 'Seleccionar cuenta';

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSwitch = async (adAccountId: string) => {
        if (adAccountId === selectedAccountId) {
            setIsOpen(false);
            return;
        }
        setSwitching(true);
        try {
            const res = await fetch('/api/auth/switch-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adAccountId })
            });
            const data = await res.json();
            if (data.success) {
                setIsOpen(false);
                router.refresh();
            }
        } catch (error) {
            console.error('Error switching account:', error);
        } finally {
            setSwitching(false);
        }
    };

    // Si solo tiene 1 cuenta, mostrar solo el nombre sin dropdown
    if (accounts.length <= 1) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300">
                <span className="truncate max-w-[180px]">{displayName}</span>
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
            >
                {switching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                <span className="truncate max-w-[180px]">{displayName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 min-w-[260px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-800">
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Cuentas vinculadas</span>
                    </div>
                    {accounts.map((acc) => (
                        <button
                            key={acc.ad_account_id}
                            onClick={() => handleSwitch(acc.ad_account_id)}
                            disabled={switching}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-800/50 transition-colors
                                ${acc.ad_account_id === selectedAccountId ? 'bg-slate-800/30' : ''}
                                ${switching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            <div>
                                <div className="text-sm font-medium text-white">{acc.account_name}</div>
                                <div className="text-xs text-slate-500">ID: {acc.ad_account_id} • {acc.currency}</div>
                            </div>
                            {acc.ad_account_id === selectedAccountId && (
                                <Check className="w-4 h-4 text-[#00D4AA]" />
                            )}
                        </button>
                    ))}
                    <div className="border-t border-slate-800">
                        <a
                            href="/conectar/cuentas"
                            className="block px-4 py-3 text-sm text-[#FF6B6B] hover:bg-slate-800/50 transition-colors font-medium"
                        >
                            + Administrar cuentas
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
"""

def update_file(path, modifier_func):
    if not os.path.exists(path):
        print(f"Error: Could not find {path}")
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = modifier_func(content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {path}")

def modify_dashboard(content):
    # 2a. Import AccountSwitcher
    import_sel = 'import LanguageSelector from "@/components/LanguageSelector";'
    if 'import AccountSwitcher' not in content:
        content = content.replace(import_sel, import_sel + '\\nimport AccountSwitcher from "@/components/AccountSwitcher";')

    # 2b. Add connectedAccounts query
    old_profile = '''    const { data: profile } = await getSupabaseAdmin()
        .from('profiles')
        .select('meta_access_token')
        .eq('clerk_user_id', user.id)
        .single();

    const isConnectedToMeta = !!profile?.meta_access_token;'''
    new_profile = '''    const { data: profile } = await getSupabaseAdmin()
        .from('profiles')
        .select('meta_access_token, selected_ad_account_id, ad_accounts_count')
        .eq('clerk_user_id', user.id)
        .single();

    const isConnectedToMeta = !!profile?.meta_access_token;
    const selectedAccountId = profile?.selected_ad_account_id;

    // Obtener cuentas vinculadas del usuario
    const { data: connectedAccounts } = await getSupabaseAdmin()
        .from('connected_accounts')
        .select('ad_account_id, account_name, currency')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('connected_at', { ascending: true });'''
    content = content.replace(old_profile, new_profile)

    # 2c. Query last audit modified
    old_audit_query = '''    const { data: lastAudit } = await getSupabaseAdmin()
        .from('auditorias')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();'''
    new_audit_query = '''    let auditQuery = getSupabaseAdmin()
        .from('auditorias')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

    // Si hay cuenta seleccionada, filtrar auditorías por esa cuenta
    if (selectedAccountId) {
        auditQuery = auditQuery.eq('ad_account_id', selectedAccountId);
    }

    const { data: lastAudit } = await auditQuery.single();'''
    content = content.replace(old_audit_query, new_audit_query)

    # 2d. AccountSwitcher in header
    old_header = '''                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold font-display text-white">{t("hello", { name: displayName })}</h1>
                        <div className="hidden sm:flex px-3 py-1 bg-gradient-to-r from-[#FF6B6B]/20 to-[#ff8e53]/20 border border-[#FF6B6B]/30 rounded-full text-[#FF6B6B] text-xs font-bold tracking-wide shadow-[0_0_10px_rgba(255,107,107,0.1)]">
                            {t("plan")}
                        </div>
                    </div>'''
    new_header = '''                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold font-display text-white">{t("hello", { name: displayName })}</h1>
                        <div className="hidden sm:flex px-3 py-1 bg-gradient-to-r from-[#FF6B6B]/20 to-[#ff8e53]/20 border border-[#FF6B6B]/30 rounded-full text-[#FF6B6B] text-xs font-bold tracking-wide shadow-[0_0_10px_rgba(255,107,107,0.1)]">
                            {t("plan")}
                        </div>
                        {connectedAccounts && connectedAccounts.length > 0 && (
                            <AccountSwitcher 
                                accounts={connectedAccounts} 
                                selectedAccountId={selectedAccountId || null} 
                            />
                        )}
                    </div>'''
    content = content.replace(old_header, new_header)
    return content

def modify_audit(content):
    old_fetch = '''  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );'''
    new_fetch = '''  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('selected_ad_account_id')
    .eq('clerk_user_id', userId)
    .single();
  const selectedAdAccountId = campaigns[0]?.ad_account_id || userProfile?.selected_ad_account_id || 'unknown';'''
    
    if "selected_ad_account_id" not in content:
        content = content.replace(old_fetch, new_fetch)
        content = content.replace("ad_account_id: campaigns[0]?.ad_account_id || 'unknown',", "ad_account_id: selectedAdAccountId,")
    
    return content

def modify_cron(content):
    old_loop = '''    for (const user of users) {
        try {
            if (!user.connected_accounts?.length) continue;

            const account = user.connected_accounts[0];

            // Por ahora usar datos de prueba hasta tener Meta API real
            const mockCampaigns = [{
                id: 'auto_001',
                nombre: 'Auditoría automática semanal',
                ad_account_id: account.ad_account_id,
                estado: 'activa',
                presupuesto_diario: 50,
                metricas_30d: {
                    roas: 2.1, ctr: 1.2, cpm: 12.5, cpc: 1.04,
                    frecuencia: 3.2, gasto_total: 1400,
                    conversiones: 45, valor_conversiones: 2940,
                    pagos_iniciados: 58, visitas_landing: 1680
                }
            }];

            const audit = await generateAudit(
                mockCampaigns,
                user.clerk_user_id,
                user.moneda,
                user.pais
            );

            // Actualizar tipo a automatica
            await supabase
                .from('auditorias')
                .update({ tipo: 'automatica' })
                .eq('id', audit.id);

            // Parse XML to get score and findings count for email
            let score = 0;
            let hallazgosCount = 0;
            try {
                const parsed = parser.parse(audit.xml);
                const scoreVal = parsed.auditoria?.score_cuenta?.valor;
                score = parseInt(scoreVal) || 0;

                const findings = parsed.auditoria?.hallazgos?.hallazgo;
                hallazgosCount = Array.isArray(findings) ? findings.length : (findings ? 1 : 0);
            } catch (e) {
                console.error('Error parsing XML for email:', e);
            }

            // Send Weekly Email
            await sendWeeklyAuditEmail(
                user.email,
                audit.id,
                score,
                hallazgosCount,
                mockCampaigns[0].metricas_30d.roas,
                mockCampaigns[0].metricas_30d.gasto_total
            );

            results.push({ userId: user.clerk_user_id, auditId: audit.id, status: 'ok', emailSent: true });

        } catch (error) {
            console.error(`Error processing user ${user.clerk_user_id}:`, error);
            results.push({ userId: user.clerk_user_id, status: 'error', error });
        }
    }'''
    new_loop = '''    for (const user of users) {
        try {
            // Obtener todas las cuentas vinculadas y activas
            const { data: accounts } = await supabase
                .from('connected_accounts')
                .select('ad_account_id, currency')
                .eq('user_id', user.clerk_user_id)
                .eq('is_active', true);

            if (!accounts || accounts.length === 0) continue;

            for (const account of accounts) {
                try {
                    // Por ahora usar datos de prueba hasta tener Meta API real
                    const mockCampaigns = [{
                        id: `auto_${account.ad_account_id}`,
                        nombre: 'Auditoría automática semanal',
                        ad_account_id: account.ad_account_id,
                        estado: 'activa',
                        presupuesto_diario: 50,
                        metricas_30d: {
                            roas: 2.1, ctr: 1.2, cpm: 12.5, cpc: 1.04,
                            frecuencia: 3.2, gasto_total: 1400,
                            conversiones: 45, valor_conversiones: 2940,
                            pagos_iniciados: 58, visitas_landing: 1680
                        }
                    }];

                    const audit = await generateAudit(
                        mockCampaigns,
                        user.clerk_user_id,
                        user.moneda || account.currency || 'USD',
                        user.pais
                    );

                    // Actualizar tipo a automatica
                    await supabase
                        .from('auditorias')
                        .update({ tipo: 'automatica' })
                        .eq('id', audit.id);

                    // Parse XML to get score and findings count for email
                    let score = 0;
                    let hallazgosCount = 0;
                    try {
                        const parsed = parser.parse(audit.xml);
                        const scoreVal = parsed.auditoria?.score_cuenta?.valor;
                        score = parseInt(scoreVal) || 0;

                        const findings = parsed.auditoria?.hallazgos?.hallazgo;
                        hallazgosCount = Array.isArray(findings) ? findings.length : (findings ? 1 : 0);
                    } catch (e) {
                        console.error('Error parsing XML for email:', e);
                    }

                    // Send Weekly Email
                    await sendWeeklyAuditEmail(
                        user.email,
                        audit.id,
                        score,
                        hallazgosCount,
                        mockCampaigns[0].metricas_30d.roas,
                        mockCampaigns[0].metricas_30d.gasto_total
                    );

                    results.push({ userId: user.clerk_user_id, adAccountId: account.ad_account_id, auditId: audit.id, status: 'ok', emailSent: true });

                } catch (accError) {
                    console.error(`Error processing account ${account.ad_account_id} for user ${user.clerk_user_id}:`, accError);
                    results.push({ userId: user.clerk_user_id, adAccountId: account.ad_account_id, status: 'error', error: accError });
                }
            }

        } catch (error) {
            console.error(`Error processing user ${user.clerk_user_id}:`, error);
            results.push({ userId: user.clerk_user_id, status: 'error', error });
        }
    }'''
    if "for (const account of accounts)" not in content:
        content = content.replace(old_loop, new_loop)
    return content

def execute():
    os.makedirs(os.path.dirname(FILE_COMP_SWITCHER), exist_ok=True)
    with open(FILE_COMP_SWITCHER, 'w', encoding='utf-8') as f:
        f.write(CONTENT_COMP_SWITCHER)
    print(f"Created {FILE_COMP_SWITCHER}")

    update_file(FILE_PAGE_DASHBOARD, modify_dashboard)
    update_file(FILE_LIB_AUDIT, modify_audit)
    update_file(FILE_CRON_WEEKLY, modify_cron)

execute()

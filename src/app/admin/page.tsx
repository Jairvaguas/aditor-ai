import { getSupabaseAdmin } from "@/lib/supabase";
import { Users, CreditCard, Activity, DollarSign, LogOut, Search, Settings, Sparkles, BarChart2, Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import UserGrowthChart from "./UserGrowthChart";

export const dynamic = "force-dynamic";

async function getStats() {
    const { data: profiles, error } = await getSupabaseAdmin()
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error || !profiles) {
        return { users: [], stats: { active: 0, trial: 0, inactive: 0, mrr: 0, total: 0 }, chartData: [] };
    }

    const now = new Date().getTime();
    let active = 0;
    let trial = 0;
    let inactive = 0;

    // Monthly grouped data container
    const monthsData: Record<string, { registrados: number, activos: number, inactivos: number }> = {};

    profiles.forEach((p) => {
        const isSubscribed = p.is_subscribed;
        const isTrial = p.trial_ends_at && new Date(p.trial_ends_at).getTime() > now;

        if (isSubscribed) {
            active++;
        } else if (isTrial) {
            trial++;
        } else {
            inactive++;
        }

        // Month string formulation "YYYY-MM"
        const createdAt = new Date(p.created_at);
        const y = createdAt.getFullYear();
        const m = (createdAt.getMonth() + 1).toString().padStart(2, '0');
        const monthKey = `${y}-${m}`;

        if (!monthsData[monthKey]) {
            monthsData[monthKey] = { registrados: 0, activos: 0, inactivos: 0 };
        }

        monthsData[monthKey].registrados++;
        if (isSubscribed) {
            monthsData[monthKey].activos++;
        } else {
            monthsData[monthKey].inactivos++;
        }
    });

    const mrr = active * 47;

    // Formulate final chartData sorting by date and taking last 6
    const chartData = Object.keys(monthsData)
        .sort((a, b) => a.localeCompare(b)) // ascending for chronological chart plotting
        .slice(-6) // take only last 6 months
        .map(key => ({
            mes: new Date(`${key}-01T00:00:00`).toLocaleString('default', { month: 'short' }).toUpperCase(),
            registrados: monthsData[key].registrados,
            activos: monthsData[key].activos,
            inactivos: monthsData[key].inactivos
        }));

    return {
        users: profiles,
        stats: { active, trial, inactive, mrr, total: profiles.length },
        chartData
    };
}

export default async function AdminDashboard() {
    const { users, stats, chartData } = await getStats();

    return (
        <main className="min-h-screen bg-[#0B1120] text-white font-sans flex overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF6B6B] opacity-[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00D4AA] opacity-[0.03] rounded-full blur-[150px]" />
            </div>

            {/* Sidebar Fixa (Desktop) */}
            <aside className="fixed top-0 left-0 w-64 h-full bg-[#0B1120] border-r border-slate-800 z-40 hidden lg:flex flex-col">
                <div className="h-20 flex items-center px-8 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/favicon.ico" alt="Aditor AI" width={32} height={32} />
                        <span className="text-xl font-bold font-syne text-white tracking-tight">Aditor AI</span>
                    </Link>
                </div>

                <div className="flex-1 py-8 px-4 flex flex-col gap-2">
                    <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menú Principal</div>

                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors">
                        <BarChart2 className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link href="/dashboard/auditorias" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors">
                        <Search className="w-5 h-5" />
                        <span>Auditorías</span>
                    </Link>


                    <Link href="/dashboard/config" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors mt-auto">
                        <Settings className="w-5 h-5" />
                        <span>Configuración</span>
                    </Link>

                    <div className="h-px bg-slate-800 my-2"></div>

                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00D4AA]/10 text-[#00D4AA] font-medium transition-colors">
                        <Users className="w-5 h-5" />
                        <span>Admin Panel</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative z-10 flex flex-col h-screen overflow-y-auto w-full">

                {/* Header Superior */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/50 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold font-syne text-white">Administración</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative cursor-pointer hover:bg-slate-700 transition-colors">
                            <Bell className="w-5 h-5 text-slate-300" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 pb-32 lg:pb-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">

                    <p className="text-slate-400 text-sm mb-2">Resumen general y gestión de usuarios del sistema</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-slate-400 font-medium text-sm">Registrados</div>
                                <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-5 h-5 text-blue-400" /></div>
                            </div>
                            <div className="text-3xl font-extrabold font-syne text-white mb-2 group-hover:text-blue-400 transition-colors">{stats.total}</div>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-slate-400 font-medium text-sm">Activos</div>
                                <div className="p-2 bg-green-500/10 rounded-lg"><Activity className="w-5 h-5 text-green-400" /></div>
                            </div>
                            <div className="text-3xl font-extrabold font-syne text-white mb-2 group-hover:text-green-400 transition-colors">{stats.active}</div>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-slate-400 font-medium text-sm">En Trial</div>
                                <div className="p-2 bg-amber-500/10 rounded-lg"><CreditCard className="w-5 h-5 text-amber-400" /></div>
                            </div>
                            <div className="text-3xl font-extrabold font-syne text-white mb-2 group-hover:text-amber-400 transition-colors">{stats.trial}</div>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-slate-400 font-medium text-sm">Inactivos</div>
                                <div className="p-2 bg-red-500/10 rounded-lg"><Users className="w-5 h-5 text-red-400" /></div>
                            </div>
                            <div className="text-3xl font-extrabold font-syne text-white mb-2 group-hover:text-red-400 transition-colors">{stats.inactive}</div>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-slate-400 font-medium text-sm">MRR (USD)</div>
                                <div className="p-2 bg-[#4ECDC4]/10 rounded-lg"><DollarSign className="w-5 h-5 text-[#4ECDC4]" /></div>
                            </div>
                            <div className="text-3xl font-extrabold font-syne text-white mb-2 group-hover:text-[#4ECDC4] transition-colors">${stats.mrr}</div>
                        </div>
                    </div>

                    {/* Recharts Graphical Display */}
                    <UserGrowthChart data={chartData} />

                    {/* Table */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex flex-col mt-4">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                            <div>
                                <h2 className="text-lg font-bold font-syne text-white">Listado de Usuarios</h2>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#0B1120] text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="py-4 px-6 font-medium">Email / ID</th>
                                        <th className="py-4 px-6 font-medium">Estado</th>
                                        <th className="py-4 px-6 font-medium">Plan (Cuentas)</th>
                                        <th className="py-4 px-6 font-medium">Fecha de Registro</th>
                                        <th className="py-4 px-6 font-medium">Trial Hasta</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {users.map((u, i) => {
                                        const now = new Date().getTime();
                                        let statusLabel = "Inactivo";
                                        let statusClass = "bg-red-500/10 text-red-400 border border-red-500/20";

                                        if (u.is_subscribed) {
                                            statusLabel = "Activo";
                                            statusClass = "bg-green-500/10 text-green-400 border border-green-500/20";
                                        } else if (u.trial_ends_at && new Date(u.trial_ends_at).getTime() > now) {
                                            statusLabel = "Trial";
                                            statusClass = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                                        }

                                        return (
                                            <tr key={i} className="hover:bg-slate-800/40 transition-colors group cursor-pointer">
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-white text-sm group-hover:text-[#00D4AA] transition-colors">{u.email || "Sin Email"}</div>
                                                    <div className="text-xs text-slate-500 mt-1">{u.clerk_user_id}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md ${statusClass}`}>
                                                        {statusLabel}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-slate-300 font-medium">
                                                    {u.plan || "trial"} <span className="text-slate-500">({u.ad_accounts_count || 1})</span>
                                                </td>
                                                <td className="py-4 px-6 text-slate-400 text-sm">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-6 text-slate-400 text-sm">
                                                    {u.trial_ends_at ? new Date(u.trial_ends_at).toLocaleDateString() : "-"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 pb-5 pt-3 flex justify-around items-center z-50 px-2 transition-transform">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 w-16">
                    <BarChart2 className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Dashboard</span>
                </Link>

                <Link href="/admin" className="flex flex-col items-center gap-1 text-[#00D4AA] hover:text-white w-16 transition-colors">
                    <Users className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Admin</span>
                </Link>
            </div>
        </main>
    );
}
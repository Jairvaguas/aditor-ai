import { supabaseAdmin } from "@/lib/supabase";
import { Users, CreditCard, Activity, DollarSign, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
    const { data: profiles, error } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    if (error || !profiles) {
        return { users: [], stats: { active: 0, trial: 0, inactive: 0, mrr: 0, total: 0 } };
    }

    const now = new Date().getTime();
    let active = 0;
    let trial = 0;
    let inactive = 0;

    profiles.forEach((p) => {
        if (p.is_subscribed) {
            active++;
        } else if (p.trial_ends_at && new Date(p.trial_ends_at).getTime() > now) {
            trial++;
        } else {
            inactive++;
        }
    });

    const mrr = active * 47;

    return {
        users: profiles,
        stats: { active, trial, inactive, mrr, total: profiles.length }
    };
}

export default async function AdminDashboard() {
    const { users, stats } = await getStats();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Panel Administrativo</h1>
                    <p className="text-slate-400">Resumen general y gestión de usuarios</p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="p-6 rounded-2xl bg-[#1A2234] border border-slate-800 flex flex-col items-center text-center">
                    <div className="p-3 bg-blue-500/10 rounded-xl mb-3"><Users className="w-6 h-6 text-blue-400" /></div>
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-slate-400 text-sm mt-1">Registrados</div>
                </div>
                <div className="p-6 rounded-2xl bg-[#1A2234] border border-slate-800 flex flex-col items-center text-center">
                    <div className="p-3 bg-green-500/10 rounded-xl mb-3"><Activity className="w-6 h-6 text-green-400" /></div>
                    <div className="text-3xl font-bold">{stats.active}</div>
                    <div className="text-slate-400 text-sm mt-1">Activos</div>
                </div>
                <div className="p-6 rounded-2xl bg-[#1A2234] border border-slate-800 flex flex-col items-center text-center">
                    <div className="p-3 bg-amber-500/10 rounded-xl mb-3"><CreditCard className="w-6 h-6 text-amber-400" /></div>
                    <div className="text-3xl font-bold">{stats.trial}</div>
                    <div className="text-slate-400 text-sm mt-1">En Trial</div>
                </div>
                <div className="p-6 rounded-2xl bg-[#1A2234] border border-slate-800 flex flex-col items-center text-center">
                    <div className="p-3 bg-red-500/10 rounded-xl mb-3"><Users className="w-6 h-6 text-red-400" /></div>
                    <div className="text-3xl font-bold">{stats.inactive}</div>
                    <div className="text-slate-400 text-sm mt-1">Inactivos</div>
                </div>
                <div className="p-6 rounded-2xl bg-[#1A2234] border border-slate-800 flex flex-col items-center text-center">
                    <div className="p-3 bg-[#4ECDC4]/10 rounded-xl mb-3"><DollarSign className="w-6 h-6 text-[#4ECDC4]" /></div>
                    <div className="text-3xl font-bold">${stats.mrr}</div>
                    <div className="text-slate-400 text-sm mt-1">MRR (USD)</div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1A2234] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold">Listado de Usuarios</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#0B1120] text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Email / ID</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                                <th className="px-6 py-4 font-medium">Plan (Cuentas)</th>
                                <th className="px-6 py-4 font-medium">Fecha de Registro</th>
                                <th className="px-6 py-4 font-medium">Trial Hasta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {users.map((u, i) => {
                                const now = new Date().getTime();
                                let statusLabel = "Inactivo";
                                let statusClass = "bg-red-500/10 text-red-400 border-red-500/20";
                                
                                if (u.is_subscribed) {
                                    statusLabel = "Activo";
                                    statusClass = "bg-green-500/10 text-green-400 border-green-500/20";
                                } else if (u.trial_ends_at && new Date(u.trial_ends_at).getTime() > now) {
                                    statusLabel = "Trial";
                                    statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                                }

                                return (
                                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{u.email || "Sin Email"}</div>
                                            <div className="text-xs text-slate-500">{u.clerk_user_id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusClass}`}>
                                                {statusLabel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {u.plan || "trial"} <span className="text-slate-500">({u.ad_accounts_count || 1})</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
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
    );
}
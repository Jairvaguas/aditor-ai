import os

def write_file(path, content):
    dirname = os.path.dirname(path)
    if dirname:
        os.makedirs(dirname, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Creado/Actualizado: {path}")

def build_admin_dashboard():
    # 1. Update middleware.ts
    middleware_ts = """
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/conectar(.*)',
  '/teaser(.*)',
  '/login(.*)',
  '/registro(.*)',
  '/subscribe(.*)',
  '/privacidad(.*)',
  '/terminos(.*)',
  '/eliminar-datos(.*)',
  '/api/meta/callback(.*)',
  '/api/payments/create-subscription(.*)',
  '/api/payments/webhook(.*)',
  '/api/payments/test-webhook(.*)',
  '/api/admin(.*)',
  '/admin/login(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
      const adminSession = req.cookies.get('admin_session')?.value;
      if (adminSession !== 'true') {
          return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      return NextResponse.next();
  }
  
  if (!req.nextUrl.pathname.startsWith('/admin') && !isPublicRoute(req)) {
      await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
"""
    write_file("src/middleware.ts", middleware_ts)

    # 2. API Admin Login Route
    api_login_route = """
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (
            username === process.env.ADMIN_USER &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const response = NextResponse.json({ success: true });
            response.cookies.set({
                name: 'admin_session',
                value: 'true',
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 1 semana
            });
            return response;
        }

        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
"""
    write_file("src/app/api/admin/login/route.ts", api_login_route)

    # 3. API Admin Logout Route
    api_logout_route = """
import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin_session');
    return response;
}
"""
    write_file("src/app/api/admin/logout/route.ts", api_logout_route)

    # 4. Admin Layout
    layout_tsx = """
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Aditor AI",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans antialiased">
      {children}
    </div>
  );
}
"""
    write_file("src/app/admin/layout.tsx", layout_tsx)

    # 5. Admin Login Page
    login_page_tsx = """
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                setError("Usuario o contraseña incorrectos");
            }
        } catch (e) {
            setError("Error al conectar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#1A2234] p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                    <p className="text-slate-400 text-sm">Ingreso exclusivo staff</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Usuario</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                <User className="w-5 h-5"/>
                            </span>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#4ECDC4] transition-colors"
                                placeholder="Admin"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Contraseña</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                <Lock className="w-5 h-5"/>
                            </span>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#4ECDC4] transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-6 disabled:opacity-50"
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
"""
    write_file("src/app/admin/login/page.tsx", login_page_tsx)

    # 6. Admin Dashboard Page
    dashboard_page_tsx = """
import { supabaseAdmin } from "@/lib/supabase";
import { Users, CreditCard, Activity, DollarSign, LogOut, Search, Settings, Sparkles, BarChart2, Bell } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

                    <Link href="/dashboard/hooks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors">
                        <Sparkles className="w-5 h-5" />
                        <span>Hooks IA</span>
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
"""
    write_file("src/app/admin/page.tsx", dashboard_page_tsx)

if __name__ == "__main__":
    print("Ejecutando setup del Admin Dashboard...")
    build_admin_dashboard()

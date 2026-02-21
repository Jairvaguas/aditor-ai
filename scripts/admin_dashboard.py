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
"""
    write_file("src/app/admin/page.tsx", dashboard_page_tsx)

if __name__ == "__main__":
    print("Ejecutando setup del Admin Dashboard...")
    build_admin_dashboard()

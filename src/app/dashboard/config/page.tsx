import { currentUser } from "@clerk/nextjs/server";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { checkSubscription } from "@/lib/checkSubscription";
import { supabaseAdmin } from "@/lib/supabase";
import {
    Bell,
    Search,
    Sparkles,
    Settings,
    BarChart2,
    CheckCircle2,
    CreditCard,
    User,
    LogOut,
    Unplug,
    AlertTriangle
} from "lucide-react";
import { CancelSubscriptionCard } from "@/components/CancelSubscriptionCard";
import { getTranslations } from "next-intl/server";
import { DisconnectMetaButton } from "@/components/DisconnectMetaButton";

export default async function ConfigPage() {
    const tHeader = await getTranslations("Header");
    const user = await currentUser();

    if (!user) {
        redirect("/registro");
    }

    const hasAccess = await checkSubscription(user.id);
    if (!hasAccess) {
        redirect("/subscribe");
    }

    const displayName = user.firstName || user.username || "Usuario";
    const email = user.emailAddresses[0]?.emailAddress || "No email";

    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('meta_access_token, is_subscribed, trial_ends_at')
        .eq('clerk_user_id', user.id)
        .single();

    const isConnectedToMeta = !!profile?.meta_access_token;

    // Logic for Plan and Dates
    const isSubscribed = profile?.is_subscribed;
    const isTrialing = !isSubscribed && profile?.trial_ends_at && new Date(profile.trial_ends_at).getTime() > new Date().getTime();

    const planName = isSubscribed ? "Plan PRO Activo" : (isTrialing ? "Prueba Gratuita" : "Inactivo");
    const renewalDate = isTrialing ? `Expira: ${new Date(profile!.trial_ends_at!).toLocaleDateString()}` : "Renovación Mensual";
    const hasActivePlan = isSubscribed || isTrialing;

    return (
        <main className="min-h-screen bg-[#0B1120] text-white font-sans flex overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF6B6B] opacity-[0.03] rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00D4AA] opacity-[0.03] rounded-full blur-[150px]" />
            </div>

            {/* Sidebar Fixa (Desktop) */}
            <aside className="fixed top-0 left-0 w-64 h-full bg-[#0B1120] border-r border-slate-800 z-40 hidden lg:flex flex-col">
                {/* Logo */}
                <div className="h-20 flex items-center px-8 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/favicon.ico" alt="Aditor AI" width={32} height={32} />
                        <span className="text-xl font-bold font-syne text-white tracking-tight">Aditor AI</span>
                    </Link>
                </div>

                {/* Navegación */}
                <div className="flex-1 py-8 px-4 flex flex-col gap-2">
                    <div className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menú Principal</div>

                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors">
                        <BarChart2 className="w-5 h-5" />
                        <span>{tHeader("dashboard")}</span>
                    </Link>

                    <Link href="/dashboard/auditorias" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors">
                        <Search className="w-5 h-5" />
                        <span>{tHeader("audits")}</span>
                    </Link>


                    <Link href="/dashboard/config" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00D4AA]/10 text-[#00D4AA] font-medium transition-colors mt-auto">
                        <Settings className="w-5 h-5" />
                        <span>{tHeader("configuration")}</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative z-10 flex flex-col h-screen overflow-y-auto w-full">

                {/* Header Superior */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/50 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold font-syne text-white">Configuración</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center relative cursor-pointer hover:bg-slate-700 transition-colors">
                            <Bell className="w-5 h-5 text-slate-300" />
                        </div>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 border-2 border-slate-700 hover:border-[#00D4AA] transition-colors",
                                }
                            }}
                        />
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 pb-32 flex flex-col gap-8 max-w-4xl mx-auto w-full">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Perfil */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                    <User className="w-6 h-6" />
                                </div>
                                <h2 className="text-lg font-bold font-syne text-white">Datos del Perfil</h2>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Nombre</label>
                                    <div className="text-sm font-medium text-white bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700">{displayName}</div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Email</label>
                                    <div className="text-sm font-medium text-slate-300 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700">{email}</div>
                                </div>
                            </div>
                        </div>

                        {/* Suscripción */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                                <div className="p-3 bg-[#00D4AA]/10 rounded-xl text-[#00D4AA]">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <h2 className="text-lg font-bold font-syne text-white">Suscripción</h2>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Plan Actual</label>
                                    <div className="flex items-center gap-2 text-sm font-bold text-[#00D4AA] bg-[#00D4AA]/5 px-4 py-3 rounded-xl border border-[#00D4AA]/20">
                                        <CheckCircle2 className="w-4 h-4" /> {planName}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">Renovación</label>
                                    <div className="text-sm font-medium text-slate-300 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700">{renewalDate}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zona de Peligro / Cancelar */}
                    {hasActivePlan && (
                        <CancelSubscriptionCard />
                    )}

                    {/* Acciones de cuenta */}
                    <div className="bg-[#1A1A2E]/80 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-white mb-1">Conexión de Meta Ads</h3>
                            <p className="text-xs text-slate-400">
                                {isConnectedToMeta ? "Tu cuenta publicitaria está conectada y analizando campañas." : "No tienes ninguna cuenta de Meta conectada."}
                            </p>
                        </div>
                        {isConnectedToMeta ? (
                            <DisconnectMetaButton />
                        ) : hasActivePlan ? (
                            <Link href="/conectar" className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium text-sm py-3 px-6 rounded-xl transition-colors whitespace-nowrap">
                                <span className="font-bold text-lg leading-none mb-0.5">f</span> Conectar Meta Ads
                            </Link>
                        ) : (
                            <Link href="/subscribe?reactivate=true" className="flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-medium text-sm py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-[0_4px_14px_rgba(255,107,107,0.35)]">
                                <CreditCard className="w-4 h-4" /> Reactivar suscripción
                            </Link>
                        )}
                    </div>

                    <div className="flex justify-end mt-4">
                        <SignOutButton>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-[#FF6B6B] font-medium text-sm py-2 px-4 rounded-xl transition-colors">
                                <LogOut className="w-4 h-4" /> {tHeader("logout")}
                            </button>
                        </SignOutButton>
                    </div>

                </div>
            </div>

            {/* Mobile Bottom Navigation (Only visible on tight screens if users visit on mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 pb-5 pt-3 flex justify-around items-center z-50 px-2 transition-transform">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                    <BarChart2 className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{tHeader("dashboard")}</span>
                </Link>

                <Link href="/dashboard/auditorias" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{tHeader("audits")}</span>
                </Link>


                <Link href="/dashboard/config" className="flex flex-col items-center gap-1 text-[#00D4AA] w-16">
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{tHeader("configuration")}</span>
                </Link>
            </div>

        </main>
    );
}

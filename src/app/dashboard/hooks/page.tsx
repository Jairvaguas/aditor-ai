import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { checkSubscription } from "@/lib/checkSubscription";
import {
    Bell,
    Search,
    Sparkles,
    Settings,
    BarChart2
} from "lucide-react";
import { HooksGenerator } from "@/components/HooksGenerator";

export default async function HooksPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/registro");
    }

    const hasAccess = await checkSubscription(user.id);
    if (!hasAccess) {
        redirect("/subscribe");
    }

    const displayName = user.firstName || user.username || "Usuario";



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
                        <span className="text-xl font-bold font-display text-white tracking-tight">Aditor AI</span>
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

                    <Link href="/dashboard/hooks" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00D4AA]/10 text-[#00D4AA] font-medium transition-colors">
                        <Sparkles className="w-5 h-5" />
                        <span>Hooks IA</span>
                    </Link>

                    <Link href="/dashboard/config" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white font-medium transition-colors mt-auto">
                        <Settings className="w-5 h-5" />
                        <span>Configuración</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative z-10 flex flex-col h-screen overflow-y-auto w-full">

                {/* Header Superior */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/50 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold font-display text-white">Laboratorio de Hooks</h1>
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

                {/* Content */}
                <div className="p-8 pb-32 flex flex-col gap-8 max-w-6xl mx-auto w-full">

                    <HooksGenerator />

                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 pb-5 pt-3 flex justify-around items-center z-50 px-2 transition-transform">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                    <BarChart2 className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Dashboard</span>
                </Link>

                <Link href="/dashboard/auditorias" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Auditorías</span>
                </Link>

                <Link href="/dashboard/hooks" className="flex flex-col items-center gap-1 text-[#00D4AA] w-16">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Hooks IA</span>
                </Link>

                <Link href="/dashboard/config" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white w-16 transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Config</span>
                </Link>
            </div>
        </main>
    );
}


import { supabaseAdmin } from "@/lib/supabase";
import { XMLParser } from "fast-xml-parser";
import HooksView from "./hooks-view";
import Link from "next/link";

export const revalidate = 0;

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function HooksPage(props: PageProps) {
    const params = await props.params;
    const { id } = params;

    // 1. Fetch Audit using params.id
    const { data: audit, error } = await supabaseAdmin
        .from('auditorias')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !audit) {
        return (
            <div className="min-h-screen bg-[#1A1A2E] text-white flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Auditoría no encontrada</h1>
                    <Link href="/dashboard" className="text-[#E94560] hover:underline">
                        Volver al Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // 2. Parse XML
    const parser = new XMLParser();
    let hooks = [];
    try {
        const result = parser.parse(audit.xml_raw);
        const hooksData = result.auditoria?.hooks_sugeridos?.hook;
        // Normalize to array
        hooks = Array.isArray(hooksData) ? hooksData : (hooksData ? [hooksData] : []);
    } catch (e) {
        console.error("XML Parse Error", e);
    }

    return (
        <main className="min-h-screen bg-[#1A1A2E] text-white font-sans relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E94560] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#4ECDC4] rounded-full blur-[120px]" />
            </div>

            <HooksView hooks={hooks} auditId={id} />
        </main>
    );
}

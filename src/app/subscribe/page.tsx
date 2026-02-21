import DynamicPricingForm from '@/components/DynamicPricingForm';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Definimos la prop searchParams para atrapar '?canceled=true'
export default async function SubscribePage({ searchParams }: { searchParams: { canceled?: string, reactivate?: string } }) {
    // Obtener la tasa de cambio en vivo
    let estimatedCop = 185000;
    try {
        const copRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD", { next: { revalidate: 3600 } });
        if (copRes.ok) {
            const data = await copRes.json();
            if (data && data.rates && data.rates.COP) {
                estimatedCop = Math.round(47 * data.rates.COP);
            }
        }
    } catch (e) {
        console.error("Error fetching exchange rate for display:", e);
    }
    const formattedCop = new Intl.NumberFormat('es-CO').format(estimatedCop);
    return (
        <div className="flex flex-col min-h-screen bg-[#0B1120] text-[#F0F0F0] font-sans selection:bg-[#FF6B6B]/30 pt-32">
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[#131D2E] text-white rounded-2xl shadow-xl overflow-hidden pt-12 pb-16 border border-slate-800 w-full mb-12">

                {/* Cancelation Message Banner */}
                {searchParams?.canceled === 'true' && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl mb-8 max-w-2xl mx-auto flex items-center justify-center gap-2 font-medium">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tu suscripción fue cancelada exitosamente.
                    </div>
                )}

                {/* Reactivation Message Banner */}
                {searchParams?.reactivate === 'true' && (
                    <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-[#FF6B6B] p-4 rounded-xl mb-8 max-w-2xl mx-auto flex items-center justify-center gap-2 font-medium">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tu suscripción está inactiva. Reactívala para reconectar tu cuenta de Meta Ads.
                    </div>
                )}
                <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                    Aditor AI - Plan Profesional
                </h1>
                <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                    Lleva tus auditorías de Meta Ads al siguiente nivel. Obtén acceso ilimitado a todas nuestras herramientas impulsadas por IA.
                </p>

                <DynamicPricingForm copRate={estimatedCop / 47} />

                <p className="text-sm text-gray-400">
                    Cancela en cualquier momento. El cobro se realizará automáticamente al finalizar tu periodo de prueba.
                </p>
            </main>
            <Footer />
        </div>
    );
}

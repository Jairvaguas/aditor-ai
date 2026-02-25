'use client';

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

"use client";

import { Unplug } from "lucide-react";

export function DisconnectMetaButton() {
    const handleDisconnectMeta = async () => {
        if (!confirm('¿Estás seguro que querés desconectar tu cuenta de Meta Ads?')) return;

        try {
            const response = await fetch('/api/auth/disconnect', { method: 'POST' });
            if (response.ok) {
                window.location.href = '/conectar';
            } else {
                alert('Error al desconectar. Intentá de nuevo.');
            }
        } catch (error) {
            alert('Error al desconectar. Intentá de nuevo.');
        }
    };

    return (
        <button
            onClick={handleDisconnectMeta}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm py-3 px-6 rounded-xl transition-colors border border-slate-700 whitespace-nowrap"
        >
            <Unplug className="w-4 h-4" /> Desconectar Meta Ads
        </button>
    );
}

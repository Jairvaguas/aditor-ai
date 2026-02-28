"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface Props {
    auditId: string;
    item: any;
}

export default function ClientTableRow({ auditId, item }: Props) {
    const router = useRouter();

    return (
        <tr
            onClick={() => router.push(`/reporte/${auditId}`)}
            className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
        >
            <td className="py-4 px-6">
                <div className={`font-bold text-white text-sm group-hover:${item.styles.text} transition-colors`}>{item.campana}</div>
                <div className="text-xs text-slate-500 mt-1">Detectado por IA</div>
            </td>
            <td className="py-4 px-6">
                <span className={`inline-flex items-center gap-1.5 ${item.styles.bg} ${item.styles.text} text-xs font-bold px-2.5 py-1 rounded-md border ${item.styles.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.styles.dot}`}></span> {item.estado}
                </span>
            </td>
            <td className="py-4 px-6 text-sm text-slate-300 font-medium">--</td>
            <td className="py-4 px-6 text-right">
                <div className={`font-bold font-display ${item.styles.text} text-base`}>{item.roi}</div>
            </td>
        </tr>
    );
}

"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
    mes: string;
    registrados: number;
    activos: number;
    inactivos: number;
}

export default function UserGrowthChart({ data }: { data: ChartDataPoint[] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col mt-4">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold font-syne text-white">Crecimiento Mensual</h2>
                    <p className="text-slate-400 text-sm mt-1">Evolución de usuarios en los últimos 6 meses</p>
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                            dataKey="mes" 
                            stroke="#64748b" 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            axisLine={false} 
                            tickLine={false} 
                            dy={10} 
                        />
                        <YAxis 
                            stroke="#64748b" 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            axisLine={false} 
                            tickLine={false} 
                            dx={-10} 
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                            itemStyle={{ fontWeight: 500 }}
                            cursor={{ stroke: '#334155', strokeWidth: 1 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                        
                        <Line type="monotone" name="Total Registrados" dataKey="registrados" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" name="Activos" dataKey="activos" stroke="#00D4AA" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" name="Inactivos" dataKey="inactivos" stroke="#FF6B6B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
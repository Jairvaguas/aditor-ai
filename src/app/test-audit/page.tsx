'use client'
import { useState } from 'react'

export default function TestAudit() {
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)

    async function testAudit() {
        setLoading(true)
        const res = await fetch('/api/audit/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'test-user-123',
                campaigns: [{
                    id: '23851234567890',
                    nombre: 'Retargeting 7 días',
                    ad_account_id: 'act_123456789',
                    estado: 'activa',
                    presupuesto_diario: 50,
                    metricas_30d: {
                        roas: 4.2, ctr: 1.9, cpm: 9.4, cpc: 0.49,
                        frecuencia: 2.1, gasto_total: 1240,
                        conversiones: 67, valor_conversiones: 5208,
                        pagos_iniciados: 89, visitas_landing: 2530
                    }
                },
                {
                    id: '23851234567891',
                    nombre: 'Intereses Ropa Mujer',
                    ad_account_id: 'act_123456789',
                    estado: 'activa',
                    presupuesto_diario: 50,
                    metricas_30d: {
                        roas: 0.8, ctr: 0.6, cpm: 19.5, cpc: 3.2,
                        frecuencia: 4.8, gasto_total: 340,
                        conversiones: 3, valor_conversiones: 272,
                        pagos_iniciados: 8, visitas_landing: 320
                    }
                }]
            })
        })
        const data = await res.json()
        setResult(JSON.stringify(data, null, 2))
        setLoading(false)
    }

    return (
        <div style={{ padding: '40px', background: '#1A1A2E', minHeight: '100vh', color: 'white' }}>
            <h1 style={{ marginBottom: '20px' }}>Test Audit Engine</h1>
            <button
                onClick={testAudit}
                style={{ padding: '12px 24px', background: '#E94560', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '16px', marginBottom: '20px' }}
            >
                {loading ? 'Generando auditoría...' : 'Generar auditoría de prueba'}
            </button>
            {result && (
                <pre style={{ background: 'rgba(255,255,255,0.06)', padding: '20px', borderRadius: '12px', overflow: 'auto', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                    {result}
                </pre>
            )}
        </div>
    )
}

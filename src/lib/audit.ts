import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Eres AditorAI, un auditor experto en campañas de Meta Ads especializado en e-commerce de LATAM y España. Tu único objetivo es analizar métricas publicitarias y devolver un diagnóstico claro, accionable y honesto.

REGLAS ABSOLUTAS:
- Responde ÚNICAMENTE en formato XML válido. Sin texto fuera del XML.
- No uses Markdown. No uses explicaciones previas. Solo XML.
- Usa lenguaje directo, simple y en español neutro.
- Nunca digas "podría", "quizás" o "considerar". Di exactamente qué hacer.
- Cada recomendación debe tener una acción concreta, no una sugerencia vaga.
- Si una campaña tiene ROAS menor a 1.0 con más de $100 gastados: es pausar, siempre.
- Prioriza hallazgos por impacto económico, de mayor a menor.`;

export async function generateAudit(campaigns: any[], userId: string, moneda: string = 'USD', pais: string = 'AR') {
  const userPrompt = `Analizá las siguientes campañas de Meta Ads de una tienda de e-commerce.

PERÍODO: Últimos 30 días con tendencia semanal
MONEDA: ${moneda}
INDUSTRIA: E-commerce
MERCADO: ${pais}

BENCHMARKS DE REFERENCIA:
- ROAS: bajo < 1.5x / aceptable 1.5-2.5x / bueno > 2.5x
- CTR feed: bajo < 0.8% / aceptable 0.8-1.5% / bueno > 1.5%
- CPM LATAM: alto > $18 / aceptable $10-18 / bueno < $10
- Frecuencia: alta > 5.0 / aceptable 3.0-5.0 / buena < 3.0
- Conv. landing a compra: bajo < 1% / aceptable 1-3% / bueno > 3%

DATOS DE CAMPAÑAS:
${JSON.stringify(campaigns, null, 2)}

Devuelve ÚNICAMENTE el XML con este schema exacto:
<auditoria>
  <score_cuenta>
    <valor></valor>
    <nivel></nivel>
    <resumen></resumen>
  </score_cuenta>
  <resumen_ejecutivo></resumen_ejecutivo>
  <hallazgos>
    <hallazgo id="1">
      <tipo></tipo>
      <urgencia></urgencia>
      <campana_nombre></campana_nombre>
      <diagnostico></diagnostico>
      <accion_concreta></accion_concreta>
    </hallazgo>
  </hallazgos>
  <redistribucion_presupuesto>
    <presupuesto_liberado></presupuesto_liberado>
    <sugerencia></sugerencia>
  </redistribucion_presupuesto>
  <hooks_sugeridos>
    <hook id="1">
      <tipo></tipo>
      <texto></texto>
      <score_estimado></score_estimado>
    </hook>
  </hooks_sugeridos>
  <proximos_pasos>
    <paso orden="1">
      <accion></accion>
      <plazo></plazo>
    </paso>
  </proximos_pasos>
</auditoria>`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    temperature: 0.3,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const xmlText = response.content[0].type === 'text' ? response.content[0].text : '';

  console.log('--- DEBUG INSERT ---');
  console.log('XML a guardar (primeros 200 chars):', xmlText?.substring(0, 200));
  console.log('XML length:', xmlText?.length);
  console.log('Insertando con user_id:', userId);

  // Guardar en Supabase - Using Service Role Key for backend operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('auditorias')
    .insert({
      user_id: userId,
      ad_account_id: campaigns[0]?.ad_account_id || 'test',
      tipo: 'manual',
      xml_raw: xmlText,
      // For parsed_data, we might want to parse it here or just store raw. 
      // User instructions just said "xml_raw: xmlText".
      periodo_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      periodo_fin: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing audit:', error);
    throw error;
  }

  return { id: data.id, xml: xmlText };
}

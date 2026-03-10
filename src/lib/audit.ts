import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';



const SYSTEM_PROMPT = `Eres AditorAI, un auditor experto en campañas de Meta Ads. Tu único objetivo es analizar métricas publicitarias y devolver un diagnóstico claro, accionable y honesto.

FORMATO DE RESPUESTA - CRÍTICO:
- Tu respuesta debe comenzar EXACTAMENTE con: <?xml version="1.0" encoding="UTF-8"?>
- NUNCA uses backticks, NUNCA uses \`\`\`xml, NUNCA uses bloques de código markdown
- El primer caracter de tu respuesta debe ser el símbolo <
- Si tu respuesta no empieza con <, es incorrecta

REGLAS DE ANÁLISIS POR OBJETIVO:

1. OUTCOME_SALES (Ventas / E-commerce):
   - KPI principal: ROAS y costo por compra
   - Si destino es WEBSITE: analizar funnel completo (landing page views → add to cart → initiate checkout → purchase)
   - Si destino es WHATSAPP/MESSENGER: analizar costo por conversación iniciada y estimar conversión offline
   - ROAS < 1.0 con >$100 gastados = pausar siempre

2. OUTCOME_LEADS (Generación de leads):
   - KPI principal: costo por lead y volumen de leads
   - Si destino es WEBSITE: analizar formularios completados y landing page views
   - Si destino es WHATSAPP/MESSENGER: analizar conversaciones iniciadas como leads
   - Si destino es INSTAGRAM/FACEBOOK: analizar leads del formulario nativo
   - No aplicar benchmarks de ROAS a campañas de leads

3. OUTCOME_TRAFFIC (Tráfico):
   - KPI principal: CPC, CTR y landing page views
   - Analizar calidad del tráfico (ratio clics vs landing page views)
   - No esperar conversiones directas

4. OUTCOME_AWARENESS (Reconocimiento):
   - KPI principal: CPM, alcance y frecuencia
   - Analizar cobertura y frecuencia óptima (< 3.0 por semana)
   - No esperar clics ni conversiones

5. OUTCOME_ENGAGEMENT (Interacción):
   - KPI principal: costo por interacción, CTR
   - Analizar tipo de interacciones conseguidas

REGLAS ABSOLUTAS:
- Responde ÚNICAMENTE en formato XML válido. Sin texto fuera del XML.
- No uses Markdown. No uses explicaciones previas. Solo XML.
- Usa lenguaje directo, simple y en español neutro.
- Nunca digas "podría", "quizás" o "considerar". Di exactamente qué hacer.
- Cada recomendación debe tener una acción concreta, no una sugerencia vaga.
- Prioriza hallazgos por impacto económico, de mayor a menor.
- ADAPTA tus benchmarks y recomendaciones al objetivo de cada campaña.
- No compares métricas de campañas con objetivos diferentes entre sí.
- En el resumen ejecutivo, indica qué tipos de campañas tiene la cuenta y su distribución.`;

export async function generateAudit(campaigns: any[], userId: string, moneda: string = 'USD', pais: string = 'AR') {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const userPrompt = `Analizá las siguientes campañas de Meta Ads.

PERÍODO: Últimos 30 días
MONEDA: ${moneda}
MERCADO: ${pais}

IMPORTANTE: Cada campaña tiene un campo "objective" y "destination_type". DEBES adaptar tu análisis al objetivo:
- OUTCOME_SALES → evaluar ROAS, funnel de compra, costo por purchase
- OUTCOME_LEADS → evaluar costo por lead, volumen, calidad estimada
- OUTCOME_TRAFFIC → evaluar CPC, CTR, calidad del tráfico
- OUTCOME_AWARENESS → evaluar CPM, alcance, frecuencia
- OUTCOME_ENGAGEMENT → evaluar interacciones, CTR

Y al destino:
- WEBSITE → hay funnel web (landing page views, add to cart, checkout, purchase)
- WHATSAPP / MESSENGER → la conversión es iniciar conversación, no hay funnel web
- ON_AD / INSTAGRAM / FACEBOOK → la conversión es en la plataforma misma

BENCHMARKS DE REFERENCIA LATAM:
Para campañas de VENTAS web:
- ROAS: bajo < 1.5x / aceptable 1.5-2.5x / bueno > 2.5x
- Costo por compra: depende del ticket promedio

Para campañas de VENTAS vía WhatsApp:
- Costo por conversación: bajo < $1 / aceptable $1-3 / alto > $3
- No aplicar ROAS del pixel (la venta es offline)

Para campañas de LEADS:
- Costo por lead web: bajo < $3 / aceptable $3-8 / alto > $8
- Costo por lead WhatsApp: bajo < $1.5 / aceptable $1.5-4 / alto > $4

Para TODAS las campañas:
- CTR feed: bajo < 0.8% / aceptable 0.8-1.5% / bueno > 1.5%
- CPM LATAM: alto > $18 / aceptable $10-18 / bueno < $10
- Frecuencia: alta > 5.0 / aceptable 3.0-5.0 / buena < 3.0

DATOS DE CAMPAÑAS:
${JSON.stringify(campaigns, null, 2)}

Devuelve ÚNICAMENTE el XML con este schema exacto:
<auditoria>
  <score_cuenta>
    <valor></valor>
    <nivel></nivel>
    <resumen></resumen>
  </score_cuenta>

  CRÍTICO - En <metricas_globales> usa SOLO valores numéricos:
  - <roas_promedio> debe ser un número como 2.4, no texto (solo para campañas con objetivo de ventas, si no hay poner 0)
  - <ctr_promedio> debe ser un número como 1.8, no texto
  - <cpm_promedio> debe ser un número como 12.5, no texto
  - <gasto_total_30d> debe ser un número como 149956, no texto
  NUNCA pongas explicaciones, frases o texto en estas etiquetas.
  
  <metricas_globales>
    <roas_promedio></roas_promedio>
    <ctr_promedio></ctr_promedio>
    <cpm_promedio></cpm_promedio>
    <gasto_total_30d></gasto_total_30d>
    <conversiones_totales></conversiones_totales>
  </metricas_globales>
  <resumen_ejecutivo></resumen_ejecutivo>
  <hallazgos>
    <hallazgo id="1">
      <tipo></tipo>
      <urgencia></urgencia>
      <campana_nombre></campana_nombre>
      <objetivo_campana></objetivo_campana>
      <destino></destino>
      <diagnostico></diagnostico>
      <accion_concreta></accion_concreta>
    </hallazgo>
  </hallazgos>
  <redistribucion_presupuesto>
    <presupuesto_liberado></presupuesto_liberado>
    <sugerencia></sugerencia>
  </redistribucion_presupuesto>
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

  // Limpiar markdown code blocks si el LLM los agrega
  let cleanXml = xmlText
    .replace(/^[\s\S]*?(<\?xml)/m, '<?xml')  // elimina todo antes de <?xml
    .replace(/```[\s\S]*?```/g, '')           // elimina code blocks
    .replace(/`/g, '')                         // elimina backticks sueltos
    .trim();

  // Verificación de seguridad
  if (!cleanXml.startsWith('<?xml') && !cleanXml.startsWith('<auditoria')) {
    // Buscar donde empieza el XML real
    const xmlStart = cleanXml.indexOf('<?xml');
    if (xmlStart > -1) {
      cleanXml = cleanXml.substring(xmlStart);
    }
  }

  const scoreMatch = cleanXml.match(/<valor>(\d+)<\/valor>/);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

  const hallazgosMatches = cleanXml.match(/<hallazgo /g);
  const hallazgosCount = hallazgosMatches ? hallazgosMatches.length : 0;

  console.log('--- DEBUG INSERT ---');
  console.log('XML a guardar (primeros 200 chars):', cleanXml?.substring(0, 200));
  console.log('XML length:', cleanXml?.length);
  console.log('Insertando con user_id:', userId);
  console.log('Score parseado:', score, '| Hallazgos:', hallazgosCount);

  // Guardar en Supabase - Using Service Role Key for backend operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('selected_ad_account_id')
    .eq('clerk_user_id', userId)
    .single();
  const selectedAdAccountId = campaigns[0]?.ad_account_id || userProfile?.selected_ad_account_id || 'unknown';

  const { data, error } = await supabase
    .from('auditorias')
    .insert({
      user_id: userId,
      ad_account_id: selectedAdAccountId,
      tipo: 'manual',
      xml_raw: cleanXml,
      score: score,
      hallazgos_count: hallazgosCount,
      periodo_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      periodo_fin: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (error) {
    console.error('Error storing audit:', error);
    throw error;
  }

  return { id: data.id, xml: cleanXml };
}

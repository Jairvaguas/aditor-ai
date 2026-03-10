import os
import subprocess
import re

def update_meta_auth():
    filepath = "src/lib/meta-auth.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    start_idx = content.find("export async function getCampaignInsights")
    if start_idx == -1:
        print("getCampaignInsights not found")
        return False

    new_function = r"""export async function getCampaignInsights(accessToken: string, adAccountId: string) {
    const accountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

    // Paso 1: Obtener datos de campaña con objetivo, presupuesto y estado
    const campaignsRes = await fetch(
        `${BASE_URL}/${accountId}/campaigns?fields=id,name,status,objective,buying_type,daily_budget,lifetime_budget,bid_strategy,configured_status,effective_status&limit=50&access_token=${accessToken}`
    );
    const campaignsData = await campaignsRes.json();
    if (campaignsData.error) throw new Error(campaignsData.error.message);

    const campaigns = campaignsData.data || [];

    // Paso 2: Obtener adsets para conocer optimization_goal y destination_type
    const adsetsRes = await fetch(
        `${BASE_URL}/${accountId}/adsets?fields=id,name,campaign_id,optimization_goal,destination_type,targeting,daily_budget,lifetime_budget,bid_amount,status&limit=100&access_token=${accessToken}`
    );
    const adsetsData = await adsetsRes.json();
    const adsets = adsetsData.data || [];

    // Agrupar adsets por campaign_id
    const adsetsByCampaign: Record<string, any[]> = {};
    for (const adset of adsets) {
        const cid = adset.campaign_id;
        if (!adsetsByCampaign[cid]) adsetsByCampaign[cid] = [];
        adsetsByCampaign[cid].push({
            name: adset.name,
            optimization_goal: adset.optimization_goal,
            destination_type: adset.destination_type,
            daily_budget: adset.daily_budget,
            lifetime_budget: adset.lifetime_budget,
            bid_amount: adset.bid_amount,
            status: adset.status,
        });
    }

    // Paso 3: Obtener insights con todas las métricas relevantes
    const insightsRes = await fetch(
        `${BASE_URL}/${accountId}/insights?fields=campaign_id,campaign_name,spend,impressions,clicks,reach,ctr,cpm,cpc,frequency,actions,action_values,cost_per_action_type,conversions,conversion_values,objective&date_preset=last_30d&level=campaign&limit=50&access_token=${accessToken}`
    );
    const insightsData = await insightsRes.json();
    const insights = insightsData.data || [];

    // Indexar insights por campaign_id
    const insightsByCampaign: Record<string, any> = {};
    for (const insight of insights) {
        insightsByCampaign[insight.campaign_id] = insight;
    }

    // Paso 4: Combinar todo
    return campaigns.map((c: any) => {
        const insight = insightsByCampaign[c.id] || {};
        const campaignAdsets = adsetsByCampaign[c.id] || [];

        // Determinar el destination_type principal (el más común entre adsets)
        const destinations = campaignAdsets.map((a: any) => a.destination_type).filter(Boolean);
        const primaryDestination = destinations.length > 0
            ? destinations.sort((a: string, b: string) =>
                destinations.filter((v: string) => v === a).length - destinations.filter((v: string) => v === b).length
              ).pop()
            : 'UNKNOWN';

        // Determinar optimization_goal principal
        const optimizations = campaignAdsets.map((a: any) => a.optimization_goal).filter(Boolean);
        const primaryOptimization = optimizations.length > 0
            ? optimizations.sort((a: string, b: string) =>
                optimizations.filter((v: string) => v === a).length - optimizations.filter((v: string) => v === b).length
              ).pop()
            : 'UNKNOWN';

        // Extraer purchase/lead values para calcular ROAS
        const actionValues = insight.action_values || [];
        const purchaseValue = actionValues.find((a: any) => a.action_type === 'purchase')?.value || 0;
        const leadValue = actionValues.find((a: any) => a.action_type === 'lead')?.value || 0;

        const actions = insight.actions || [];
        const purchases = actions.find((a: any) => a.action_type === 'purchase')?.value || 0;
        const leads = actions.find((a: any) => a.action_type === 'lead')?.value || 0;
        const addToCart = actions.find((a: any) => a.action_type === 'add_to_cart')?.value || 0;
        const initiateCheckout = actions.find((a: any) => a.action_type === 'initiate_checkout')?.value || 0;
        const linkClicks = actions.find((a: any) => a.action_type === 'link_click')?.value || 0;
        const landingPageViews = actions.find((a: any) => a.action_type === 'landing_page_view')?.value || 0;
        const messagingConversations = actions.find((a: any) => 
            a.action_type === 'onsite_conversion.messaging_conversation_started_7d' || 
            a.action_type === 'messaging_conversation_started_7d'
        )?.value || 0;
        const completeRegistrations = actions.find((a: any) => a.action_type === 'complete_registration')?.value || 0;

        const spend = parseFloat(insight.spend || '0');
        const roas = spend > 0 && purchaseValue > 0 ? (parseFloat(purchaseValue) / spend).toFixed(2) : null;
        const costPerLead = spend > 0 && leads > 0 ? (spend / parseInt(leads)).toFixed(2) : null;
        const costPerMessage = spend > 0 && messagingConversations > 0 ? (spend / parseInt(messagingConversations)).toFixed(2) : null;

        return {
            campaign_id: c.id,
            campaign_name: c.name,
            status: c.status,
            effective_status: c.effective_status,
            objective: c.objective,
            buying_type: c.buying_type,
            daily_budget: c.daily_budget,
            lifetime_budget: c.lifetime_budget,
            bid_strategy: c.bid_strategy,
            destination_type: primaryDestination,
            optimization_goal: primaryOptimization,
            adsets_count: campaignAdsets.length,
            spend: insight.spend || '0',
            impressions: insight.impressions || '0',
            clicks: insight.clicks || '0',
            reach: insight.reach || '0',
            ctr: insight.ctr || '0',
            cpm: insight.cpm || '0',
            cpc: insight.cpc || '0',
            frequency: insight.frequency || '0',
            purchases,
            purchase_value: purchaseValue,
            roas,
            leads,
            cost_per_lead: costPerLead,
            add_to_cart: addToCart,
            initiate_checkout: initiateCheckout,
            link_clicks: linkClicks,
            landing_page_views: landingPageViews,
            messaging_conversations: messagingConversations,
            cost_per_message: costPerMessage,
            complete_registrations: completeRegistrations,
            actions: insight.actions || [],
        };
    });
}
"""
    new_content = content[:start_idx] + new_function
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated meta-auth.ts")
    return True

def update_audit():
    filepath = "src/lib/audit.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace SYSTEM_PROMPT
    sys_prompt_match = re.search(r"const SYSTEM_PROMPT = `.*?`;", content, flags=re.DOTALL)
    if not sys_prompt_match:
        print("SYSTEM_PROMPT not found in audit.ts")
        return False
        
    new_sys_prompt = r"""const SYSTEM_PROMPT = `Eres AditorAI, un auditor experto en campañas de Meta Ads. Tu único objetivo es analizar métricas publicitarias y devolver un diagnóstico claro, accionable y honesto.

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
- En el resumen ejecutivo, indica qué tipos de campañas tiene la cuenta y su distribución.`;"""

    content = content[:sys_prompt_match.start()] + new_sys_prompt + content[sys_prompt_match.end():]

    # Replace userPrompt
    user_prompt_match = re.search(r"const userPrompt = `.*?`;", content, flags=re.DOTALL)
    if not user_prompt_match:
        print("userPrompt not found in audit.ts")
        return False
        
    new_user_prompt = r"""const userPrompt = `Analizá las siguientes campañas de Meta Ads.

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
</auditoria>`;"""

    content = content[:user_prompt_match.start()] + new_user_prompt + content[user_prompt_match.end():]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated audit.ts")
    return True

if __name__ == "__main__":
    if update_meta_auth() and update_audit():
        print("Committing and pushing...")
        subprocess.run(["git", "add", "src/lib/meta-auth.ts", "src/lib/audit.ts", "directivas/update_meta_api_prompt.md", "scripts/update_meta_api_prompt.py"], check=True)
        subprocess.run(["git", "commit", "-m", "feat: mejorar datos de Meta API y prompt de auditoria"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("Done")
    else:
        print("Failed to update files")

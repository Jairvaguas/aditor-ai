import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { currentUser } from '@clerk/nextjs/server';
import { checkSubscription } from '@/lib/checkSubscription';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const hasAccess = await checkSubscription(user.id);
        if (!hasAccess) {
            return NextResponse.json({ error: 'Suscripción inactiva' }, { status: 403 });
        }

        const body = await req.json();
        const { campaignsData } = body;

        let contextPrompt = "";
        if (campaignsData && Array.isArray(campaignsData) && campaignsData.length > 0) {
            contextPrompt = `\nAquí tienes datos de algunas de mis campañas actuales en Meta Ads para contexto:\n${campaignsData.map((c: any) => `- Campaña: ${c.name}, ROAS: ${c.roas || 'N/A'}, CTR: ${c.ctr || 'N/A'}`).join('\n')}\n`;
        }

        const prompt = `Eres un experto copywriter de respuesta directa especializado en Meta Ads. 
Tu tarea es generar 3 "hooks" (ganchos) altamente persuasivos para anuncios, basados en diferentes ángulos psicológicos.${contextPrompt}
Genera en formato JSON estricto un arreglo de 3 objetos, cada uno con las siguientes propiedades:
- "id": número (1, 2, 3)
- "type": El tipo o ángulo del hook (exactamente: "Atención al Dolor", "Prueba Social Directa", "Oferta Irresistible")
- "content": El texto del hook en sí (1-3 oraciones cortas, impactantes, entre comillas angulares « »)
- "angle": Una breve explicación de por qué funciona este ángulo (max 5 palabras)

Asegúrate de responder UNICAMENTE con el JSON válido, sin texto adicional antes o después.
El formato esperado es:
[
  {
    "id": 1,
    "type": "Atención al Dolor",
    "content": "...",
    "angle": "..."
  },
  ...
]`;

        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 1000,
            temperature: 0.7,
            system: "Eres un redactor publicitario maestro que escribe hooks cortos, directos y que generan clics.",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        // @ts-ignore
        const textResponse = msg.content[0].text;

        let hooks = [];
        try {
            // Find JSON array in the response in case Claude adds some conversational text
            const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                hooks = JSON.parse(jsonMatch[0]);
            } else {
                hooks = JSON.parse(textResponse);
            }
        } catch (e) {
            console.error("Error parsing Claude JSON:", textResponse);
            throw new Error("Invalid format from Claude");
        }

        return NextResponse.json({ success: true, hooks });

    } catch (error) {
        console.error('Error generating hooks:', error);
        return NextResponse.json({ error: 'Error interno del servidor al generar hooks' }, { status: 500 });
    }
}

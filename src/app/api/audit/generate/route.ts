import { NextResponse } from 'next/server';
import { generateAudit } from '@/lib/audit';
import { sendAuditReadyEmail } from '@/lib/emails';
import { supabaseAdmin } from '@/lib/supabase';
import { XMLParser } from 'fast-xml-parser';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { campaigns, userId, moneda, pais } = body;

        if (!campaigns || !Array.isArray(campaigns) || campaigns.length === 0) {
            return NextResponse.json(
                { error: 'Invalid campaigns data' },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'Missing userId' },
                { status: 400 }
            );
        }

        const { id, xml } = await generateAudit(campaigns, userId, moneda, pais);
        
        // Post Generation processing to send Email
        try {
             const { data: profile } = await supabaseAdmin.from('profiles').select('email').eq('clerk_user_id', userId).single();
             if (profile?.email) {
                 const parser = new XMLParser();
                 const parsed = parser.parse(xml);
                 const scoreVal = parsed.auditoria?.score_cuenta?.valor;
                 const score = parseInt(scoreVal) || 0;
                 const findings = parsed.auditoria?.hallazgos?.hallazgo;
                 const hallazgosCount = Array.isArray(findings) ? findings.length : (findings ? 1 : 0);
                 
                 await sendAuditReadyEmail(profile.email, id, score, hallazgosCount);
             }
        } catch(e) {
             console.error('Email dispatching post audit Generation errored non-fatally:', e);
        }

        return NextResponse.json({ auditId: id, xml });

    } catch (error: any) {
        console.error('Error in /api/audit/generate:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
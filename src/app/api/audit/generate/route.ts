import { NextResponse } from 'next/server';
import { generateAudit } from '@/lib/audit';

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

        return NextResponse.json({ auditId: id, xml });

    } catch (error: any) {
        console.error('Error in /api/audit/generate:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

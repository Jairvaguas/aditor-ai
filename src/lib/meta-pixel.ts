import crypto from 'crypto';

const PIXEL_ID = process.env.META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CONVERSIONS_TOKEN;
const API_VERSION = 'v19.0';

function hashSHA256(value: string): string {
    return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
}

interface EventParams {
    eventName: string;
    eventSourceUrl?: string;
    userData?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        clientIpAddress?: string;
        clientUserAgent?: string;
        fbc?: string;
        fbp?: string;
        externalId?: string;
    };
    customData?: {
        value?: number;
        currency?: string;
        contentName?: string;
        contentCategory?: string;
    };
    eventId?: string;
}

export async function sendMetaEvent(params: EventParams): Promise<void> {
    if (!PIXEL_ID || !ACCESS_TOKEN) {
        console.warn('Meta Pixel: Missing PIXEL_ID or ACCESS_TOKEN, skipping event');
        return;
    }

    const { eventName, eventSourceUrl, userData, customData, eventId } = params;

    const userDataPayload: Record<string, any> = {};

    if (userData) {
        if (userData.email) userDataPayload.em = [hashSHA256(userData.email)];
        if (userData.firstName) userDataPayload.fn = [hashSHA256(userData.firstName)];
        if (userData.lastName) userDataPayload.ln = [hashSHA256(userData.lastName)];
        if (userData.clientIpAddress) userDataPayload.client_ip_address = userData.clientIpAddress;
        if (userData.clientUserAgent) userDataPayload.client_user_agent = userData.clientUserAgent;
        if (userData.fbc) userDataPayload.fbc = userData.fbc;
        if (userData.fbp) userDataPayload.fbp = userData.fbp;
        if (userData.externalId) userDataPayload.external_id = [hashSHA256(userData.externalId)];
    }

    const eventData: Record<string, any> = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: userDataPayload,
    };

    if (eventSourceUrl) eventData.event_source_url = eventSourceUrl;
    if (eventId) eventData.event_id = eventId;
    if (customData) eventData.custom_data = customData;

    try {
        const response = await fetch(
            `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: [eventData] }),
            }
        );

        const result = await response.json();

        if (result.error) {
            console.error('Meta Pixel Error:', result.error);
        } else {
            console.log(`Meta Pixel: ${eventName} sent successfully`);
        }
    } catch (error) {
        console.error('Meta Pixel: Failed to send event', error);
    }
}

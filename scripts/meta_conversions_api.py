import os
import re
from pathlib import Path

BASE_DIR = Path(r"c:\Users\Lenovo\Documents\Antigravity\AuditorAI")

def write_meta_pixel_ts():
    filepath = BASE_DIR / "src" / "lib" / "meta-pixel.ts"
    content = """import crypto from 'crypto';

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
"""
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created: {filepath}")

def modify_clerk_webhook():
    filepath = BASE_DIR / "src" / "app" / "api" / "webhooks" / "clerk" / "route.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "sendMetaEvent" not in content:
        content = content.replace(
            "import { sendWelcomeEmail } from '@/lib/emails'",
            "import { sendWelcomeEmail } from '@/lib/emails'\nimport { sendMetaEvent } from '@/lib/meta-pixel';"
        )
        
        insert_marker = "await sendWelcomeEmail(primaryEmail, nombre);"
        injection = """
        // Enviar evento Lead a Meta
        await sendMetaEvent({
            eventName: 'Lead',
            eventSourceUrl: 'https://www.aditor-ai.com/registro',
            userData: {
                email: primaryEmail,
                firstName: first_name || undefined,
                lastName: last_name || undefined,
                externalId: id,
            },
        });"""
        content = content.replace(insert_marker, insert_marker + "\n" + injection)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Modified: Clerk Webhook (Lead)")

def modify_meta_callback():
    filepath = BASE_DIR / "src" / "app" / "api" / "meta" / "callback" / "route.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "sendMetaEvent" not in content:
        content = content.replace(
            "import { clerkClient } from '@clerk/nextjs/server';",
            "import { clerkClient } from '@clerk/nextjs/server';\nimport { sendMetaEvent } from '@/lib/meta-pixel';"
        )
        
        insert_marker = "// 6. Redirigir a Selección de Cuentas si se autentico y guardo todo bien."
        injection = """        // Enviar evento CompleteRegistration a Meta
        await sendMetaEvent({
            eventName: 'CompleteRegistration',
            eventSourceUrl: 'https://www.aditor-ai.com/conectar',
            userData: {
                externalId: clerkUserId,
            },
            customData: {
                contentName: 'Meta Ads Connection',
            },
        });

"""
        content = content.replace(insert_marker, injection + insert_marker)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Modified: Meta Callback (CompleteRegistration)")

def modify_select_account():
    filepath = BASE_DIR / "src" / "app" / "api" / "auth" / "select-account" / "route.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "sendMetaEvent" not in content:
        content = content.replace(
            "import { getSupabaseAdmin } from '@/lib/supabase';",
            "import { getSupabaseAdmin } from '@/lib/supabase';\nimport { sendMetaEvent } from '@/lib/meta-pixel';"
        )
        
        insert_marker = "        return NextResponse.json({ success: true, redirectUrl: '/dashboard' });\n\n    } catch (error: any) {"
        replacement = """
        // Enviar evento StartTrial a Meta
        await sendMetaEvent({
            eventName: 'StartTrial',
            eventSourceUrl: 'https://www.aditor-ai.com/conectar/cuentas',
            userData: {
                externalId: clerkUserId,
            },
            customData: {
                contentName: `Ad Account ${adAccountId}`,
            },
        });

        return NextResponse.json({ success: true, redirectUrl: '/dashboard' });

    } catch (error: any) {"""
        content = content.replace(insert_marker, replacement)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Modified: Select Account (StartTrial)")

def modify_create_subscription():
    filepath = BASE_DIR / "src" / "app" / "api" / "payments" / "create-subscription" / "route.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "sendMetaEvent" not in content:
        content = content.replace(
            "import { getSupabaseAdmin } from '@/lib/supabase';",
            "import { getSupabaseAdmin } from '@/lib/supabase';\nimport { sendMetaEvent } from '@/lib/meta-pixel';"
        )
        
        find_text = "        return NextResponse.json({ init_point: response.init_point });"
        
        injection = """
        // Enviar evento InitiateCheckout a Meta
        await sendMetaEvent({
            eventName: 'InitiateCheckout',
            eventSourceUrl: 'https://www.aditor-ai.com/subscribe',
            userData: {
                externalId: userId,
            },
            customData: {
                value: 47,
                currency: 'USD',
                contentName: 'Professional Plan',
            },
        });

"""
        content = content.replace(find_text, injection + find_text)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Modified: Create Subscription (InitiateCheckout)")

def modify_payment_webhook():
    filepath = BASE_DIR / "src" / "app" / "api" / "payments" / "webhook" / "route.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "sendMetaEvent" not in content:
        content = content.replace(
            "import { sendSubscriptionActiveEmail } from '@/lib/emails';",
            "import { sendSubscriptionActiveEmail } from '@/lib/emails';\nimport { sendMetaEvent } from '@/lib/meta-pixel';"
        )
        
        insert_marker = "                    await sendSubscriptionActiveEmail(\n                       profile.email,\n                       reason || \"Aditor AI Pro\",\n                       accountsLimit,\n                       nextPaymentTs\n                    );"
        injection = """
                    // Enviar evento Purchase a Meta
                    await sendMetaEvent({
                        eventName: 'Purchase',
                        eventSourceUrl: 'https://www.aditor-ai.com/subscribe',
                        userData: {
                            externalId: external_reference, 
                        },
                        customData: {
                            value: 47,
                            currency: 'USD',
                            contentName: 'Professional Plan',
                        },
                    });"""
        content = content.replace(insert_marker, insert_marker + "\n" + injection)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Modified: Payment Webhook (Purchase)")

def modify_layout():
    filepath = BASE_DIR / "src" / "app" / "layout.tsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "connect.facebook.net/en_US/fbevents.js" not in content:
        content = content.replace(
            "import { cn } from \"@/lib/utils\";",
            "import { cn } from \"@/lib/utils\";\nimport Script from 'next/script';"
        )
        
        insert_marker = "          <NextIntlClientProvider messages={messages}>"
        injection = """          <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
          </Script>
          <noscript>
            <img height="1" width="1" style={{display:'none'}}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
"""
        content = content.replace(insert_marker, injection + insert_marker)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print("Modified: Layout (ViewContent Pixel)")

if __name__ == "__main__":
    write_meta_pixel_ts()
    modify_clerk_webhook()
    modify_meta_callback()
    modify_select_account()
    modify_create_subscription()
    modify_payment_webhook()
    modify_layout()
    print("Done")

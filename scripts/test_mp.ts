import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!accessToken) {
    console.error("❌ No se encontró MERCADOPAGO_ACCESS_TOKEN en las variables de entorno.");
    process.exit(1);
}

const client = new MercadoPagoConfig({ accessToken: accessToken });
const preapproval = new PreApproval(client);

async function test() {
    try {
        console.log("Creando una suscripción de prueba para validar credenciales...");
        const res = await preapproval.create({
            body: {
                reason: 'Suscripción de prueba (Test)',
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: 47,
                    currency_id: 'ARR', // Usando ARR para entornos de prueba a veces o USD
                },
                back_url: 'http://localhost:3000/dashboard',
                payer_email: 'test_user_99999@testuser.com',
                status: 'pending'
            } as any
        });
        console.log('✅ Mercado Pago API respondió correctamente!');
        console.log('ID Preaprobación:', res.id);
        console.log('➡ Link de Pago (Init Point):', res.init_point);
    } catch (err: any) {
        console.error('❌ Error devuelto por Mercado Pago:', err.message || err);
        if (err.cause) {
            let cause = err.cause;
            // Mercado Pago sdk a veces encapsula un array
            if (Array.isArray(cause)) {
                console.error('Motivo detallado:', JSON.stringify(cause, null, 2));
            } else {
                console.error('Motivo detallado:', cause);
            }
        }
    }
}

test();

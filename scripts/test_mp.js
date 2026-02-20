const { MercadoPagoConfig, PreApproval } = require('mercadopago');

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
                    transaction_amount: 185000,
                    currency_id: 'COP',
                },
                back_url: 'https://aditor-ai-app.vercel.app/dashboard',
                payer_email: 'nuevo_comprador_colombia_1234@email.com',
                status: 'pending'
            }
        });
        console.log('✅ Mercado Pago API respondió correctamente!');
        console.log('ID Preaprobación:', res.id);
        console.log('➡ Link de Pago (Init Point):', res.init_point);
    } catch (err) {
        let errorData = err.message;
        if (err.cause) {
            errorData = JSON.stringify(err.cause, null, 2);
        }
        require('fs').writeFileSync('mp_error.json', errorData);
        console.error("Error devuelto:", errorData);
    }
}

test();

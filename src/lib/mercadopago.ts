import { MercadoPagoConfig, PreApproval } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.warn('MERCADOPAGO_ACCESS_TOKEN is not set in environment variables.');
}

export const mercadopagoClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export const preapproval = new PreApproval(mercadopagoClient);

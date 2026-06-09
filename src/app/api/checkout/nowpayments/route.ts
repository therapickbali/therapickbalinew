import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { price_amount, price_currency, order_id, order_description, success_url, cancel_url } = body;

        const API_KEY = process.env.NOWPAYMENTS_API_KEY;

        if (!API_KEY) {
            return NextResponse.json({ error: 'NOWPAYMENTS_API_KEY is not set' }, { status: 500 });
        }

        const nowPaymentsPayload = {
            price_amount,
            price_currency,
            order_id,
            order_description,
            success_url,
            cancel_url
        };

        const response = await fetch('https://api.nowpayments.io/v1/invoice', {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nowPaymentsPayload),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('NowPayments Error:', data);
            return NextResponse.json({ error: 'Failed to create invoice', details: data }, { status: response.status });
        }

        return NextResponse.json({ invoice_url: data.invoice_url });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}

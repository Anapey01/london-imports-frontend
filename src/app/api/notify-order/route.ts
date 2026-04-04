import { NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: Request) {
    try {
        const { orderNumber, customerEmail, method } = await req.json();

        if (!RESEND_API_KEY) {
            console.warn('RESEND_API_KEY is not configured in environment variables.');
            return NextResponse.json({ success: false, message: 'Notification service not configured' }, { status: 200 });
        }

        // DESIGN: Editorial Manifest Email Template (Institutional Dark Mode)
        const emailHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>London's Import - Manifest Authorized</title>
                <style>
                    body { margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #0c0f16; color: #ffffff; }
                    .manifest-container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo-text { font-size: 14px; font-weight: 900; letter-spacing: 0.5em; text-transform: uppercase; color: #64748b; }
                    .authorized-stamp { display: inline-block; padding: 4px 12px; border: 1px solid #10b981; color: #10b981; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 12px; border-radius: 4px; }
                    .main-title { font-size: 32px; font-weight: 900; letter-spacing: -0.05em; line-height: 1.1; margin: 24px 0; color: #ffffff; }
                    .content { font-size: 14px; line-height: 1.6; color: #94a3b8; font-weight: 400; }
                    .order-pill { background-color: #1e293b; padding: 12px 20px; border-radius: 12px; margin: 32px 0; display: inline-block; font-size: 13px; font-weight: 800; color: #ffffff; border: 1px solid #334155; }
                    .next-steps { border-top: 1px solid #1e293b; padding-top: 32px; margin-top: 32px; }
                    .step { margin-bottom: 24px; }
                    .step-id { font-size: 10px; font-weight: 900; color: #64748b; margin-bottom: 4px; }
                    .step-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #ffffff; }
                    .footer { font-size: 10px; color: #475569; text-align: center; margin-top: 60px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 900; }
                    .button { display: inline-block; background-color: #ffffff; color: #0c0f16; padding: 18px 32px; border-radius: 14px; text-decoration: none; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 40px; }
                </style>
            </head>
            <body>
                <div class="manifest-container">
                    <div class="header">
                        <div class="logo-text">LONDON'S IMPORT</div>
                        <div class="authorized-stamp">Verified Manifest</div>
                    </div>

                    <h1 class="main-title">Logistics <br/> Allocation <br/> Authorized.</h1>

                    <div class="content">
                        Your transaction has been securely processed and order <span style="color: #ffffff; font-weight: 800;">#${orderNumber}</span> is now validated. Our global sourcing hub has prioritized your allocation.
                    </div>

                    <div class="order-pill">MANIFEST ID: LTRX-${orderNumber}</div>

                    <div class="next-steps">
                        <div class="step">
                            <div class="step-id">STAGE 01 / SOURCING</div>
                            <div class="step-title">Node Allocation Validated</div>
                        </div>
                        <div class="step">
                            <div class="step-id">STAGE 02 / LOGISTICS</div>
                            <div class="step-title">Global Manifest Preparation</div>
                        </div>
                        <div class="step">
                            <div class="step-id">STAGE 03 / DISPATCH</div>
                            <div class="step-title">Tracking Document Generation</div>
                        </div>
                    </div>

                    <a href="https://naa-import.vercel.app/orders" class="button">View Live Manifest</a>

                    <div class="footer">
                        LOGISTICS PROTOCOL ALPHA v4 / ENCRYPTED TRANSMISSION
                    </div>
                </div>
            </body>
            </html>
        `;

        // RESEND API CALL
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: "London's Import <manifest@londonsimports.com>", // Verify this domain in Resend
                to: [customerEmail || 'info@londonsimports.com'],
                cc: ['orders@londonsimports.com'],
                subject: `MANIFEST AUTHORIZED: ${orderNumber}`,
                html: emailHtml
            })
        });

        const data = await res.json();
        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('Notification error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

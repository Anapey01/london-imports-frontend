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
                    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo { font-size: 14px; font-weight: 900; letter-spacing: 0.5em; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
                    .stamp { display: inline-block; padding: 4px 12px; border: 1px solid #10b981; color: #10b981; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 4px; }
                    .title { font-size: 36px; font-weight: 900; letter-spacing: -0.05em; line-height: 1.1; margin: 24px 0; color: #ffffff; }
                    .description { font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px; }
                    .manifest-id { background-color: #1e293b; padding: 12px 24px; border-radius: 12px; display: inline-block; font-size: 13px; font-weight: 800; color: #ffffff; border: 1px solid #334155; margin-bottom: 40px; }
                    
                    .timeline { position: relative; padding-left: 48px; border-left: 2px solid #1e293b; margin-left: 16px; margin-bottom: 48px; }
                    .step { position: relative; margin-bottom: 40px; }
                    .step-last { margin-bottom: 0; }
                    .icon-box { 
                        position: absolute; 
                        left: -66px; 
                        top: 0; 
                        width: 36px; 
                        height: 36px; 
                        background: #0c0f16; 
                        border: 2px solid #1e293b; 
                        border-radius: 10px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        color: #64748b;
                    }
                    .step-active .icon-box { border-color: #ffffff; color: #ffffff; background: #1e293b; }
                    .step-id { font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
                    .step-title { font-size: 14px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
                    
                    .footer { font-size: 10px; color: #475569; text-align: center; margin-top: 60px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 900; border-top: 1px solid #1e293b; padding-top: 40px; }
                    .cta { display: inline-block; background-color: #ffffff; color: #0c0f16; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; }
                    
                    svg { width: 18px; height: 18px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">LONDON'S IMPORT</div>
                        <div class="stamp">ALLOCATION AUTHORIZED</div>
                    </div>

                    <h1 class="title">Logistics<br/>Protocol<br/>Initiated.</h1>

                    <p class="description">
                        Your transaction has been verified. Order <span style="color: #ffffff; font-weight: 800;">#${orderNumber}</span> is now entered into the global logistics manifest. Your allocation is being secured across our network.
                    </p>

                    <div class="manifest-id">LTRX-MANIFEST-${orderNumber}</div>

                    <div class="timeline">
                        <div class="step step-active">
                            <div class="icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            </div>
                            <div class="step-id">STAGE 01 / PLACED</div>
                            <div class="step-title">Order Request Recorded</div>
                        </div>

                        <div class="step step-active">
                            <div class="icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                            </div>
                            <div class="step-id">STAGE 02 / PAID</div>
                            <div class="step-title">Payment Transaction Authorized</div>
                        </div>

                        <div class="step">
                            <div class="icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                            </div>
                            <div class="step-id">STAGE 03 / BATCH</div>
                            <div class="step-title">Allocated to Global Shipment</div>
                        </div>

                        <div class="step">
                            <div class="icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                            </div>
                            <div class="step-id">STAGE 04 / CHINA</div>
                            <div class="step-title">Sourcing from Asia Hub</div>
                        </div>

                        <div class="step step-last">
                            <div class="icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v10Z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                            </div>
                            <div class="step-id">STAGE 05 / GHANA</div>
                            <div class="step-title">Accra Terminal Processing</div>
                        </div>
                    </div>

                    <div style="text-align: center;">
                        <a href="https://naa-import.vercel.app/orders" class="cta">Track Manifest Status</a>
                    </div>

                    <div class="footer">
                        LOGISTICS PROTOCOL ALPHA v4 / INSTITUTIONAL TRANSMISSION
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


import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { BookingConfirmationEmail } from '@/emails/booking-confirmation';
import { BookingCancellationEmail } from '@/emails/booking-cancellation';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

// Safe Error Serialization Helper
// Safe Error Serialization Helper
const safeSerialize = (obj: unknown) => {
    try {
        if (obj instanceof Error) {
            return JSON.stringify({
                message: obj.message,
                name: obj.name,
                stack: process.env.NODE_ENV === 'development' ? obj.stack : undefined,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cause: (obj as any).cause
            }, null, 2);
        }
        if (typeof obj === 'object' && obj !== null) {
            return JSON.stringify(obj, null, 2);
        }
        return String(obj);
    } catch (e) {
        return "Unserializable Error: " + String(e);
    }
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, to, data } = body;

        // console.log(`[API EMAIL] Request received for: ${to} (${type})`);

        if (!to) {
            return NextResponse.json({ error: "Missing recipient" }, { status: 400 });
        }

        let emailComponent;
        let subject;

        // Render Template based on Type (Wrapped in Try/Catch to prevent crash)
        try {
            const emailData = data || {};
            if (type === 'confirmation') {
                subject = `Reserva Confirmada - Mandalas ${emailData.location === 'hideout' ? 'Hideout' : 'Pueblo'}`;
                emailComponent = (
                    <BookingConfirmationEmail
                        guestName={emailData.guestName || 'Huésped'}
                        bookingId={emailData.bookingId || 'Ref-???'}
                        checkIn={emailData.checkIn || 'N/A'}
                        checkOut={emailData.checkOut || 'N/A'}
                        roomName={emailData.roomName || 'Habitación'}
                        totalPrice={emailData.totalPrice || 0}
                        location={emailData.location || 'pueblo'}
                    />
                );
            } else if (type === 'cancellation') {
                subject = `Actualización de Reserva - Mandalas`;
                emailComponent = (
                    <BookingCancellationEmail
                        guestName={emailData.guestName || 'Huésped'}
                        bookingId={emailData.bookingId || 'Ref-???'}
                        roomName={emailData.roomName || 'Habitación'}
                        refundStatus={emailData.refundStatus}
                        amountRefunded={emailData.refundAmount}
                        totalPrice={emailData.totalPrice || 0}
                    />
                );
            } else {
                return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
            }
        } catch (renderError) {
            console.error("React Email Rendering Failed:", renderError);
            return NextResponse.json({ error: "Template Rendering Failed", details: safeSerialize(renderError) }, { status: 500 });
        }

        // SMART MOCK CHECK
        const apiKey = process.env.RESEND_API_KEY;
        const keyStatus = !apiKey ? 'MISSING' : apiKey === 're_123' ? 'DEFAULT' : apiKey.length < 10 ? 'SHORT' : 'VALID_FORMAT';
        // console.log(`[API EMAIL] Key Status: ${keyStatus} | ${apiKey ? '...' + apiKey.slice(-4) : 'N/A'}`);

        // Mock if key is missing, short, placeholder, or the default value
        const isMockMode = !apiKey || apiKey === 're_123' || apiKey.includes('placeholder') || apiKey.length < 10;

        if (isMockMode) {
            console.log(`[MOCK EMAIL] Simulating send to: ${to} | Subject: ${subject}`)
            await new Promise(resolve => setTimeout(resolve, 500));
            return NextResponse.json({ message: "Mock Email sent successfully", id: "mock_id_dev_123" });
        }

        // Real Send
        console.log(`[REAL EMAIL] Sending to ${to}...`);

        try {
            const { data: result, error } = await resend.emails.send({
                from: process.env.EMAIL_FROM || 'Mandalas <reservas@mandalashostel.com>',
                to: [to],
                subject: subject!,
                react: emailComponent,
            });

            if (error) {
                console.error("Resend Provider Error:", error);
                // Serialize error safely to avoid circular reference crashes in JSON response
                return NextResponse.json({ error: error.message || "Provider Error", details: safeSerialize(error) }, { status: 500 });
            }

            return NextResponse.json({ message: "Email sent successfully", id: result?.id });

        } catch (sendError) {
            console.error("Resend SDK threw:", sendError);
            return NextResponse.json({ error: "Email Provider Failed", details: safeSerialize(sendError) }, { status: 500 });
        }

    } catch (error) {
        console.error("Internal Email API Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: safeSerialize(error) }, { status: 500 });
    }
}

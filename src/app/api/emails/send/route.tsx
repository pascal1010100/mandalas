
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { BookingConfirmationEmail } from '@/emails/booking-confirmation';
import { BookingCancellationEmail } from '@/emails/booking-cancellation';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

// Safe Error Serialization Helper
const safeSerialize = (obj: any) => {
    try {
        return JSON.stringify(obj, null, 2);
    } catch (e) {
        return String(obj);
    }
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, to, data } = body;

        console.log(`[API EMAIL] Request received for: ${to} (${type})`);

        if (!to) {
            return NextResponse.json({ error: "Missing recipient" }, { status: 400 });
        }

        let emailComponent;
        let subject;

        // Render Template based on Type (Wrapped in Try/Catch to prevent crash)
        try {
            if (type === 'confirmation') {
                subject = `Reserva Confirmada - Mandalas ${data.location === 'pueblo' ? 'Pueblo' : 'Hideout'}`;
                emailComponent = (
                    <BookingConfirmationEmail
                        guestName={data.guestName || 'Huésped'}
                        bookingId={data.bookingId || 'Ref-???'}
                        checkIn={data.checkIn || 'N/A'}
                        checkOut={data.checkOut || 'N/A'}
                        roomName={data.roomName || 'Habitación'}
                        totalPrice={data.totalPrice || 0}
                        location={data.location || 'pueblo'}
                    />
                );
            } else if (type === 'cancellation') {
                subject = `Actualización de Reserva - Mandalas`;
                emailComponent = (
                    <BookingCancellationEmail
                        guestName={data.guestName || 'Huésped'}
                        bookingId={data.bookingId || 'Ref-???'}
                        roomName={data.roomName || 'Habitación'}
                        refundStatus={data.refundStatus}
                        amountRefunded={data.refundAmount}
                        totalPrice={data.totalPrice || 0}
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
        // Mock if key is missing, short, placeholder, or the default value
        const isMockMode = !apiKey || apiKey === 're_123' || apiKey.includes('placeholder') || apiKey.length < 10;

        if (isMockMode) {
            console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`)
            await new Promise(resolve => setTimeout(resolve, 500));
            return NextResponse.json({ message: "Mock Email sent successfully", id: "mock_id_dev_123" });
        }

        // Real Send
        console.log(`[REAL EMAIL] Sending to ${to}...`);

        try {
            const { data: result, error } = await resend.emails.send({
                from: 'Mandalas <reservas@mandalashostel.com>',
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

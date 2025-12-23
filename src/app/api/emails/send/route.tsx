
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { BookingConfirmationEmail } from '@/emails/booking-confirmation';
import { BookingCancellationEmail } from '@/emails/booking-cancellation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, to, data } = body;

        // Validation
        if (!process.env.RESEND_API_KEY) {
            console.error("Resend API Key invalid");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        if (!to) {
            return NextResponse.json({ error: "Missing recipient" }, { status: 400 });
        }

        let emailComponent;
        let subject;

        // Render Template based on Type
        if (type === 'confirmation') {
            subject = `Reserva Confirmada - Mandalas ${data.location === 'pueblo' ? 'Pueblo' : 'Hideout'}`;
            emailComponent = (
                <BookingConfirmationEmail
                    guestName={data.guestName}
                    bookingId={data.bookingId}
                    checkIn={data.checkIn}
                    checkOut={data.checkOut}
                    roomName={data.roomName}
                    totalPrice={data.totalPrice}
                    location={data.location}
                />
            );
        } else if (type === 'cancellation') {
            subject = `Actualización de Reserva - Mandalas`;
            emailComponent = (
                <BookingCancellationEmail
                    guestName={data.guestName}
                    bookingId={data.bookingId}
                    roomName={data.roomName}
                    refundStatus={data.refundStatus}
                    amountRefunded={data.refundAmount}
                    totalPrice={data.totalPrice}
                />
            );
        } else {
            return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
        }

        // Send Email
        const { data: result, error } = await resend.emails.send({
            from: 'Mandalas <reservas@mandalashostel.com>', // User needs to verify this domain eventually
            to: [to],
            // bcc: ['admin@mandalashostel.com'], // Optional copy for admin
            subject: subject,
            react: emailComponent,
        });

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Email sent successfully", id: result?.id });

    } catch (error) {
        console.error("Internal Email API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

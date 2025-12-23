
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface BookingCancellationEmailProps {
    guestName: string;
    bookingId: string;
    roomName: string;
    refundStatus: 'none' | 'partial' | 'full';
    amountRefunded?: number;
    totalPrice: number;
    reason?: string;
}

export const BookingCancellationEmail = ({
    guestName,
    roomName,
    refundStatus,
    amountRefunded = 0,
    totalPrice = 0,
}: BookingCancellationEmailProps) => {

    const retainedAmount = totalPrice - amountRefunded;

    // Logic to determine main message tone
    const isFullRefund = refundStatus === 'full' || amountRefunded >= totalPrice;

    return (
        <Html>
            <Head />
            <Preview>Actualización sobre tu reserva en Mandalas</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://mandalashostel.com/logo.png"
                                width="120"
                                height="40"
                                alt="Mandalas"
                                className="my-0 mx-auto opacity-50 grayscale"
                            />
                        </Section>
                        <Heading className="text-rose-700 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Reserva Cancelada
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hola <strong>{guestName}</strong>,
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px] mb-4">
                            Tu reserva para la habitación <strong>{roomName}</strong> ha sido cancelada exitosamente.
                        </Text>

                        {/* Financial Breakdown Card */}
                        <Section className="bg-stone-50 rounded-lg p-4 my-2 border border-stone-200">
                            <Text className="text-stone-900 font-bold m-0 mb-3 uppercase text-xs tracking-wider border-b border-stone-200 pb-2">
                                Resumen Financiero
                            </Text>

                            <Row className="mb-2">
                                <Column>
                                    <Text className="m-0 text-stone-600 text-sm">Total de la Reserva</Text>
                                </Column>
                                <Column align="right">
                                    <Text className="m-0 text-stone-900 font-medium text-sm">Q{totalPrice}</Text>
                                </Column>
                            </Row>

                            {refundStatus !== 'none' && (
                                <Row className="mb-2">
                                    <Column>
                                        <Text className="m-0 text-emerald-600 text-sm">Reembolso Procesado</Text>
                                    </Column>
                                    <Column align="right">
                                        <Text className="m-0 text-emerald-600 font-bold text-sm">- Q{amountRefunded}</Text>
                                    </Column>
                                </Row>
                            )}

                            {!isFullRefund && (
                                <Row className="pt-2 border-t border-stone-200 mt-2">
                                    <Column>
                                        <Text className="m-0 text-stone-500 text-xs">Retención / Cargo</Text>
                                    </Column>
                                    <Column align="right">
                                        <Text className="m-0 text-stone-900 font-bold text-sm">Q{retainedAmount}</Text>
                                    </Column>
                                </Row>
                            )}
                        </Section>

                        <Text className="text-stone-500 text-[12px] italic mt-2 text-center">
                            * Si aplica devolución, verás el reflejo en tu cuenta en 5-10 días hábiles.
                        </Text>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-black text-[14px] leading-[24px] mt-6">
                            Lamentamos que no puedas acompañarnos esta vez. Esperamos tener la oportunidad de recibirte en el futuro.
                            <br />
                            El equipo de Mandalas
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default BookingCancellationEmail;

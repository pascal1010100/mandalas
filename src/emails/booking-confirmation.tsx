
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationEmailProps {
    guestName: string;
    bookingId: string;
    checkIn: string;
    checkOut: string;
    roomName: string;
    totalPrice: number;
    location: "pueblo" | "hideout";
}

export const BookingConfirmationEmail = ({
    guestName,
    bookingId,
    checkIn,
    checkOut,
    roomName,
    totalPrice,
    location,
}: BookingConfirmationEmailProps) => {
    const isPueblo = location === "pueblo";
    const address = isPueblo
        ? "Calle Principal #123, San Marcos La Laguna"
        : "Acceso por lancha, Muelle de Mandalas";

    const mapLink = isPueblo
        ? "https://goo.gl/maps/examplePueblo"
        : "https://goo.gl/maps/exampleHideout";

    return (
        <Html>
            <Head />
            <Preview>¡Tu reserva en Mandalas está confirmada!</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://mandalashostel.com/logo.png" // Replace with real asset or hosted image
                                width="120"
                                height="40"
                                alt="Mandalas"
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            ¡Reserva Confirmada!
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hola <strong>{guestName}</strong>,
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Estamos felices de confirmarte tu estancia en <strong>Mandalas {isPueblo ? "Pueblo" : "Hideout"}</strong>.
                            Aquí tienes los detalles de tu reserva:
                        </Text>

                        <Section className="bg-stone-50 rounded-lg p-4 my-4 border border-stone-200">
                            <Row>
                                <Column>
                                    <Text className="text-stone-500 text-[12px] uppercase font-bold m-0">Check-in</Text>
                                    <Text className="text-stone-900 text-[16px] font-semibold m-0">{checkIn}</Text>
                                    <Text className="text-stone-500 text-[12px] m-0">Desde 3:00 PM</Text>
                                </Column>
                                <Column>
                                    <Text className="text-stone-500 text-[12px] uppercase font-bold m-0">Check-out</Text>
                                    <Text className="text-stone-900 text-[16px] font-semibold m-0">{checkOut}</Text>
                                    <Text className="text-stone-500 text-[12px] m-0">Hasta 11:00 AM</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section>
                            <Row className="mb-2">
                                <Column>
                                    <Text className="text-stone-500 m-0 text-xs">Habitación</Text>
                                    <Text className="font-medium m-0">{roomName}</Text>
                                </Column>
                            </Row>
                            <Row>
                                <Column>
                                    <Text className="text-stone-500 m-0 text-xs">Total a Pagar</Text>
                                    <Text className="font-bold text-lg m-0 text-emerald-600">Q{totalPrice}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Section>
                            <Heading as="h3" className="text-[16px] font-bold m-0 mb-2">
                                ¿Cómo llegar?
                            </Heading>
                            <Text className="text-black text-[14px] leading-[24px] m-0">
                                Ubicación: {address}
                            </Text>
                            <Link
                                href={mapLink}
                                className="text-blue-600 text-[14px] underline block mt-2"
                            >
                                Ver en Google Maps
                            </Link>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px] mt-6">
                            ¡Nos vemos pronto en el paraíso!
                            <br />
                            El equipo de Mandalas
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default BookingConfirmationEmail;

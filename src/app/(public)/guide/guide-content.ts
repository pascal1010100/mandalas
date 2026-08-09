export type GuideVerificationStatus =
    | "project-confirmed"
    | "confirm-locally"
    | "owner-confirmation-required"

export interface OwnerConfirmationField {
    value: null
    needsOwnerConfirmation: true
    requestedValue: string
}

export type GuideRouteId =
    | "guatemala-city"
    | "antigua"
    | "panajachel"
    | "road"
    | "boat"

export interface GuideCopyBlock {
    title: string
    body: string
    status: GuideVerificationStatus
    needsOwnerConfirmation?: true
}

export interface GuideRoute {
    id: GuideRouteId
    origin: string
    destination: string
    summary: string
    steps: GuideCopyBlock[]
    planningNote: string
}

export interface PropertyArrivalGuide {
    id: "mandalas" | "hideout"
    propertyName: string
    positioning: string
    arrivalAdvice: string
    driverInstructions: OwnerConfirmationField
    mapLink: string
}

export interface GuideChecklistItem {
    id: string
    label: string
    detail: string
}

export interface GuideFaq {
    id: string
    question: string
    answer: string
    status: GuideVerificationStatus
    needsOwnerConfirmation?: true
}

export interface GuideSource {
    label: string
    url: string
    note: string
}

export interface GuideContent {
    eyebrow: string
    title: string
    introduction: string
    verificationNotice: string
    lastOperationalReview: OwnerConfirmationField
    sources: GuideSource[]
    routes: GuideRoute[]
    sanPedroArrival: GuideCopyBlock[]
    properties: PropertyArrivalGuide[]
    checklist: GuideChecklistItem[]
    faqHeading: string
    faqs: GuideFaq[]
}

export const guideContent = {
    eyebrow: "Getting to Lake Atitlán",
    title: "How to get to San Pedro La Laguna and Mandalas Hostels",
    introduction:
        "Start with the destination written on your ticket, then match the Mandalas property named on your reservation. From there, this guide walks you through the final connection step by step.",
    verificationNotice:
        "Before you set out, confirm today’s departure point, fare, schedule, and final property directions with your transport provider or the Mandalas team.",
    lastOperationalReview: {
        value: null,
        needsOwnerConfirmation: true,
        requestedValue: "Date of the most recent owner review of all operational arrival details",
    },
    sources: [
        {
            label: "INGUAT — Panajachel tourism development plan",
            url: "https://inguat.gob.gt/es/descargas-inguat-guatemala/9-planes-de-desarrollo-departamentales-y-municipales.html?download=752%3Apdtm-panajachel-2020-2023&start=20",
            note: "Institutional reference for the Tzanjuyú public landing, at the end of Calle Santander, and the published lake-transport window. Confirm current operations locally.",
        },
        {
            label: "Google Maps — Mandalas Hostal",
            url: "https://www.google.com/maps/search/Mandala%27s+Hostal+San+Pedro+La+Laguna",
            note: "Current public map listing shows Zona 2, Segundo Acceso Peatonal, San Pedro La Laguna 07018, Plus Code MPVG+RR. Use as an orientation reference and verify the live pin with reception.",
        },
        {
            label: "Google Maps — Mandalas Hideout",
            url: "https://www.google.com/maps/search/Mandalas+Hideout+San+Pedro+La+Laguna",
            note: "Current public map listing shows Camino hacia la finca, San Pedro La Laguna 07018, Plus Code MPMR+38. Use the live location link from the Mandalas team for the final approach.",
        },
        {
            label: "Lake Atitlán transportation guide",
            url: "https://atitlan.com/how-to-get-to-lake-atitlan-transportation-guide/",
            note: "Published reference for the approximate Panajachel–San Pedro boat fare and journey time. Use both for orientation only and confirm them locally on the day of travel.",
        },
        {
            label: "Living in Guatemala — Antigua to Lake Atitlán shuttle guide",
            url: "https://livinginguatemala.com/transport/antigua-to-lake-atitlan/",
            note: "Public shuttle reference showing services sold to Panajachel or directly to San Pedro. Check the operator, schedule, route, and fare before booking.",
        },
    ],
    routes: [
        {
            id: "guatemala-city",
            origin: "Guatemala City or La Aurora International Airport",
            destination: "San Pedro La Laguna",
            summary:
                "Choose a service that clearly names either San Pedro La Laguna or Panajachel as its endpoint. Panajachel requires a separate public-boat connection.",
            steps: [],
            planningNote:
                "Get the pickup point and final destination in writing; allow extra time for traffic and shared stops.",
        },
        {
            id: "antigua",
            origin: "Antigua Guatemala",
            destination: "San Pedro La Laguna",
            summary:
                "Shared services commonly finish in Panajachel, while some continue toward San Pedro by road. The ticket endpoint matters more than the words ‘Lake Atitlán.’",
            steps: [],
            planningNote:
                "Confirm the pickup location and whether a separate boat ticket is needed before booking.",
        },
        {
            id: "panajachel",
            origin: "Panajachel",
            destination: "San Pedro La Laguna",
            summary:
                "Use the Tzanjuyú public landing at the end of Calle Santander as your orientation point. Ask for the active San Pedro boat before boarding.",
            steps: [],
            planningNote:
                "Published references suggest roughly Q25 and 20–30 minutes for a direct crossing, with service around 06:00–16:30/17:00. Treat all three as same-day references, not guarantees.",
        },
        {
            id: "road",
            origin: "Overland routes",
            destination: "San Pedro La Laguna",
            summary:
                "A direct road transfer avoids the boat connection, but mountain-road conditions can change the arrival time.",
            steps: [
                {
                    title: "Confirm the route that day",
                    body: "Ask your driver to check current mountain-road and access conditions.",
                    status: "confirm-locally",
                },
                {
                    title: "Share your booked property",
                    body: "Send the property name and current map link before the final approach.",
                    status: "owner-confirmation-required",
                    needsOwnerConfirmation: true,
                },
            ],
            planningNote:
                "Keep Mandalas updated if traffic changes your arrival window.",
        },
        {
            id: "boat",
            origin: "Lake Atitlán public boat routes",
            destination: "San Pedro La Laguna",
            summary:
                "Public boats connect San Pedro with Panajachel and other lake towns; routes may include intermediate stops.",
            steps: [
                {
                    title: "Name the destination clearly",
                    body: "Ask for San Pedro La Laguna and verify the arrival point before boarding.",
                    status: "confirm-locally",
                },
                {
                    title: "Keep essentials with you",
                    body: "Carry documents, medication, valuables, and a light layer in your hand luggage.",
                    status: "project-confirmed",
                },
            ],
            planningNote:
                "Follow the crew’s safety guidance and check lake conditions, especially later in the day.",
        },
    ],
    sanPedroArrival: [
        {
            title: "Open the correct property pin",
            body: "Check the name on your reservation and open its current location. Central Mandalas and Mandalas Hideout are different destinations. If the name and pin match, you’re on the right track.",
            status: "owner-confirmation-required",
            needsOwnerConfirmation: true,
        },
        {
            title: "Decide whether to walk or ride",
            body: "The best choice depends on the property, your luggage, mobility, weather, and daylight. If you’re unsure, that’s completely normal—ask the Mandalas team before setting out.",
            status: "confirm-locally",
        },
        {
            title: "Show the pin before the ride",
            body: "For a tuk-tuk, show the driver the live property location and agree on the total fare before leaving.",
            status: "confirm-locally",
        },
    ],
    properties: [
        {
            id: "mandalas",
            propertyName: "Mandalas",
            positioning:
                "Mandalas is the more central, walkable, and social of the two properties in San Pedro La Laguna.",
            arrivalAdvice:
                "Google Maps lists Zona 2, Segundo Acceso Peatonal (Plus Code MPVG+RR). Use the current pin from the Mandalas team for the final walking route.",
            driverInstructions: {
                value: null,
                needsOwnerConfirmation: true,
                requestedValue: "Exact Spanish driver instruction and locally recognized landmark for Mandalas",
            },
            mapLink: "https://www.google.com/maps/search/?api=1&query=Mandala%27s+Hostal+San+Pedro+La+Laguna",
        },
        {
            id: "hideout",
            propertyName: "Mandalas Hideout",
            positioning:
                "Mandalas Hideout is the quieter property outside central San Pedro La Laguna, closer to the lake and surrounding landscape.",
            arrivalAdvice:
                "Google Maps lists Camino hacia la finca (Plus Code MPMR+38). Tell the tuk-tuk driver: \"Mandalas Hideout, camino hacia la finca.\" Then show the current pin.",
            driverInstructions: {
                value: null,
                needsOwnerConfirmation: true,
                requestedValue: "Exact Spanish driver instruction and locally recognized landmark for Mandalas Hideout",
            },
            mapLink: "https://www.google.com/maps/search/?api=1&query=Mandalas+Hideout+San+Pedro+La+Laguna",
        },
    ],
    checklist: [
        {
            id: "property",
            label: "Reservation and location",
            detail: "Save the booked property name, its current map pin, and the Mandalas contact together.",
        },
        {
            id: "transport",
            label: "Endpoint and connection",
            detail: "Know whether your ticket ends in Panajachel or San Pedro and whether a boat is still needed.",
        },
        {
            id: "fare",
            label: "Fare and payment",
            detail: "Confirm the total price, accepted payment method, and luggage charge before boarding.",
        },
        {
            id: "weather",
            label: "Conditions and timing",
            detail: "Check weather and lake conditions, and tell Mandalas early if you may arrive late.",
        },
    ],
    faqHeading: "Useful answers when the journey changes",
    faqs: [
        {
            id: "missed-connection",
            question: "What should I do if I miss the last practical connection?",
            answer:
                "You do not need to solve this alone. Contact Mandalas before choosing an alternative. The team can help you assess current transport and coordinate the arrival plan for your property.",
            status: "owner-confirmation-required",
            needsOwnerConfirmation: true,
        },
        {
            id: "cash",
            question: "Should I carry Guatemalan quetzales for local transport?",
            answer:
                "Yes, useful denominations can help because some local services may prefer or require cash. Agree on the fare before boarding.",
            status: "confirm-locally",
        },
        {
            id: "weather",
            question: "Can weather affect travel on Lake Atitlán?",
            answer:
                "Yes. Wind, rain, and visibility can affect comfort, journey time, and boat operations. Follow the local crew’s guidance that day.",
            status: "confirm-locally",
        },
        {
            id: "lost",
            question: "What should I do if a driver cannot find the property?",
            answer:
                "Pause before continuing—you do not need to guess. Do not rely on a similar listing or an old pin. Show the current Google Maps link, repeat the full property name, and contact Mandalas.",
            status: "owner-confirmation-required",
            needsOwnerConfirmation: true,
        },
    ],
} satisfies GuideContent

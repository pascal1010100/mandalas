import type { GuideContent } from "@/app/(public)/guide/guide-content"

export const guideContentEs = {
    eyebrow: "Cómo llegar al Lago de Atitlán",
    title: "Cómo llegar a San Pedro La Laguna y Mandalas Hostels",
    introduction: "Empieza por revisar el destino escrito en tu boleto y compáralo con la propiedad Mandalas de tu reserva. Esta guía te acompaña paso a paso durante la conexión final.",
    verificationNotice: "Antes de salir, confirma el punto de partida, la tarifa, el horario y las indicaciones finales con tu proveedor de transporte o con el equipo de Mandalas.",
    lastOperationalReview: { value: null, needsOwnerConfirmation: true, requestedValue: "Fecha de la revisión operativa más reciente" },
    sources: [
        { label: "INGUAT — plan de desarrollo turístico de Panajachel", url: "https://inguat.gob.gt/es/descargas-inguat-guatemala/9-planes-de-desarrollo-departamentales-y-municipales.html?download=752%3Apdtm-panajachel-2020-2023&start=20", note: "Referencia institucional para el embarcadero público de Tzanjuyú y la ventana publicada de transporte lacustre. Confirma la operación actual localmente." },
        { label: "Google Maps — Mandalas Hostal", url: "https://www.google.com/maps/search/Mandala%27s+Hostal+San+Pedro+La+Laguna", note: "La ficha pública muestra Zona 2, Segundo Acceso Peatonal y el código MPVG+RR. Verifica el pin actual con recepción." },
        { label: "Google Maps — Mandalas Hideout", url: "https://www.google.com/maps/search/Mandalas+Hideout+San+Pedro+La+Laguna", note: "La ficha pública muestra Camino hacia la finca y el código MPMR+38. Usa el enlace de ubicación vigente para el último tramo." },
        { label: "Guía de transporte del Lago de Atitlán", url: "https://atitlan.com/how-to-get-to-lake-atitlan-transportation-guide/", note: "Referencia publicada para la tarifa y duración aproximadas entre Panajachel y San Pedro. Confirma ambas el día del viaje." },
        { label: "Living in Guatemala — transporte desde Antigua", url: "https://livinginguatemala.com/transport/antigua-to-lake-atitlan/", note: "Referencia pública de servicios hacia Panajachel o San Pedro. Confirma operador, horario, ruta y tarifa antes de reservar." },
    ],
    routes: [
        { id: "guatemala-city", origin: "Ciudad de Guatemala o Aeropuerto Internacional La Aurora", destination: "San Pedro La Laguna", summary: "Elige un servicio que indique claramente San Pedro La Laguna o Panajachel como destino final. Panajachel requiere una conexión separada en lancha pública.", steps: [], planningNote: "Solicita por escrito el punto de recogida y el destino final; deja tiempo adicional para el tráfico y las paradas compartidas." },
        { id: "antigua", origin: "Antigua Guatemala", destination: "San Pedro La Laguna", summary: "Muchos servicios compartidos terminan en Panajachel y algunos continúan por carretera hacia San Pedro. El destino del boleto importa más que las palabras ‘Lago de Atitlán’.", steps: [], planningNote: "Confirma el punto de recogida y si necesitarás comprar un boleto de lancha por separado." },
        { id: "panajachel", origin: "Panajachel", destination: "San Pedro La Laguna", summary: "Usa como referencia el embarcadero público de Tzanjuyú, al final de la Calle Santander. Pregunta por la lancha activa hacia San Pedro antes de abordar.", steps: [], planningNote: "Las referencias publicadas indican aproximadamente Q25 y 20–30 minutos para un cruce directo, con servicio alrededor de 06:00–16:30/17:00. Confirma todo el mismo día." },
        { id: "road", origin: "Rutas por carretera", destination: "San Pedro La Laguna", summary: "Un traslado directo por carretera evita la conexión en lancha, pero las condiciones de montaña pueden cambiar la hora de llegada.", steps: [{ title: "Confirma la ruta ese día", body: "Pide al conductor que revise las condiciones actuales de la carretera y los accesos.", status: "confirm-locally" }, { title: "Comparte la propiedad reservada", body: "Envía el nombre de la propiedad y el enlace vigente del mapa antes del último tramo.", status: "owner-confirmation-required", needsOwnerConfirmation: true }], planningNote: "Mantén informado a Mandalas si el tráfico cambia tu hora de llegada." },
        { id: "boat", origin: "Rutas públicas en lancha por el Lago de Atitlán", destination: "San Pedro La Laguna", summary: "Las lanchas públicas conectan San Pedro con Panajachel y otros pueblos del lago; algunas rutas incluyen paradas intermedias.", steps: [{ title: "Di claramente tu destino", body: "Pide San Pedro La Laguna y verifica el punto de llegada antes de abordar.", status: "confirm-locally" }, { title: "Lleva lo esencial contigo", body: "Guarda documentos, medicamentos, objetos de valor y una capa ligera en tu equipaje de mano.", status: "project-confirmed" }], planningNote: "Sigue las instrucciones de seguridad de la tripulación y revisa las condiciones del lago, especialmente al final del día." },
    ],
    sanPedroArrival: [
        { title: "Abre el pin de la propiedad correcta", body: "Comprueba el nombre de tu reserva y abre su ubicación vigente. Mandalas céntrico y Mandalas Hideout son destinos diferentes.", status: "owner-confirmation-required", needsOwnerConfirmation: true },
        { title: "Decide si caminar o tomar transporte", body: "La mejor opción depende de la propiedad, tu equipaje, movilidad, el clima y la luz disponible. Si dudas, consulta al equipo de Mandalas.", status: "confirm-locally" },
        { title: "Muestra el pin antes del trayecto", body: "Si tomas un tuk-tuk, muestra la ubicación vigente al conductor y acuerda la tarifa total antes de salir.", status: "confirm-locally" },
    ],
    properties: [
        { id: "mandalas", propertyName: "Mandalas", positioning: "Mandalas es la opción más céntrica, caminable y social de las dos propiedades en San Pedro La Laguna.", arrivalAdvice: "Google Maps muestra Zona 2, Segundo Acceso Peatonal (código MPVG+RR). Usa el pin actual del equipo de Mandalas para el último tramo.", driverInstructions: { value: null, needsOwnerConfirmation: true, requestedValue: "Indicación exacta en español y punto de referencia local para Mandalas" }, mapLink: "https://www.google.com/maps/search/?api=1&query=Mandala%27s+Hostal+San+Pedro+La+Laguna" },
        { id: "hideout", propertyName: "Mandalas Hideout", positioning: "Mandalas Hideout es la propiedad más tranquila, fuera del centro y cerca del lago y el paisaje.", arrivalAdvice: "Google Maps muestra Camino hacia la finca (código MPMR+38). Dile al conductor: ‘Mandalas Hideout, camino hacia la finca’ y muestra el pin vigente.", driverInstructions: { value: null, needsOwnerConfirmation: true, requestedValue: "Indicación exacta en español y punto de referencia local para Hideout" }, mapLink: "https://www.google.com/maps/search/?api=1&query=Mandalas+Hideout+San+Pedro+La+Laguna" },
    ],
    checklist: [
        { id: "property", label: "Reserva y ubicación", detail: "Guarda juntos el nombre de la propiedad reservada, su pin vigente y el contacto de Mandalas." },
        { id: "transport", label: "Destino y conexión", detail: "Confirma si tu boleto termina en Panajachel o San Pedro y si todavía necesitas una lancha." },
        { id: "fare", label: "Tarifa y pago", detail: "Confirma el precio total, el método de pago aceptado y cualquier cargo por equipaje antes de abordar." },
        { id: "weather", label: "Condiciones y horario", detail: "Revisa el clima y el estado del lago, y avisa con tiempo a Mandalas si puedes llegar tarde." },
    ],
    faqHeading: "Respuestas útiles cuando cambia el viaje",
    faqs: [
        { id: "missed-connection", question: "¿Qué hago si pierdo la última conexión práctica?", answer: "No tienes que resolverlo solo. Contacta a Mandalas antes de elegir una alternativa para revisar el transporte disponible y coordinar la llegada.", status: "owner-confirmation-required", needsOwnerConfirmation: true },
        { id: "cash", question: "¿Debo llevar quetzales para el transporte local?", answer: "Sí. Algunas denominaciones pueden ayudarte porque ciertos servicios locales prefieren o requieren efectivo. Acuerda la tarifa antes de abordar.", status: "confirm-locally" },
        { id: "weather", question: "¿Puede el clima afectar el viaje por el Lago de Atitlán?", answer: "Sí. El viento, la lluvia y la visibilidad pueden afectar la comodidad, la duración y la operación de las lanchas. Sigue las indicaciones locales.", status: "confirm-locally" },
        { id: "lost", question: "¿Qué hago si un conductor no encuentra la propiedad?", answer: "Detente antes de continuar. No dependas de una ficha parecida o un pin antiguo. Muestra el enlace actual, repite el nombre completo y contacta a Mandalas.", status: "owner-confirmation-required", needsOwnerConfirmation: true },
    ],
} satisfies GuideContent

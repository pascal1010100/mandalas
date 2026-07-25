---
target: la portada de Mandalas
total_score: 19
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 3
timestamp: 2026-07-25T13-33-18Z
slug: src-app-public-page-tsx
---
# Impeccable Critique — Portada de Mandalas

## Design Health Score

| # | Heurística | Puntuación | Problema clave |
|---|---|---:|---|
| 1 | Visibilidad del estado del sistema | 3 | La navegación es convencional, pero los CTA genéricos no anticipan que conducen primero a otra selección. |
| 2 | Correspondencia con el mundo real | 3 | El lenguaje es cercano, aunque “movement”, “breathe” y “slow” aportan más atmósfera que información práctica. |
| 3 | Control y libertad | 3 | Las rutas principales y salidas del menú están disponibles; no se observan interacciones que atrapen. |
| 4 | Consistencia y estándares | 2 | “Book now” puede abrir Cloudbeds o una sección intermedia según la página; además existe un botón anidado dentro de un enlace. |
| 5 | Prevención de errores | 2 | No elegir una propiedad por defecto es prudente, pero la etiqueta genérica de reserva crea expectativas equivocadas. |
| 6 | Reconocimiento antes que memoria | 3 | Las dos opciones son visibles, pero en móvil hay que recordar la primera mientras se descubre la segunda. |
| 7 | Flexibilidad y eficiencia | n/a | Superficie Persuade sin flujo experto repetitivo. |
| 8 | Diseño estético y minimalista | 3 | La dirección es cinematográfica y controlada, pero la segunda sección repite la misma decisión en varias formas. |
| 9 | Reconocimiento y recuperación de errores | n/a | La portada no contiene una operación que genere errores dentro de la página. |
| 10 | Ayuda y documentación | n/a | No es necesaria para esta superficie de elección; Contact está visible. |
| **Total** |  | **19/28** | **Aceptable — base pulida con brechas importantes en la decisión** |

## Design Specificity Verdict

**La portada se siente específicamente diseñada para Mandalas en el primer viewport, pero se vuelve más intercambiable debajo.**

La división entre dos propiedades reales, las fotografías auténticas y las señales ámbar/lima expresan con claridad “Two Rhythms, One Lake”. El patio cálido y la terraza al atardecer construyen un contraste creíble, no una fantasía genérica de resort.

La segunda sección pierde parte de esa especificidad. Su combinación de eyebrow, titular, tres puntos, mosaico fotográfico y franja de datos podría pertenecer a muchos hostales boutique. Repite “movement”, “breathe”, “Social” y “Slow” sin añadir suficientes diferencias prácticas para decidir con confianza.

### Deterministic Scan

El detector CLI devolvió 13 avisos `design-system-font-size`, todos en `src/app/(public)/page.tsx`. Los trece son falsos positivos contra `DESIGN.md`: `10px` coincide con el mínimo documentado de Label; `2rem` cae dentro de Headline; y `3.6rem`, `4.25rem` y `5.25rem` caen dentro de Display. El detector no interpreta todavía los rangos tipográficos documentados.

### Visual Overlays

No existe un overlay visible fiable. El runtime del navegador devolvió `No browser is available` y la lista de backends fue vacía. La evidencia visual se sustituyó por inspección de código, revisión directa de los dos activos fotográficos y las pruebas E2E existentes.

## Overall Impression

La primera impresión es memorable y propia: dos fotografías reales convierten la arquitectura de elección en la identidad del producto. La oportunidad principal es hacer que esa comparación sea igualmente clara en móvil y que la parte inferior convierta emoción en confianza práctica, sin repetir el mismo contraste.

## What's Working

1. **Una idea inicial específica del producto.** La composición 50/50, las fotografías reales y las señales cálida/fría comunican las dos experiencias sin inventar testimonios ni precios.
2. **Copy conciso y prudente.** “Town center”, “Toward the lake”, “Rooftop / Center / Lake” y “Volcano / Lake / Slow” permiten una lectura rápida y respetan la evidencia disponible.
3. **Sistema visual disciplinado.** Paneles rectos, overlays oscuros, acentos escasos, Outfit ligera y CTA pill siguen `DESIGN.md` de forma coherente.

## Cognitive Load

La carga cognitiva general es baja: falla 1 de 8 comprobaciones.

- Enfoque único: aprobado.
- Chunking: aprobado.
- Agrupación: aprobado.
- Jerarquía: aprobada.
- Una decisión a la vez: aprobada.
- Opciones mínimas: aprobada en el héroe.
- Memoria de trabajo: falla en móvil porque ambos paneles suman al menos `108svh`.
- Divulgación progresiva: aprobada.

## Emotional Journey

- **Pico inicial:** fuerte; las fotografías reales hacen tangible la promesa dual.
- **Primer valle:** en móvil, Mandalas ocupa primero la pantalla y Hideout queda debajo, creando un sesgo de orden.
- **Mitad:** el tono permanece coherente, pero la confianza no aumenta porque varios bloques repiten el mismo mensaje emocional.
- **Momento de compromiso:** “Book now” y “Book your stay” parecen inmediatos, aunque sin propiedad elegida llevan a `/contact#book-directly`.
- **Cierre:** la garantía de disponibilidad y precios finales en Cloudbeds aparece hasta el footer, demasiado lejos de la primera intención de reserva.

## Priority Issues

### [P1] La comparación simultánea desaparece en móvil

- **Qué:** cada panel tiene al menos `54svh`; juntos requieren al menos `108svh`.
- **Por qué importa:** Mandalas domina la primera pantalla y obliga a recordar información al buscar Hideout.
- **Corrección:** mostrar ambas opciones dentro del primer viewport mediante bandas fotográficas compactas o una división móvil equilibrada.
- **Comando sugerido:** `$impeccable adapt`

### [P1] “Book now” no describe el resultado en la portada

- **Qué:** los CTA sin `location` llevan a una sección intermedia, mientras los CTA específicos abren Cloudbeds.
- **Por qué importa:** en el momento de mayor intención, una etiqueta idéntica produce destinos distintos.
- **Corrección:** usar “Choose a property” o “Check availability” cuando todavía no existe una propiedad seleccionada; reservar “Book Mandalas/Hideout” para Cloudbeds.
- **Comando sugerido:** `$impeccable clarify`

### [P1] Contact contiene interactividad anidada

- **Qué:** `src/app/(public)/page.tsx:117` renderiza un botón dentro de un enlace.
- **Por qué importa:** puede crear foco y activación confusos para teclado y tecnología asistiva.
- **Corrección:** usar `Button asChild` con `Link`, igual que el patrón establecido en `ConsultationLink`.
- **Comando sugerido:** `$impeccable audit`

### [P2] La parte inferior repite atmósfera en lugar de resolver la decisión

- **Qué:** puntos de ritmo, mosaico, panel de ubicación y franja de datos reiteran “social versus slow”.
- **Por qué importa:** el viajero necesita diferencias verificables antes de abandonar la portada.
- **Corrección:** sustituir un bloque repetido por una comparación compacta de ubicación, sueño/ruido, espacios compartidos y tipos de habitación.
- **Comando sugerido:** `$impeccable distill`

### [P2] La traducción del navegador está deshabilitada globalmente

- **Qué:** el `<body>` usa `notranslate` y `translate="no"`.
- **Por qué importa:** el público principal es internacional y puede depender de traducción asistida.
- **Corrección:** retirar la prohibición global y proteger sólo nombres propios que deban permanecer intactos.
- **Comando sugerido:** `$impeccable harden`

## Persona Red Flags

### Jordan — visitante primerizo

- “Enter” no explica si abre detalles, disponibilidad o reserva.
- “Book now” conduce a destinos diferentes según el contexto.
- El lenguaje emocional no basta para elegir racionalmente entre las propiedades.

### Riley — usuario que prueba límites

- Encontrará que CTA idénticos llevan a destinos distintos.
- Detectará la estructura inválida `Link > Button`.
- Verá que la garantía de Cloudbeds está lejos del primer CTA.

### Casey — visitante móvil distraído

- El menú usa un control de `36×36px`, por debajo del objetivo táctil recomendado de `44×44px`.
- Hideout queda fuera del primer viewport.
- La portada reserva padding inferior para un CTA móvil que allí no se renderiza.
- Varias etiquetas usan `10px` y opacidades bajas.

### Maya — viajera internacional

- `notranslate` elimina su ayuda de idioma más inmediata.
- La página presenta diferencias emocionales antes que diferencias prácticas.
- Los CTA genéricos no preservan ni nombran una propiedad seleccionada.
- La autoridad de Cloudbeds aparece tarde.

## Minor Observations

- El layout público mantiene `pb-20` en la portada aunque `MobileCTA` devuelve `null`.
- Varias etiquetas blancas al 35–42% sobre Stone 950 no alcanzan contraste AA.
- El wordmark usa Outfit muy pesada en navbar/footer y una voz ligera en la portada.
- El footer compartido da a Mandalas un punto ámbar sin una señal equivalente para Hideout.
- Los enlaces-panel necesitan foco visible tan claro como su hover.

## Questions to Consider

1. ¿La comparación móvil debe mostrar las dos propiedades completas en el primer viewport, o basta con mantener visibles ambos nombres y ampliar una opción a la vez?
2. ¿“Book now” debe significar siempre “abrir Cloudbeds para una propiedad elegida”?
3. ¿Qué cuatro hechos verificados deben reemplazar la repetición emocional: ubicación, ruido/sueño, espacios compartidos y tipos de habitación?

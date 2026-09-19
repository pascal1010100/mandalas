---
target: HomeIntro animation
total_score: 23
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-13T17-03-48Z
slug: src-components-home-home-intro-tsx
---
# HomeIntro — reevaluación integral

## Design-specificity verdict

La propuesta tiene alta especificidad de producto: fotografía real de las dos propiedades, nombres exactos, contraste pueblo/lago y las señales Golden Rooftop/Lake Moss. No parece una intro genérica de hotel. El problema no es identidad sino necesidad: repite casi exactamente el hero que bloquea.

## Nielsen heuristics

| Heurística | Score | Evidencia |
| --- | ---: | --- |
| Visibility of system status | 2/4 | La línea comunica actividad, pero no existe progreso ni expectativa clara del cierre automático. |
| Match with the real world | 4/4 | “In town · Social rooftop” y “Near the lake · Calm stay” son diferencias concretas y verificables. |
| User control and freedom | 3/4 | Skip y Escape funcionan, pero toda la experiencia sigue siendo una barrera modal. |
| Consistency and standards | 4/4 | Excelente continuidad de fotos, tipografía, tono nocturno y acentos con el hero. |
| Error prevention | 3/4 | Sesión única, Save-Data y reduced motion están contemplados; el fondo no queda estructuralmente inert. |
| Recognition rather than recall | 4/4 | Las dos propiedades y diferencias aparecen simultáneamente. |
| Flexibility and efficiency | n/a | Microsecuencia Persuade, sin flujo experto aplicable. |
| Aesthetic and minimalist design | 3/4 | Composición cuidada, pero la pantalla completa duplica el contenido inmediatamente posterior. |
| Error recovery | n/a | No existe una tarea que produzca errores en esta superficie. |
| Help and documentation | n/a | La secuencia se explica por sí misma. |

**Total: 23/28 — 82%, Good.** El score de ejecución no debe confundirse con una recomendación de mantener el patrón bloqueante.

## Cognitive load

Carga cognitiva baja, sin fallos del checklist ni decisiones con más de cuatro opciones. La carga problemática es temporal: el visitante comprende la idea pronto, pero todavía debe esperar o cerrar la capa antes de actuar.

## Emotional journey

Curiosidad con la división nocturna → reconocimiento cuando la línea conecta las dos estancias → pico alrededor de 1.2–1.7 s → valle estático hasta 3.6 s → fade hacia un hero casi idéntico. El final no entrega una recompensa ni nueva agencia; sólo retira una capa.

## Strengths

1. La diferencia entre dos hostales se entiende inmediatamente mediante nombres, descriptores y fotografías auténticas.
2. El concepto se adapta realmente: conexión horizontal en escritorio y recorrido vertical en móvil.
3. La línea orgánica y las dos señales de color constituyen un motivo de motion propio de “Two Rhythms, One Lake”.

## Priority issues

### [P1] Portada bloqueante y repetitiva

- **Why it matters:** obliga a esperar hasta 3.6 s para llegar a un hero que repite fotos, frase y distinción, retrasando información accionable y reserva.
- **Fix:** integrar línea, señales y asentamiento fotográfico dentro del hero, disponible desde el primer frame; completar la coreografía en 0.9–1.2 s.
- **Suggested command:** `$impeccable distill`.

### [P1] Apariencia de elección sin agencia

- **Why it matters:** los dos nombres y nodos parecen opciones, pero no son interactivos; quien ya eligió no puede avanzar desde esa pantalla.
- **Fix:** usar los paneles reales del hero como destinos desde el comienzo. Si se conserva una capa, convertir ambas propiedades en enlaces accesibles.
- **Suggested command:** `$impeccable clarify`.

### [P2] Salida con desplazamiento de layout e interacción prematura

- **Why it matters:** el overflow se restaura antes del fade; el scrollbar reduce 15 px el viewport y desplaza 7.5 px el contenido aún visible. Al mismo tiempo `pointer-events:none` permite interactuar con el hero detrás de la capa parcial.
- **Fix:** restaurar overflow e interacción únicamente después del desmontaje, o eliminar la capa modal integrando el motion en el hero.
- **Suggested command:** `$impeccable harden`.

### [P2] Accesibilidad modal incompleta

- **Why it matters:** Tab está atrapado, pero los enlaces del fondo siguen presentes para navegación virtual de lector de pantalla.
- **Fix:** volver inert/aria-hidden el shell subyacente mientras exista el diálogo; preferiblemente eliminar el diálogo.
- **Suggested command:** `$impeccable audit`.

### [P2] Móvil compacto convierte información en ornamento

- **Why it matters:** en 320×568 los descriptores uppercase de 10 px se parten en varias líneas y la foto oscura aporta atmósfera más que información.
- **Fix:** copy más corto, mayor legibilidad y scrims localizados; o dejar que el hero móvil real resuelva esa comparación.
- **Suggested command:** `$impeccable adapt`.

## Persona red flags

- **Jordan, primera visita:** comprende ambos hostales, pero interpreta nombres/nodos como opciones y no puede elegir; el hero siguiente repite la explicación en lugar de confirmar progreso.
- **Casey, móvil y con prisa:** Skip cumple tamaño táctil, pero la barrera de 3.6 s es costosa para una visita rápida orientada a reserva.
- **Sam, lector de pantalla/teclado:** foco, Escape y reduced motion están bien pensados; el fondo no inert y la tipografía secundaria diminuta son los riesgos reales.

## Minor observations

- La coreografía termina aproximadamente a 1.72 s y deja cerca de 1.9 s sin evolución.
- Ridge/reflection añaden atmósfera, pero no significado y casi desaparecen en móvil compacto.
- La salida se lee como cambio de brillo porque intro y hero comparten la misma estructura visual.
- El detector de markup no encontró anti-patrones deterministas; el problema central es conceptual y temporal.

## Questions to consider

- Si el hero ya explica y permite elegir, ¿qué trabajo único justifica bloquearlo?
- ¿Qué pasaría si la línea conectara directamente los dos enlaces reales del hero?
- ¿Puede “cinemático” vivir en el contenido accionable en vez de en una tarjeta de título separada?
- ¿Puede toda la idea aterrizar en 900–1200 ms con la página utilizable desde el primer frame?

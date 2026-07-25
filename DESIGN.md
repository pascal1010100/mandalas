---
name: "Mandalas Hostels"
description: "Two distinct rhythms for staying beside Lake Atitlán."
colors:
  atitlan-night: "oklch(14.7% 0.004 49.25)"
  night-surface: "oklch(21.6% 0.006 56.043)"
  cloud-white: "oklch(98.5% 0.001 106.423)"
  soft-stone: "oklch(92.3% 0.003 48.717)"
  warm-stone: "oklch(70.9% 0.01 56.259)"
  golden-rooftop: "oklch(87.9% 0.169 91.605)"
  lake-moss: "oklch(89.7% 0.196 126.665)"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(2.35rem, 7vw, 6rem)"
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: "0.06em"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "0.16em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.16em"
rounded:
  none: "0"
  md: "8px"
  lg: "10px"
  xl: "14px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.atitlan-night}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.soft-stone}"
    textColor: "{colors.atitlan-night}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.cloud-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "48px"
  experience-card:
    backgroundColor: "oklch(100% 0 0 / 0.04)"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  input-dark:
    backgroundColor: "transparent"
    textColor: "{colors.cloud-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "4px 0"
    height: "44px"
  nav-glass:
    backgroundColor: "oklch(14.7% 0.004 49.25 / 0.8)"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.none}"
    height: "80px"
  chip-location:
    backgroundColor: "oklch(100% 0 0 / 0.1)"
    textColor: "{colors.cloud-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
---

# Design System: Mandalas Hostels

## Overview

**Creative North Star: "Two Rhythms, One Lake"**

Mandalas se siente cinematográfico, editorial, auténtico y sereno. La fotografía real ocupa el primer plano; las capas oscuras, la tipografía espaciada y el movimiento lento permiten que dos experiencias distintas se sientan parte de una sola marca.

El sistema contrapone la energía cálida y social de Mandalas con la calma vegetal de Hideout sin convertirlas en marcas separadas. La estructura compartida permanece sobria y nocturna; Golden Rooftop y Lake Moss aparecen como señales escasas que orientan al viajero hacia cada ritmo.

**Key Characteristics:**

- Fotografía inmersiva con encuadres amplios y tratamiento cinematográfico.
- Base Atitlán Night con texto claro, bordes translúcidos y capas atmosféricas.
- Titulares Outfit ligeros, en mayúsculas y con tracking generoso.
- Golden Rooftop identifica Mandalas; Lake Moss identifica Hideout.
- Acciones directas y legibles que conducen a elegir y reservar.

## Colors

La paleta mantiene un escenario mineral oscuro y reserva los dos acentos naturales para distinguir propiedades, estados y caminos de navegación.

### Primary

- **Golden Rooftop** (`oklch(87.9% 0.169 91.605)`): señal cálida de Mandalas en cejas, iconos, líneas activas y pequeños detalles.

### Secondary

- **Lake Moss** (`oklch(89.7% 0.196 126.665)`): señal fresca de Hideout en los mismos roles, nunca como fondo dominante de toda la experiencia.

### Neutral

- **Atitlán Night** (`oklch(14.7% 0.004 49.25)`): fondo principal y base de navegación.
- **Night Surface** (`oklch(21.6% 0.006 56.043)`): superficies secundarias, footer y bloques de cierre.
- **Cloud White** (`oklch(98.5% 0.001 106.423)`): titulares, acciones principales y texto de máxima prioridad.
- **Soft Stone** (`oklch(92.3% 0.003 48.717)`): hover de acciones claras y divisores luminosos.
- **Warm Stone** (`oklch(70.9% 0.01 56.259)`): texto secundario y datos prácticos.

**The Two Signals Rule.** Golden Rooftop pertenece a Mandalas y Lake Moss pertenece a Hideout; no se mezclan en un mismo control salvo cuando la interfaz compara explícitamente ambas propiedades.

## Typography

**Display Font:** Outfit (con `sans-serif` como fallback)  
**Body Font:** Inter (con `sans-serif` como fallback)

**Character:** Outfit aporta una voz editorial, geométrica y espaciosa; Inter mantiene descripciones, datos y formularios claros para viajeros internacionales.

### Hierarchy

- **Display** (300, `clamp(2.35rem, 7vw, 6rem)`, 0.98): héroes y nombres de propiedad; mayúsculas con tracking responsivo.
- **Headline** (300, `clamp(1.875rem, 4vw, 3rem)`, 1.2): títulos de sección y frases de contraste.
- **Title** (600, `1.125rem–1.25rem`, 1.25): opciones de habitación, ventajas y elementos operables.
- **Body** (400, `1rem–1.125rem`, 1.625): descripciones con anchura controlada y lectura pausada.
- **Label** (600, `0.625rem–0.75rem`, `0.16em–0.28em`): cejas, metadatos y navegación; normalmente en mayúsculas.

**The Air Around Type Rule.** Los titulares espaciados necesitan margen y contraste; no deben apilarse dentro de tarjetas densas ni competir con varias etiquetas de igual peso.

## Layout

El sistema usa contenedores centrados con `16px` de margen lateral y secciones amplias de aproximadamente `80–96px` en el eje vertical. La composición cambia de una sola columna en móvil a divisiones asimétricas en `lg` (`1024px`), con relaciones como `0.8fr/1.2fr` y galerías de doce columnas.

La portada divide el primer viewport en dos paneles apilados en móvil y paralelos desde `md` (`768px`). Las páginas de propiedad alternan héroes de viewport completo, bloques editoriales, galerías y listas prácticas. El ritmo base sigue incrementos de `4px`, con `16px` entre elementos cercanos, `24–32px` dentro de grupos y separaciones mayores entre ideas.

## Elevation & Depth

La profundidad se construye con capas atmosféricas: fotografía, degradados negros, ruido tenue, transparencias, bordes blancos de baja opacidad y desenfoque de fondo. Las superficies permanecen planas por defecto; las sombras se reservan para navegación flotante, formularios superpuestos y estados que realmente se separan del plano.

### Shadow Vocabulary

- **Ambient Low** (`0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): navegación al desplazarse y elementos flotantes discretos.
- **Atmospheric High** (`0 25px 50px -12px rgb(0 0 0 / 0.25)`): formularios o paneles protagonistas sobre fondos oscuros.

**The Atmospheric Layers Rule.** Primero se crea profundidad con imagen, tono, borde y transparencia; una sombra sólo entra cuando existe una separación funcional entre planos.

## Shapes

Las secciones editoriales, galerías y grandes paneles usan esquinas rectas para conservar una composición fotográfica y arquitectónica. Las tarjetas pequeñas admiten radios moderados de `8–14px`. Los botones de reserva, chips de ubicación e iconos circulares usan forma pill o círculo para destacar acciones sin suavizar todo el sistema.

Los bordes son finos y translúcidos, normalmente blancos al `10–20%`. Los campos públicos son rectos y se definen mediante una línea inferior de `2px`, no mediante cajas redondeadas.

## Components

### Buttons

- **Shape:** pill completa (`9999px`) para reservas y contacto; controles utilitarios internos pueden conservar el radio base.
- **Primary:** Cloud White sobre Atitlán Night, `48px` de alto y `24px` de padding horizontal.
- **Hover / Focus:** transición breve hacia Soft Stone; foco visible de alto contraste y nunca dependiente sólo del color de propiedad.
- **Outline:** fondo transparente, borde blanco tenue y texto claro; puede invertirse a blanco en hover.

### Chips

- **Style:** pill translúcida con borde blanco al `20%`, icono pequeño y etiqueta uppercase ampliamente espaciada.
- **State:** identifica contexto como ubicación; no se utiliza como decoración repetitiva.

### Cards / Containers

- **Corner Style:** recto para imágenes y paneles editoriales; `8px` para tarjetas de experiencia.
- **Background:** Atitlán Night, Night Surface o blanco al `4–6%`.
- **Shadow Strategy:** plana por defecto; ver Elevation & Depth.
- **Border:** blanco al `10%`, con acento de propiedad únicamente en hover o estado activo.
- **Internal Padding:** `24px` como valor frecuente.

### Inputs / Fields

- **Style:** fondo transparente, línea inferior de `2px`, esquinas rectas y texto Inter de `16px`.
- **Focus:** la línea inferior gana contraste o toma el acento apropiado; el foco permanece visible.
- **Error / Disabled:** opacidad reducida sólo para disabled; error requiere texto además del cambio cromático.

### Navigation

La navegación mide `80px`, inicia transparente sobre la fotografía y se convierte en Atitlán Night translúcido con blur al desplazarse. Outfit identifica la marca; Inter sirve a enlaces y CTA. Ámbar y lima señalan la propiedad activa. En móvil, un panel oscuro de ancho completo presenta enlaces grandes, espaciados y claramente separados.

### Image Panels

Las fotografías llenan el contenedor y reciben degradados oscuros para proteger la legibilidad. El hover escala la imagen lentamente entre `1.04` y `1.09`; el contenido puede desplazarse unos píxeles, pero la imagen sigue siendo la protagonista.

## Do's and Don'ts

### Do:

- **Do** usar fotografía real de Mandalas, Hideout y Lago Atitlán como principal fuente de atmósfera.
- **Do** mantener Golden Rooftop para Mandalas y Lake Moss para Hideout.
- **Do** combinar paneles rectos con acciones pill para conservar contraste formal.
- **Do** mantener suficiente espacio alrededor de titulares uppercase con tracking amplio.
- **Do** usar movimiento lento y contenido: `300ms` para estados y `700–1500ms` para fotografía.

### Don't:

- **Don't** convertir el sitio en una estética genérica de resort tropical.
- **Don't** llenar las páginas de degradados brillantes o acentos simultáneos.
- **Don't** repetir cuadrículas de tarjetas redondeadas cuando una composición editorial o una lista abierta comunica mejor.
- **Don't** trasladar el estilo denso del panel administrativo al sitio público.
- **Don't** usar sombras fuertes en todas las superficies ni sustituir fotografías reales por ilustraciones turísticas genéricas.

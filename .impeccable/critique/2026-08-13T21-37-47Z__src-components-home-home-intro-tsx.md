---
target: src/components/home/home-intro.tsx
total_score: 35
max_score: 40
na_heuristics:
p0_count: 0
p1_count: 2
timestamp: 2026-08-13T21-37-47Z
slug: src-components-home-home-intro-tsx
---
## Design Health

| Heuristic | Score | Note |
|---|---:|---|
| Visibility of status | 3/4 | Intro and exit are clear, but hold timing is tight. |
| Match with real world | 4/4 | Two authentic properties and real photography. |
| User control | 3/4 | Escape/skip/session behavior exists; longer timing needs stronger skip affordance. |
| Consistency | 4/4 | Colors, type and imagery match Mandalas. |
| Error prevention | 4/4 | Reduced motion and responsive safeguards present. |
| Recognition | 4/4 | Both names are visible and balanced. |
| Aesthetic minimalism | 3/4 | Boutique direction works; line could feel more intentional. |
| Responsive quality | 4/4 | E2E confirms 1440, 390 and 320 without overflow. |
| Performance | 3/4 | Two priority intro images may compete with hero resources. |
| Accessibility | 3/4 | Decorative overlay is hidden from AT; underlying hero must remain the accessible source. |

Total: 35/40.

## Verdict

The animation is product-specific and visually aligned with “Two Rhythms, One Lake.” Its main weakness is choreography, not styling: the useful reading window is short and the transition feels more like a curtain removal than a deliberate relationship between the two properties.

## Priorities

1. P1 — Extend the stable reading hold so both names and descriptors can be understood on mobile; target roughly 2.7–3.2 seconds total.
2. P1 — Make the line reveal communicate the relationship between Mandalas Hostel and Mandalas Hideout, rather than appearing as an ambient divider.
3. P2 — Preserve a one-line distinction on very small screens (`In town · Social` / `Near lake · Calm`) instead of removing all context.
4. P2 — Review eager loading of both intro images before enabling the animation in production.

## Strengths

- Authentic property photography and restrained amber/lime signals.
- Clear, balanced naming of both hostels.
- Detector clean; unit and Playwright checks pass.

## Questions

- Can the visitor name both hostels and their different rhythms before the exit begins?
- Does the line explain a relationship, or only decorate the composition?
- Is the intro earning its loading cost compared with revealing the hero directly?

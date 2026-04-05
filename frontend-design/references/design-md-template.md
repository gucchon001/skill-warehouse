# Design System: [Project Name]

## 1. Visual Theme & Atmosphere

[2–3 sentences describing the mood, density, and aesthetic philosophy. Explain the "why" — what feeling should users have? What made you choose this direction over others?]

Example: "Airy and editorial, with controlled bursts of high contrast. The interface treats data as content worth reading, not just scanning — generous whitespace, a serif headline font, and ink-black on warm-white surfaces signal premium utility over consumer-app familiarity."

---

## 2. Color Palette & Roles

- [Descriptive Name] ([#XXXXXX]) — [functional role: where and when this color appears]
- [Descriptive Name] ([#XXXXXX]) — [functional role]
- [Descriptive Name] ([#XXXXXX]) — [functional role]
- [Descriptive Name] ([#XXXXXX]) — [surface / background]
- [Descriptive Name] ([#XXXXXX]) — [text primary]
- [Descriptive Name] ([#XXXXXX]) — [text secondary / muted]
- [Descriptive Name] ([#XXXXXX]) — [semantic: success]
- [Descriptive Name] ([#XXXXXX]) — [semantic: warning]
- [Descriptive Name] ([#XXXXXX]) — [semantic: error]

---

## 3. Typography

- **Display / H1**: [Font], [weight], [size at desktop], [character description]
- **H2 / Section heading**: [Font], [weight], [size]
- **H3 / Card heading**: [Font], [weight], [size]
- **Body**: [Font], [weight: 400], [size: 16px], [line-height: 1.6], [description]
- **Caption / Label**: [Font], [weight], [size: 12–14px], [letter-spacing description]
- **Code / Mono**: [Font], [size]

---

## 4. Spacing & Layout

- **Base unit**: [4px / 8px]
- **Scale in use**: [e.g. 4, 8, 12, 16, 24, 32, 48, 64, 96px]
- **Container max-width**: [e.g. 1280px]
- **Grid**: [e.g. 12-column, 24px gutters on desktop / 16px on mobile]
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px – 1024px
  - Desktop: > 1024px

---

## 5. Component Stylings

- **Buttons (primary)**: [Shape description — e.g. "Pill-shaped"], [color], [hover behavior]
- **Buttons (secondary)**: [Outline style, subtle fill, or ghost]
- **Cards / Containers**: [Corner roundness description], [background], [shadow — e.g. "Whisper-soft diffused shadow"], [border]
- **Inputs / Forms**: [Stroke style, background, focus ring description]
- **Navigation**: [Position, style, active state indicator]
- **Badges / Tags**: [Shape, color variants]
- **Modals / Overlays**: [Backdrop, animation direction]

---

## 6. Motion & Interaction

- **Default easing**: [e.g. "200ms ease-out for micro-interactions"]
- **Page load**: [e.g. "Staggered fade-up, 60ms delay per item, 300ms duration"]
- **Hover states**: [e.g. "scale(1.02) on cards, color shift on links"]
- **Transitions**: [e.g. "Color and opacity transitions only — avoid layout-triggering properties"]
- **Reduced motion**: Respect `prefers-reduced-motion` — disable transforms and delays, keep opacity fades

---

## 7. Notes & Decisions

[Optional: record any non-obvious design decisions, trade-offs, or constraints that future contributors should know about]

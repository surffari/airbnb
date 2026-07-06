---
name: 136 Marine Parade Guest Guide
description: A boutique digital welcome booklet for two Southport Gold Coast holiday apartments, in seven languages.
colors:
  ink: "#0d2230"
  ink-2: "#123246"
  teal: "#0f5c56"
  teal-deep: "#0a2f36"
  cream: "#faf6ee"
  paper: "#fffdf8"
  sand: "#f1e9d8"
  amber: "#c8793a"
  amber-deep: "#a9602a"
  line: "#e4dac2"
  text: "#23303a"
  text-muted: "#63707a"
  text-on-dark: "#eef1ee"
  text-on-dark-muted: "#9fb3ae"
typography:
  display:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4.25rem)"
    fontWeight: 500
    lineHeight: 1.05
  headline:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: "Inter, ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  s: "10px"
  m: "16px"
  l: "24px"
spacing:
  xs: "0.4rem"
  s: "0.85rem"
  m: "1.4rem"
  l: "2rem"
  xl: "5.5rem"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "#fff"
    rounded: "999px"
    padding: "0.85rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.amber-deep}"
  button-teal:
    backgroundColor: "{colors.teal}"
    textColor: "#fff"
    rounded: "999px"
    padding: "0.85rem 1.5rem"
  button-teal-hover:
    backgroundColor: "{colors.teal-deep}"
  lang-select:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.s}"
    typography: "{typography.label}"
    padding: "0.3rem 0.5rem"
---

# Design System: 136 Marine Parade Guest Guide

## 1. Overview

**Creative North Star: "The Bound Welcome Booklet"**

This is a guest guide that happens to be a website, not a website that happens to have guest info. Every surface takes its cue from a well-produced printed welcome booklet left on the kitchen counter: warm cream paper, a confident serif for headings, restrained navy ink for reading, and two accent colors (teal, amber) used sparingly to mark structure and action. It explicitly rejects the anti-references named in PRODUCT.md: generic SaaS/OTA chrome, Airbnb/Booking.com-style utilitarian listing UI, dashboard-y default form controls sitting undressed in the layout.

The guide is read on a phone, mid-holiday, often in a hurry, often in a second language. Density stays low; touch targets stay generous; nothing competes with the answer the guest came for.

**Key Characteristics:**
- Warm cream paper (`--cream`), not stark white
- One display serif (Fraunces) for identity, one workhorse sans (Inter) for everything read at length
- Two accents, teal and amber, each with a job (informational vs. action) rather than decoration
- Flat-to-lightly-lifted cards; no glassmorphism except the sticky header's deliberate paper-glass blur
- CJK/Korean/Japanese pages fall back to native system fonts rather than shipping a heavy webfont — the system bends to the reader, not the other way round

## 2. Colors

A tinted-neutral palette (cream paper, navy ink) carrying two named accents used with clear, separate jobs — never both on the same element for the same purpose.

### Primary
- **Deep Teal** (`#0f5c56`, hover `#0a2f36`): the informational/utility accent. Section eyebrows, icon badges, secondary buttons, links, the language switcher's active state. Signals "here's what you need to know."

### Secondary
- **Burnt Amber** (`#c8793a`, hover `#a9602a`): the action/attention accent. Primary CTA buttons, critical step callouts (`.step-list li.is-critical`), placeholder/redacted codes. Signals "do this" or "pay attention."

### Neutral
- **Deep Ink Navy** (`#0d2230` / `#123246`): primary text on light surfaces, headings.
- **Warm Cream** (`#faf6ee`): page background — the "paper."
- **Bright Paper** (`#fffdf8`): card and control surfaces, one shade lighter than the page background so cards lift slightly off it without a hard edge.
- **Warm Sand** (`#f1e9d8`): tinted fill for icon badges and info panels (Wi-Fi details, critical steps' surrounding rest state).
- **Hairline** (`#e4dac2`): all borders and dividers — always warm, never cool gray.
- **Slate Text-Muted** (`#63707a`): secondary/caption text, timestamps, labels.

### Named Rules
**The Two-Accent Rule.** Only teal and amber carry color meaning. Teal = information/navigation, amber = action/attention. A third accent color is never introduced without retiring one of these first.
**The Warm-Neutral Rule.** No neutral in this system is a true gray or true white. Every neutral (`cream`, `paper`, `sand`, `line`) is cream/tan-tinted to keep the "paper" metaphor intact, including in form controls.

## 3. Typography

**Display Font:** Fraunces (with ui-serif, Georgia fallback)
**Body Font:** Inter (with ui-sans-serif, -apple-system, Segoe UI, Roboto fallback)
**CJK Fallback:** PingFang SC / Hiragino Sans / Noto Sans CJK / Microsoft YaHei / Malgun Gothic / Apple SD Gothic Neo — swapped in wholesale (both display and body) on `html:lang(zh|ko|ja)`, since Fraunces/Inter carry no CJK glyphs.

**Character:** Fraunces brings warmth and editorial confidence to headings without tipping into whimsy (weight 500, never bold-italic-decorative); Inter stays completely out of the way for anything read at length or under time pressure.

### Hierarchy
- **Display** (500, `clamp(2.5rem, 6vw, 4.25rem)`, 1.05 line-height): Hero titles only ("Two stays, one address.").
- **Headline** (500, 1.75rem, 1.15): Section titles (Listing, Nearby, etc.).
- **Title** (600, 1.15rem): Card/info-block titles (`.info-card__title`).
- **Body** (400, 1rem, 1.55 line-height): All reading content, capped by the `.wrap` container (~1080px, not a strict ch-based measure, but paragraphs never run edge-to-edge).
- **Label** (600, 0.72–0.82rem, uppercase, letter-spacing 0.05–0.14em): Eyebrows, tags, form labels, the language switcher text.

### Named Rules
**The One-Serif Rule.** Fraunces appears only in `h1`/`h2`/`h3`. Never in body copy, labels, or controls — those stay in Inter (or the CJK stack) so the serif keeps its identity-marking weight.

## 4. Elevation

Mostly flat, with elevation reserved for two purposes: floating cards that need to visually detach from the paper background, and the header's sticky glass effect. There is no elaborate shadow ramp — two shadow tokens cover the whole system.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 2px rgba(13,34,48,.04), 0 12px 32px -12px rgba(13,34,48,.16)`): the resting elevation for `.info-card` and figure images. Soft and diffuse, reads as "sitting just above the paper," not "floating."
- **Lift** (`box-shadow: 0 24px 48px -16px rgba(13,34,48,.28)`): reserved for the Wi-Fi QR `<dialog>` — the one true overlay in the system. Heavier, because it needs to visually separate from the page behind its backdrop.

### Named Rules
**The Sticky-Glass Exception Rule.** `backdrop-filter: blur(10px)` on the translucent cream header is the system's one deliberate glassmorphism use, justified by the practical need to stay legible over scrolling hero imagery. It is not a pattern to repeat elsewhere.

## 5. Components

### Buttons
- **Shape:** fully pill-rounded (`border-radius: 999px`), never square or slightly-rounded.
- **Primary (amber):** white text, `0 8px 20px -8px rgba(200,121,58,.55)` glow, lifts 1px on hover.
- **Teal / Small / Outline variants:** same pill shape and hover-lift language; outline variants swap fill for a 1px border in the accent color plus a sand-tinted hover fill. No ghost-on-light variant exists — ghost is reserved for buttons on dark hero imagery (`.btn--ghost`, translucent white).

### Cards / Containers
- **Corner Style:** `--radius-m` (16px) for cards, `--radius-s` (10px) for tight inline elements (badges, small figures), `--radius-l` (24px) for hero-scale media.
- **Background:** `paper` (#fffdf8) on `cream` page background.
- **Shadow Strategy:** Card elevation (see above).
- **Border:** 1px `line` hairline, always present alongside the shadow — the shadow alone is too soft to read as a boundary on cream.
- **Internal Padding:** generous, 1.75rem/2rem for info cards; tighter (0.85–1.4rem) for accordions and modals.

### Accordion
- Paper card with hairline border, chevron rotates 135° on open (`transition: transform .25s`), icon badge in sand/teal. This is the system's primary progressive-disclosure pattern for house-rule detail.

### Modal (Wi-Fi QR)
- Native `<dialog>`, no border, `radius-m`, `shadow-lift`, dark scrim backdrop (`rgba(13,34,48,.55)`). The only modal in the system — used sparingly and only where a QR code genuinely needs full visual focus.

### Navigation / Header Controls
- **Style:** sticky, translucent cream + blur, hairline bottom border, space-between flex layout (eyebrow left, language control right).
- **Language Switcher (signature component, currently under redesign):** today it is a bare unstyled native `<select>` — default OS chrome, generic dropdown arrow — sitting inside an otherwise fully-styled header. This is a direct violation of the Two-Accent and Warm-Neutral rules (it introduces uncontrolled, non-brand visual language) and of PRODUCT.md's anti-reference against undressed browser controls. It needs the same treatment as buttons: brand color, brand type, a visible active-state confirmation, and a hover/focus language consistent with the rest of the header.

## 6. Do's and Don'ts

### Do:
- **Do** keep every neutral warm-tinted (cream/tan), never a true gray or white — including in dropdowns, inputs, and other form chrome.
- **Do** give teal the informational job and amber the action job; never mix them on the same element for the same purpose.
- **Do** use Fraunces only for headings; keep body, label, and control text in Inter (or the CJK fallback stack).
- **Do** pair every card's shadow with a 1px hairline border; the shadow alone under-defines the edge on cream.
- **Do** give small, frequently-touched controls (the language switcher, Wi-Fi reveal buttons) the same intentional styling as primary buttons — per PRODUCT.md, "every control earns its polish."

### Don't:
- **Don't** ship a bare, browser-default form control anywhere in the layout — this is the exact "generic SaaS/OTA chrome" PRODUCT.md calls out to avoid, and it is the current state of the language switcher.
- **Don't** introduce a third accent color; retire teal or amber first if a new one is truly needed.
- **Don't** add glassmorphism outside the header's sticky-glass exception.
- **Don't** use `border-left`/`border-right` colored stripes for callouts — critical steps use a full sand/amber background tint (`.step-list li.is-critical`), not a side stripe.
- **Don't** let a language switch feel inert. The guest guide's core promise is "the right info in the right language" — the control that delivers that must visibly confirm it worked.

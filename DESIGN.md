# Aigency OS — Design System

## 1. Visual Theme & Atmosphere

Aigency OS is a **space station command center that doubles as an architect's drafting board**.

The interface sits inside a deep-space observatory: a wide, dark viewport looks out onto a slow-moving cosmos, while sharp glass panels float in the foreground like drafting tools laid on a light table. The mood is **clinical, calm, and precise** — every surface feels machined, every motion is deliberate. Nothing is decorative for its own sake. The void is the canvas; the UI is the blueprint.

- **Density:** 6/10 — cockpit-dense information, but with breathing room between spatial zones.
- **Variance:** 7/10 — asymmetric layouts, offset tool palettes, and floating panes; never a rigid centered hero.
- **Motion:** 5/10 — fluid spring-physics for interactions, slow perpetual drift in the background, staggered reveals for lists.

The background is not a flat color. It is a **layered deep-space atmosphere**:

1. **Void base** — near-black `#05070a` with a subtle upward gradient to `#080b10`.
2. **Nebula dust clouds** — soft, blurred radial clouds in teal, amber, and muted purple, drifting on 46–62s loops.
3. **Star field** — hundreds of tiny twinkling stars with parallax tied to mouse movement.
4. **Shooting stars** — rare, fast streaks that arc across the viewport and fade.
5. **Floating motes** — microscopic dust particles drift slowly, tinted by the nebula colors.
6. **Vignette + grain** — a dark radial vignette pulls focus to the center; a subtle noise layer adds filmic texture.

All background layers are `pointer-events: none`. Content sits at `z-index: 10` or higher.

## 2. Color Palette & Roles

The palette is **dark-only**. There is no light mode. Surfaces read as frosted glass over the void.

| Token | Value | Role |
|-------|-------|------|
| **Void Deep** | `#05070a` | Page background, the empty space behind everything |
| **Void Base** | `#080b10` | Lower atmosphere gradient stop |
| **Surface Glass** | `#0e1117` | Cards, panels, primary drafting surfaces |
| **Elevated Glass** | `#141820` | Hover surfaces, sidebars, raised tool trays |
| **Hover State** | `#1a2233` | Active hover, selected rows, pressed states |
| **Structural Border** | `#1e2530` | Default 1px borders |
| **Border Hover** | `#252d3a` | Hovered / focused borders |
| **Primary Teal** | `#12a594` | CTAs, active states, links, success |
| **Primary Muted** | `rgba(18,165,148,0.14)` | Soft teal backgrounds, selected badges |
| **Accent Magenta** | `#D6409F` | Secondary actions, tags, alerts, human-in-the-loop signals |
| **Accent Muted** | `rgba(214,64,159,0.14)` | Soft magenta backgrounds |
| **Warm Amber** | `#e09646` | Warm human accent, warnings, collaborator cursors |
| **Amber Muted** | `rgba(224,150,70,0.14)` | Soft amber backgrounds |
| **Foreground** | `#f0f4f8` | Primary text, labels, headings |
| **Foreground Secondary** | `#9aa4b2` | Secondary text, metadata, captions |
| **Foreground Muted** | `#5b6675` | Disabled, placeholders, subtle dividers |
| **Error** | `#e5484d` | Errors, blocked states |
| **Warning** | `#f5a623` | Warnings, attention |
| **Info** | `#5eb4fb` | Informational highlights |

### Background Atmosphere Colors

| Element | Value | Role |
|---------|-------|------|
| **Teal Nebula** | `rgba(18,165,148,0.07–0.13)` | Drifting dust cloud tint |
| **Amber Nebula** | `rgba(224,150,70,0.09–0.16)` | Drifting dust cloud tint |
| **Purple Nebula** | `rgba(150,110,230,0.10)` | Distant dust cloud tint |
| **Star White** | `rgba(210,224,240,0.35–1.0)` | Star field points and glows |
| **Vignette** | `rgba(0,0,0,0.42)` | Edge focus falloff |
| **Grain** | SVG fractal noise at 3.5% opacity | Filmic texture |

## 3. Typography Rules

- **Hero / Display:** `Array`, 700, tight tracking (`-0.03em`). Used only for large architectural moments (48–80px).
- **Headings:** `Supreme`, 600–700. Sizes: 18, 24, 32, 48px.
- **Body / UI:** `Satoshi`, 400–600. Sizes: 13, 14, 16, 18px. Max line length 65ch.
- **Code / Data / Timestamps:** `Geist Mono`, 400–500. Sizes: 11, 13, 14px.

### Typographic Anti-Patterns

- **Inter is banned.**
- Generic serifs (`Times New Roman`, `Georgia`, `Garamond`) are banned.
- Display fonts are never used in buttons, labels, or dense UI.
- No all-caps eyebrow labels smaller than 11px.

## 4. Layout Principles

- **Glass-over-void:** Every panel is a frosted surface floating above the nebula. Use `backdrop-filter: blur(14px) saturate(120%)` and an inset 1px border.
- **Asymmetric zones:** The canvas/drafting area dominates the left; tool palettes and inspector panes anchor the right. Avoid centered hero compositions.
- **Grid, not flex math:** Use CSS Grid for layout regions. Avoid `calc()` percentage hacks.
- **Max-width containment:** Dashboard shells max out around 1600px; the canvas itself can expand.
- **Single-column collapse below 768px:** Multi-column tool palettes stack vertically.
- **No overlapping content:** Every element occupies its own clean spatial zone.
- **z-index scale:** base 0, background 0–3, content 10, floating controls 40, overlay 100, modal 200, toast 300, tooltip 400.

## 5. Component Stylings

### Glass Surface

```css
.glass {
  position: relative;
  background: var(--color-surface);
  backdrop-filter: blur(14px) saturate(120%);
  -webkit-backdrop-filter: blur(14px) saturate(120%);
  box-shadow: inset 0 0 0 1px var(--color-border), 0 8px 40px rgba(0,0,0,0.45);
  border-radius: 4px;
}

.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255,255,255,0.07), transparent 42%);
  pointer-events: none;
}
```

### Cards

- Background: `--color-surface`
- Border: 1px solid `--color-border`
- Radius: 4px
- Padding: 20–24px
- Hover: border shifts to `--color-border-hover`, subtle shadow lift
- **No side-stripe borders.** Use icons or dot indicators for status/priority instead.

### Buttons

- **Primary:** `--color-primary` fill, `#0a0c0f` text, radius 3px. Hover brightens; active translates down 1px.
- **Secondary:** `--color-elevated` fill, `--color-fg` text, 1px border.
- **Ghost:** transparent fill, `--color-fg-secondary` text, 1px border.
- **Danger:** `rgba(229,72,77,0.1)` fill, `--color-error` text.
- No neon outer glows, no custom cursors.

### Badges

- Neutral: `--color-hover` bg, secondary text
- Primary/Error/Warning/Info: muted token bg + solid token text
- Radius: 2px default, `9999px` for pills

### Inputs

- Label above input, helper text optional, error text below.
- Background: `--color-surface` or `--color-elevated`
- Border: 1px `--color-border`, focus ring in `--color-primary`
- No floating labels.

### Loading & Empty States

- Use skeleton loaders that match the exact layout dimensions.
- No generic circular spinners.
- Empty states should be composed: an icon, a concise message, and a clear action.

## 6. Motion & Interaction

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) for UI motion.
- **Durations:** micro 80ms, fast 150ms, normal 250ms, slow 350ms.
- **Spring physics (optional heavy motion):** `stiffness: 100, damping: 20`.
- **Background drift:** 46–62s ease-in-out alternate loops on nebula clouds.
- **Star twinkle:** `sin` based opacity oscillation per star.
- **Shooting stars:** rare fast streaks (≈800ms) with exponential ease-out, appearing every 6–20s.
- **Motes:** slow linear drift with viewport wrapping.
- **List reveals:** staggered cascade, never instant mount.
- **Performance:** animate only `transform` and `opacity`. Heavy grain/noise must be on fixed pseudo-elements only.
- **Respect `prefers-reduced-motion`:** disable drift, twinkle, and parallax for users who request it.

## 7. Background Atmosphere Specification

The atmosphere is implemented as a fixed full-screen layer stack.

```
z-index 0  .aig-atmo-void      radial gradients + base color
z-index 1  .aig-atmo-nebula    blurred drifting dust clouds (CSS animation)
z-index 2  <canvas>            star field + shooting stars + motes (RAF)
z-index 3  .aig-atmo-vignette  radial vignette
z-index 3  .aig-atmo-grain     subtle noise texture
```

All content sits at `z-index >= 10`.

### Shooting Stars

- Color: `rgba(210,224,240,0.8)` core fading to transparent.
- Length: 120–200px.
- Angle: -15° to -45° from top-right to bottom-left.
- Frequency: 0.05–0.15 per second (one every 6–20s).
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out).

### Star Field

- Density: roughly one star per 5200px².
- Size: 0.5–1.9px radius, with a soft 3.2x glow for larger stars.
- Opacity base: 0.35–1.0, twinkling via sine wave.
- Parallax: mouse position drives subtle offset; deeper stars move less.

### Motes

- Density: one mote per 15000px².
- Size: 1–3px with a 3x radial gradient glow.
- Tint: teal, amber, purple, or star white.
- Movement: slow linear drift, wrapping at viewport edges.

## 8. Anti-Patterns (Banned)

- **No light mode.** The brand is dark-only.
- **No emojis** in UI chrome.
- **No side-stripe borders** (`border-l-*`) for status or priority — use icons or dot indicators.
- **No duplicate Tailwind classes** (`bg-bg bg-bg`, `border-border border-border`, etc.).
- **No Inter font.**
- **No generic serif fonts** for UI.
- **No pure black** (`#000000`).
- **No neon/outer glow shadows** except the subtle primary glow token.
- **No oversaturated accents.** Only teal, magenta, and amber.
- **No centered hero sections** — layouts are asymmetric.
- **No generic 3-column equal card feature rows.**
- **No AI copywriting clichés** (“Elevate”, “Seamless”, “Unleash”, “Next-Gen”).
- **No filler UI text** (“Scroll to explore”, “Swipe down”, bouncing arrows).
- **No generic placeholder names** (“John Doe”, “Acme Corp”).
- **No fake round numbers** (`99.99%`, `50%`) unless real.
- **No broken image links** — use `picsum.photos`, SVG avatars, or real assets.
- **No overlapping elements** — clean spatial separation always.

## 9. Responsive Rules

- Mobile-first collapse below 768px: multi-column tool palettes and inspectors stack vertically.
- No horizontal scroll on mobile.
- Headlines scale via `clamp()`; body text never below 14px.
- Touch targets minimum 44px.
- Background atmosphere remains fixed; parallax intensity reduces on mobile.

## 10. Asset References

- **Font imports:** Fontshare Array / Supreme / Satoshi, Google Geist Mono.
- **Atmosphere script:** `public/atmosphere.js` in the Agor Canvas app implements the layered void, nebula, stars, motes, vignette, and grain.
- **Icon library:** Lucide React, stroke 1.5px, sizes 16 / 20 / 24px.

# Design System

## Color Strategy

Restrained. Dark-only. Near-black backgrounds with teal primary and magenta accent used sparingly.

### Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#05070a` | Page background (void-deep) |
| `--color-surface` | `rgba(10,14,20,0.62)` | Panels, cards (glass) |
| `--color-elevated` | `rgba(20,28,40,0.52)` | Hover surfaces, sidebar |
| `--color-hover` | `rgba(26,34,51,0.7)` | Hover states |
| `--color-border` | `rgba(255,255,255,0.10)` | Default borders |
| `--color-border-hover` | `rgba(255,255,255,0.18)` | Hover borders |
| `--color-primary` | `#12a594` | CTAs, active states, links |
| `--color-primary-muted` | `rgba(18,165,148,0.14)` | Primary backgrounds |
| `--color-accent` | `#D6409F` | Secondary actions, tags |
| `--color-accent-muted` | `rgba(214,64,159,0.14)` | Accent backgrounds |
| `--color-amber` | `#e09646` | Warm human accent |
| `--color-fg` | `#f0f4f8` | Primary text |
| `--color-fg-secondary` | `#9aa4b2` | Secondary text |
| `--color-fg-muted` | `#5b6675` | Muted text |
| `--color-error` | `#e5484d` | Errors |
| `--color-warning` | `#f5a623` | Warnings |
| `--color-success` | `#12a594` | Success (same as primary) |
| `--color-info` | `#5eb4fb` | Information |

### Glass Surfaces

```css
.glass {
  background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012));
  backdrop-filter: blur(14px) saturate(120%);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.10), 0 8px 40px rgba(0,0,0,0.45);
  border-radius: 4px;
}
```

## Typography

| Role | Family | Weight | Sizes |
|------|--------|--------|-------|
| Hero display (64px+ only) | Array | 700 | 64, 80px |
| Display / headings | Supreme | 600-700 | 18, 24, 32, 48px |
| Body / UI | Satoshi | 400-600 | 13, 14, 16, 18px |
| Code / data | Geist Mono | 400-500 | 11, 13, 14px |

- Line height: display 1.1, headings 1.25, body 1.6, UI 1.4
- Letter spacing: display -0.03em, body 0, mono 0.02em, caps 0.1em
- No display fonts in UI labels or buttons

## Spacing

Base unit: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.

## Border Radius

Near-zero. Sharp precision.

| Token | Value |
|-------|-------|
| xs | 2px |
| sm | 3px |
| md | 4px |
| lg | 4px |
| xl | 6px |
| full | 9999px |

## Shadows

Minimal. Elevation via surface color layers, not box-shadow.

| Token | Value |
|-------|-------|
| sm | `0 1px 3px rgba(0,0,0,0.4)` |
| md | `0 4px 16px rgba(0,0,0,0.5)` |
| glow-primary | `0 0 20px rgba(18,165,148,0.3)` |

## Animation

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo out)
- Duration: micro 80ms, fast 150ms, normal 250ms, slow 350ms
- No bounce. No elastic. Fades + slight translate for entrances.

## Z-Index Scale

| Token | Value |
|-------|-------|
| base | 0 |
| raised | 10 |
| overlay | 100 |
| modal | 200 |
| toast | 300 |
| tooltip | 400 |

## Iconography

Lucide Icons. Stroke-based, 1.5px weight. 16px (dense), 20px (standard), 24px (emphasized). Color inherits text color; active icons use primary teal.

## Components

### Cards
- Background: `--color-surface`
- Border: 1px solid `--color-border`
- Radius: 4px
- Padding: 20-24px
- Hover: border color shifts to `--color-border-hover`

### Buttons
- Primary: `--color-primary` bg, `#0a0c0f` text, radius 3px
- Secondary: `--color-elevated` bg, `--color-fg` text, 1px border
- Ghost: transparent bg, `--color-fg-secondary` text, 1px border
- Danger: `rgba(229,72,77,0.1)` bg, `--color-error` text

### Badges
- Neutral: `#1a2233` bg, secondary text
- Primary: `--color-primary-muted` bg, primary text
- Error/Warning/Info: respective muted bg + text
- Radius: 2px (default), 9999px (pill)

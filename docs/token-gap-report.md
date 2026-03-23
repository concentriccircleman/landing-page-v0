# Token Gap Analysis — Sentra Product vs Design System

**Product:** Sentra (Dynamis-Labs/Sentra)  
**Design system:** figma-component-viewer (Sentra Design System)  
**Date:** Phase 1 Discovery

---

## Summary

The product uses **Tailwind CSS v4** with **oklch** color variables. The design system uses **hex** semantic tokens. Migration requires mapping product tokens to design system tokens and adding any missing tokens.

---

## Product Token System (packages/ui/src/index.css)

### Colors (oklch)

| Product Variable | Light Value | Dark Value |
|------------------|-------------|------------|
| `--background` | oklch(1 0 0) | oklch(0.205 0 0) |
| `--foreground` | oklch(0.145 0 0) | oklch(0.985 0 0) |
| `--card` | oklch(1 0 0) | oklch(0.205 0 0) |
| `--primary` | oklch(0.205 0 0) | oklch(0.922 0 0) |
| `--secondary` | oklch(0.97 0 0) | oklch(0.269 0 0) |
| `--muted` | oklch(0.97 0 0) | oklch(0.269 0 0) |
| `--muted-foreground` | oklch(0.556 0 0) | oklch(0.708 0 0) |
| `--accent` | oklch(0.97 0 0) | oklch(0.3 0 0) |
| `--destructive` | oklch(0.577 0.245 27.325) | oklch(0.704 0.191 22.216) |
| `--border` | oklch(0.922 0 0) | oklch(1 0 0 / 10%) |
| `--input` | oklch(0.922 0 0) | oklch(1 0 0 / 15%) |
| `--ring` | oklch(68.5% 0.169 237.325) | same |
| `--brand` | oklch(68.5% 0.169 237.325) | same |
| `--highlight` | #B6D7FF | #355374 |

### Radii

| Product | Design System |
|---------|---------------|
| `--radius: 0.625rem` (10px) | `--radius-sm: 4px`, `--radius-md: 6px`, `--radius-lg: 8px` |
| `--radius-sm: calc(var(--radius) - 4px)` | `--radius-sm: 4px` |
| `--radius-sm: calc(var(--radius) - 2px)` | `--radius-md: 6px` |
| `--radius-lg: var(--radius)` | `--radius-lg: 8px` |
| `--radius-xl: calc(var(--radius) + 4px)` | `--radius-xl: 12px` |

---

## Mapping: Product → Design System

| Product Token | Design System Token | Notes |
|---------------|---------------------|-------|
| `--background` | `--bg-subtle` | Page background |
| `--foreground` | `--fg-base` | Primary text |
| `--card` | `--bg-base` | Card surfaces |
| `--card-foreground` | `--fg-base` | Card text |
| `--primary` | `--fg-base` (light) / `--fg-on-color` (dark) | Context-dependent |
| `--primary-foreground` | `--fg-on-color` | Text on primary |
| `--secondary` | `--bg-subtle` | Secondary surfaces |
| `--muted` | `--bg-subtle` | Muted backgrounds |
| `--muted-foreground` | `--fg-muted` | Labels, secondary text |
| `--accent` | `--bg-base-pressed` | Accent/hover |
| `--border` | `--border-subtle` | Borders |
| `--input` | `--border-base` | Input borders |
| `--ring` | `--shadow-focus-ring` | Focus ring |
| `--brand` | `--button-brand` | Brand color (product uses blue, DS uses green/blue) |
| `--destructive` | `--color-text-destructive` | Error/destructive |
| `--highlight` | **New token needed** | Product-specific highlight |

---

## New Tokens to Add

| Token | Proposed Value | Reason |
|-------|----------------|--------|
| `--highlight` | `#B6D7FF` (light), `#355374` (dark) | Product uses for selection/highlight |
| `--fg-error` | `#e11d48` | Error text (Phase 1.5) |
| `--border-error` | `#e11d48` | Error border (Phase 1.5) |
| `--bg-error-subtle` | `#fef2f2` | Error banner background (Phase 1.5) |

---

## Overrides (Design System Wins)

- **Radius:** Product uses 10px base; design system uses 4/6/8px. Design system wins.
- **Brand:** Product brand is blue (oklch 237°); design system has `--button-brand: #2563eb`. Align to design system.
- **Spacing:** Product uses Tailwind defaults; design system has `--space-*`. Use design system spacing.

---

## Styling Approach Difference

| Product | Design System |
|---------|---------------|
| Tailwind utility classes (`bg-background`, `text-foreground`) | CSS Modules + `var(--token)` |
| Radix UI primitives | Radix UI or custom |
| oklch colors | Hex semantic tokens |

**Migration strategy:** Replace Tailwind color/spacing classes with design system token references. Components will need to be rebuilt with CSS Modules and `var(--fg-base)` etc., not `className="text-foreground"`.

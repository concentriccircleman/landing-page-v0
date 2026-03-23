# Decision Log — Sentra Design System

## Format

Each entry records a non-obvious design decision made during migration. Reference by DL-XXXX number.

---

### DL-0001: Active nav item uses flat bg, not elevated card
- **Context**: SidebarNav component, active state
- **Decision**: Active state = `--bg-base-pressed` (#efeff0), flat background. No white card with shadow.
- **Alternatives considered**: White background + `--shadow-card` (felt too heavy for nav items)
- **Referenced by**: SidebarNav, SettingsSidebar

### DL-0002: Card inner padding is 12px (--space-3)
- **Context**: CheckboxLabel card variant, settings cards
- **Decision**: Card inner padding is 12px consistent across card-type components.
- **Alternatives considered**: 16px (felt too spacious for data-dense cards)
- **Referenced by**: CheckboxLabel, ProfileCard, MilestoneCard

### DL-0003: Primary UI text is 13px Inter Medium
- **Context**: Global typography rule from Figma
- **Decision**: All body text, nav items, table cells, buttons use 13px/500 Inter. Display text uses 17px Inter Display SemiBold.
- **Alternatives considered**: 14px (standard but doesn't match Figma spec)
- **Referenced by**: All components

### DL-0004: Main page card has 8px inset on 3 sides
- **Context**: AppShell layout, main content card
- **Decision**: `--space-2` (8px) margin on top, right, bottom. No left margin (flush with sidebar).
- **Alternatives considered**: 8px on all 4 sides (left gap felt unnecessary with sidebar border)
- **Referenced by**: AppShell

### DL-0005: Design system hex tokens replace product oklch tokens
- **Context**: Token gap analysis, migration strategy
- **Decision**: Design system hex tokens are canonical. Product's oklch values are replaced entirely.
- **Mapping**: `--background` → `--bg-subtle`, `--foreground` → `--fg-base`, etc. See `docs/token-gap-report.md`.
- **Referenced by**: All migrated components

### DL-0006: CSS Modules replace Tailwind utility classes
- **Context**: Styling approach migration
- **Decision**: Components use CSS Modules with `var(--token)` references. No Tailwind utilities in migrated code.
- **Alternatives considered**: Keep Tailwind with custom config mapping to DS tokens (rejected — diverges from DS conventions)
- **Referenced by**: All migrated components

### DL-0007: Radii are smaller than product defaults
- **Context**: Product uses 10px base radius, DS uses 4/6/8px
- **Decision**: DS radii win: `--radius-sm` (4px) for buttons, `--radius-md` (6px) for headers, `--radius-lg` (8px) for cards.
- **Alternatives considered**: Product's 10px (rejected — DS is the visual authority)
- **Referenced by**: All components with rounded corners

### DL-0008: Button brand color is #2563eb (blue), not product green
- **Context**: Product uses green brand (#235524), DS uses blue (#2563eb)
- **Decision**: DS brand color wins for primary buttons. Green is now a tag/status color only.
- **Alternatives considered**: Keep product green (rejected — DS visual decisions take precedence)
- **Update**: `--button-brand` was updated to #2563eb in globals.css
- **Referenced by**: Button, EmptyState, CreateEvaluationPage

### DL-0009: Transitions: 150ms for micro, 200ms for panels
- **Context**: Motion design from plan
- **Decision**: `--transition-fast` (150ms) for hover/focus/toggle. `--transition-normal` (200ms) for panels/modals.
- **Alternatives considered**: 250ms normal (felt slightly sluggish)
- **Referenced by**: All interactive components

### DL-0010: Error tokens added for form validation
- **Context**: Phase 1.5 foundation, missing error patterns
- **Decision**: Added `--fg-error`, `--border-error`, `--bg-error-subtle` with light+dark variants.
- **Values**: Light: #e11d48 / #fda4af / #fff1f2. Dark: #fb7185 / #881337 / rgba.
- **Referenced by**: Input (error variant), Alert, Form validation

### DL-0011: Status color tokens added (success, warning, info)
- **Context**: Phase 1.5 foundation, needed for badges, alerts, toasts
- **Decision**: Added `--fg-success`, `--fg-warning`, `--fg-info` + border + bg-subtle variants.
- **Referenced by**: Badge, Alert, Toast, status indicators

### DL-0012: Button sizes: sm (24px) and default (auto, 6px/10px padding)
- **Context**: Figma button spec
- **Decision**: `sm` = 24px height, 8px horizontal padding. `default` = auto height, 6px vert / 10px horiz.
- **Referenced by**: Button, all CTA placements

### DL-0013: Desktop-first responsive breakpoints
- **Context**: Plan constraints
- **Decision**: Primary: 1280px+. Secondary: 1024px. Minimum: 768px. No mobile-first approach.
- **Referenced by**: Layout components, responsive patterns

### DL-0014: Product functional behavior preserved during migration
- **Context**: Conflict resolution rule
- **Decision**: Visual decisions → DS wins. Functional decisions → product wins. Edge cases → flag for review.
- **Referenced by**: All migrated components

### DL-0015: Spacing pass — consistent vertical rhythm in playground and components
- **Context**: Migration Atoms tab had cramped, inconsistent spacing vs. the existing Design System tab
- **Decision**: Adopt the existing playground's spacing language exactly:
  - Page padding: `2rem`
  - Section margin-bottom: `3rem`
  - Section heading: 14px uppercase, 0.05em letter-spacing, `1rem` margin-bottom
  - Variant group label: 12px, `--fg-muted`, `8px` margin-bottom
  - State sub-label: 11px, `--fg-disabled`, `4px` margin-bottom
  - Item gap within a row: `8px` (tight, e.g. buttons), `1.5rem` (cards), `2rem` (variant groups)
  - Vertical field stacks: `10px` gap
  - Card header/content/footer separated by `--border-subtle` 1px lines with `--space-3` padding each zone
  - Input is `width: 100%` by default (fills container)
- **Alternatives considered**: Custom 4px grid system (rejected — existing DS playground spacing is already elegant and battle-tested)
- **Referenced by**: MigrationAtomsTab, Card, Input, all playground showcase layouts

### DL-0016: Every migration phase includes a spacing audit
- **Context**: Spacing issues discovered after initial atoms build
- **Decision**: Each phase (molecules, organisms, pages) must include a spacing pass before marking complete. Checklist: section rhythm, internal component padding, gap consistency, label vertical cadence.
- **Referenced by**: Migration plan phases 3–5

### DL-0017: Two-pass spacing system — General + Internal
- **Context**: Spacing needs to be systematic, not ad hoc. Some components had correct internal padding but wrong layout-level gaps, or vice versa.
- **Decision**: Every component goes through two spacing passes:
  - **Pass 1 (General)**: Layout context — how the component sits on a page. Validates outer margin (should be 0; parent controls), sibling gaps, width behavior (inputs = 100%), section rhythm.
  - **Pass 2 (Internal)**: Component anatomy — how elements inside breathe. Validates container padding per type table, internal gaps (icon↔text = 6px, label↔input = 4px, title↔description = 2–4px), zone separators, 4px grid compliance.
- **Alternatives considered**: Single pass (rejected — external and internal spacing are different concerns and different people might review them)
- **Referenced by**: design-system.mdc "Two-Pass Spacing System" section, migration plan

### DL-0018: 4px grid rule for all spacing
- **Context**: Need a consistent spacing grid to prevent arbitrary values
- **Decision**: All spacing values must land on the 4px grid. Exceptions: 1px (borders), 2px (tight text gaps), 6px (icon-text, skeleton row). Everything else is 0/4/8/12/16/20/24/32/40/48px.
- **Alternatives considered**: 8px grid (too restrictive for compact UI), free-form (leads to drift)
- **Referenced by**: globals.css spacing tokens, Two-Pass Spacing System

### DL-0019: Zone separation uses border dividers, not margin
- **Context**: Card header/content/footer spacing
- **Decision**: When a component has distinct visual zones, use `1px solid --border-subtle` between zones. Each zone owns its own padding. No "gap" between zones — the divider IS the separator.
- **Alternatives considered**: Margin-only separation (loses the visual line that defines zone boundaries), padding-only on parent with gap (breaks when zones have different background colors)
- **Referenced by**: Card, Dialog (footer margin exception), Drawer, Settings Card

### DL-0020: Components have zero outer margin by default
- **Context**: Reusable components should not dictate their own placement
- **Decision**: No component CSS includes margin on its root element. The parent layout (page, section, flex container) controls spacing between components using gap or its own padding.
- **Alternatives considered**: Default bottom margin (breaks composability — components become layout-aware)
- **Referenced by**: All components, Two-Pass Spacing System Pass 1

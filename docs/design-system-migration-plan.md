---
name: Design System Migration
overview: Systematically migrate an existing React+Vite product to the Sentra design system by inventorying every component, rebuilding each with design tokens, and providing a searchable review catalog with approve/deny/decision-log workflow and interactive side-by-side previews. Bottom-up build order, dark mode for all components, accessibility baked in, first 10 components before review tool.
status: ready
source: User plan + session context (docs/migration-context.md)
---

# Design System Migration — Formal Execution Plan

## Prerequisites (from context)

- **Design system:** React + Vite + TypeScript, CSS Modules — already scaffolded
- **Components built:** AppShell, SidebarNav, SettingsSidebar, ContextMenu, EvaluationsPage, InboxPage
- **Layout rule:** Every page = AppShell (SidebarNav + white card content area with 8px inset)
- **Figma:** Desktop MCP + Code Connect available
- **Product stack:** React + Vite, Python FastAPI backend (same as design system — direct port)

**Blocking:** Product codebase path or repo URL to begin Phase 1.

---

## Phase 1: Discovery and Inventory

| Step | Task | Output |
|------|------|--------|
| 1.1 | Receive and set up the existing product codebase locally | Running product |
| 1.2 | Auto-scan frontend: inventory all components, pages, routes | Structured manifest |
| 1.3 | Build dependency tree and bottom-up build order (atoms → molecules → organisms → pages) | `dependency-tree.json` |
| 1.4 | Deduplication pass: group near-identical components, keep anything with even slight differences | Tagged manifest |
| 1.5 | Token gap analysis: scan product colors, spacing, fonts against design system tokens | Gap report |
| 1.6 | Map hierarchy: Flows > Pages > Components with dual SKU codes (OLD-XXXX / NEW-XXXX) | `component-manifest.json` |

**Build order (reference):**
- **Layer 0 — Atoms:** Button, Input, Select, Badge, Avatar, Toggle/Switch, Checkbox, Tag, Icon, Tooltip
- **Layer 1 — Molecules:** FormGroup, TableRow, NavItem, ListItem, DropdownItem, SearchBar
- **Layer 2 — Organisms:** DataTable, FilterPanel, Sidebar, Modal, Card, Form, Header
- **Layer 3 — Pages:** Full page compositions

---

## Phase 1.5: Foundation Components

| Step | Task | Output |
|------|------|--------|
| 1.5.1 | Build loading/skeleton components (spinner, skeleton, shimmer) | `Skeleton`, `Spinner`, `LoadingDots` |
| 1.5.2 | Define error state tokens and patterns (`--fg-error`, `--border-error`, error input variant) | `globals.css` + Input error variant |
| 1.5.3 | Create `decision-log.md` — seed with all existing design system decisions | `docs/decision-log.md` |

**Decision log format:**
```
### DL-XXXX: [Title]
- **Context**: While building NEW-XXXX
- **Decision**: [What was decided]
- **Alternatives considered**: [What was rejected]
- **Referenced by**: NEW-XXXX, ...
```

---

## Phase 2: First 10 Components (No Review Tool)

| Step | Task | Output |
|------|------|--------|
| 2.1 | Pick 10 most-used atoms from dependency tree | Component list |
| 2.2 | Migrate each: design tokens only, light + dark mode, error/loading where applicable | 10 approved atoms |
| 2.3 | Direct review in conversation — iterate until approved | Sign-off |

**Definition of done per component:**
- Uses only design system tokens (no hardcoded values)
- Light and dark mode
- Error states (form components), loading states (data components)
- Keyboard navigable, ARIA attributes, visible focus
- **General Spacing Pass (Pass 1)**: zero outer margin, correct sibling gaps, width: 100% on inputs/selects, section rhythm verified (DL-0017, DL-0020)
- **Internal Spacing Pass (Pass 2)**: container padding matches type table, internal gaps on token scale, icon↔text = 6px, label↔input = 4px, title↔desc = 2–4px, zone separators present, 4px grid (DL-0017, DL-0018, DL-0019)
- Unique SKU (NEW-XXXX) mapped to OLD-XXXX

---

## Phase 3: Review Tool (Catalog App)

| Step | Task | Output |
|------|------|--------|
| 3.1 | Build searchable catalog: search by name, SKU, flow, page | Catalog UI |
| 3.2 | Sidebar: hierarchy browser (Flow > Page > Component), filters (All/Approved/Denied/Pending/Needs Discussion) | Sidebar |
| 3.3 | Per-component card: side-by-side (old left, new right), dark mode toggle | Preview |
| 3.4 | Actions: Approve, Deny (with notes), Add to Decision Log | Workflow |
| 3.5 | Batch approval with individual override | Batch UI |
| 3.6 | Denied queue: revision workspace, version history, "denied twice → Needs Discussion" | Revision flow |
| 3.7 | Regression alerts: "dependency changed" when child revised | Badge system |

---

## Phase 4: Full Migration — Bottom-Up

| Step | Task | Output |
|------|------|--------|
| 4.1 | Intent pass: atoms (single pass), molecules/organisms/pages (full pass + user verification if ambiguous) | Intent docs |
| 4.2 | Build each component: tokens only, dark mode, reference decision log | Migrated components |
| 4.3 | **General Spacing Pass (Pass 1)**: verify zero outer margin, sibling gaps, input width behavior, section rhythm per DL-0017/DL-0020 | Pass/fail |
| 4.4 | **Internal Spacing Pass (Pass 2)**: verify container padding, internal gaps, icon↔text (6px), label↔input (4px), title↔desc (2–4px), zone separators, 4px grid per DL-0017/DL-0018/DL-0019 | Pass/fail |
| 4.5 | Elegance pass 1: token rubric (automated check) | Pass/fail |
| 4.6 | Elegance pass 2: contextual fit (side-by-side, gold standard feel) | Pass/fail |
| 4.7 | Interaction pass: all states, transitions | Pass/fail |
| 4.8 | Accessibility pass: keyboard, ARIA, focus | Pass/fail |
| 4.9 | Present in catalog for approve/deny/add-to-decision-log | Review |

---

## Phase 5: Token Extension and Documentation

| Step | Task | Output |
|------|------|--------|
| 5.1 | Document and add any new tokens discovered during migration to `globals.css` | Updated tokens |
| 5.2 | Update `design-system.mdc` with new patterns | Updated rules |
| 5.3 | Generate component documentation (props, states, usage) | Docs |

---

## Constraints (from plan + context)

| Rule | Source |
|------|--------|
| **Visual decisions:** Design system wins | Plan |
| **Functional decisions:** Product wins | Plan |
| **Desktop-first:** 1280px+ primary, 1024px secondary, 768px minimum | Plan |
| **Motion:** `--transition-fast` (150ms), `--transition-normal` (250ms), no flashy effects | Plan |
| **Active state:** `#efeff0` flat, not white + shadow | Context |
| **Card inner padding:** 12px | Context |

---

## Inputs Required to Start

1. **Product codebase** — path or `git clone` URL
2. **PRDs** — for intent verification (optional but helpful)
3. **Run instructions** — `npm run dev` or equivalent
4. **Priority flows** — which user flows matter most
5. **Dark mode references** — as needed during build

---

## Execution Order

```
Phase 1 (Discovery)     →  Phase 1.5 (Foundation)  →  Phase 2 (First 10)
        ↓                            ↓                        ↓
  component-manifest.json    decision-log.md          10 approved atoms
  dependency-tree.json       Skeleton, Spinner                 ↓
  token-gap report           Error tokens              Phase 3 (Review Tool)
        ↓                            ↓                        ↓
  ───────────────────────────────────────────────────────────────
                              Phase 4 (Full Migration)
                                        ↓
                              Phase 5 (Token Extension)
```

---

## File Locations

| File | Purpose |
|------|---------|
| `docs/migration-context.md` | Session context, decisions, current state |
| `docs/design-system-migration-plan.md` | This plan |
| `docs/decision-log.md` | Running log of design decisions (create in 1.5.3) |
| `component-manifest.json` | SKU mapping, hierarchy (create in 1.6) |
| `src/tokens/globals.css` | Design tokens (extend in 1.5.2, 5.1) |
| `.cursor/rules/design-system.mdc` | Design system rules (update in 5.2) |

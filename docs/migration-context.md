# Design System Migration — Context Summary

> Extracted from session transcript (6e2356ad-a208-4695-a095-5a15f2384bd6). Use this file to restore context across sessions.

---

## Current State

### Tech Stack
- **Design system:** React + Vite + TypeScript, CSS Modules
- **Product (target):** React + Vite, Python FastAPI backend
- **Figma:** Desktop MCP + Code Connect enabled

### Components Already Built (Sentra Design System)
| Component | Location | Notes |
|-----------|----------|-------|
| ContextMenu | `src/components/ContextMenu/` | dark + light variants |
| SettingsSidebar | `src/components/SettingsSidebar/` | Code Connect mapped |
| SidebarNav | `src/components/SidebarNav/` | Code Connect mapped |
| EvaluationsPage | `src/components/EvaluationsPage/` | Table with badges |
| InboxPage | `src/components/InboxPage/` | Split layout, empty state |
| AppShell | `src/components/AppShell/` | Frame-within-frame layout |

### Layout Pattern (Frame-within-Frame)
- **AppShell** wraps every page: SidebarNav (220px) + content area
- Content area has **gray background** (`--bg-subtle`) with **padding** on top, right, bottom (8px)
- Page content sits in a **white card** with `--radius-lg`, `--border-subtle`
- Creates visual "frame within a frame" depth

### Design Decisions (from transcript)
- **Active state:** `#efeff0` flat background (`bg-base-pressed`), NOT white + shadow
- **Section indicators:** Tiny filled triangles (right = collapsed, down = expanded)
- **Resources items:** 16×16 colored avatar squares with 10×10 embedded icons
- **Card inner padding:** 12px (consistent with Checkbox Label pattern)
- **Workspace avatar:** 20×20 rounded square, 1px ring shadow

---

## LinkedIn Notifications Dry Run (Migration Test)

**11 components** built as migration proof-of-concept:

| SKU | Name | Layer | Depends On |
|-----|------|-------|------------|
| NEW-0001 | Avatar | atom | — |
| NEW-0002 | ActionButton | atom | — |
| NEW-0003 | TabItem | atom | — |
| NEW-0004 | OverflowButton | atom | — |
| NEW-0005 | NewNotificationsBanner | atom | — |
| NEW-0006 | NotificationItem | molecule | 0001, 0002, 0004 |
| NEW-0007 | TabBar | molecule | 0003 |
| NEW-0008 | NotificationFeed | organism | 0005, 0006, 0007 |
| NEW-0009 | ProfileSidebar | organism | 0001 |
| NEW-0010 | PromotedCard | organism | 0001 |
| NEW-0011 | NotificationsPage | page | 0008, 0009, 0010 |

**Location:** Experiments tab in playground at `http://localhost:5173/`

---

## Migration Plan Summary (from user)

- **Phases:** Discovery → Foundation → First 10 atoms → Review tool → Full migration
- **Decision log:** `decision-log.md` — every non-obvious design decision
- **SKU codes:** OLD-XXXX / NEW-XXXX in `component-manifest.json`
- **Review tool:** Search, approve/deny, side-by-side preview, batch approval
- **Denied twice** → "Needs Discussion"
- **Regression:** When child changes, approved parents get "dependency changed" badge

---

## What I Need From You to Start Full Migration

1. **Product codebase path** (React + Vite frontend)
2. **PRDs** (for intent verification)
3. **How to run the product** locally
4. **Priority flows** (which user flows matter most)
5. **Dark mode references** (as needed)

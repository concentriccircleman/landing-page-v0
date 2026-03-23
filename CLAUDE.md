# Sentra Design System — Claude Code Guide

## Dev Server

- Start: `bash scripts/dev.sh` (or `npm run dev` if node is in PATH)
- Port: `5173`
- URL: `http://localhost:5173/`
- Framework: Vite + React + TypeScript

## Routes

All app routes are defined in a single file:

```
src/product/routes.ts
```

It exports `routes: AppRoute[]` where each entry has `{ path, name, auth, flow }`.

## Demo Mode

Set `?demo=true` query parameter to enable demo mode. When active:

- Auth-gated pages render with mock data instead of redirecting to login
- All pages are pre-populated with realistic sample data
- No backend connection is required

The `DemoProvider` at `src/product/DemoProvider.tsx` wraps the app and provides:

- `useDemo()` hook returning `{ isDemo: boolean, mockUser, mockData }`
- Mock user: `{ name: "Shaurya", email: "shaurya@sentra.ai", avatar: "SH" }`
- Mock data for meetings, reports, memory, todos, etc.

## Component Library

- All 70 design system components live in `src/components/`
- Component manifest: `component-manifest.json`
- Design tokens: `src/tokens/globals.css`
- Each component uses CSS Modules (`.module.css`)

## Dev Server — Actual Port

The dev server runs on **port 5177** (not 5173 — 5173 is the default but this project starts on 5177).
Always verify with: `lsof -i :5177`

## Figma Capture — Project Sage

**Target file:** `jqbwmzpJiaOxeLYukWvLpn` (Sentra-Recorder--Sage)
**Script:** `scripts/sage-to-figma.mjs`
**Auth:** Figma personal access token in `.env` as `FIGMA_TOKEN`

### How to run

```bash
node scripts/sage-to-figma.mjs
```

The script:
1. Validates the token against Figma API
2. Runs a single test capture first — stops if it fails
3. Only proceeds to all 17 states after the test passes
4. Uses Playwright to screenshot each state, uploads via Figma REST API
5. No MCP quota used at all

### NEVER do these things

- **Never use `generate_figma_design` in a loop** — each call costs MCP quota. If you need to use it at all, call it ONCE, confirm it works, then proceed.
- **Never poll in a loop** — polling `generate_figma_design` with captureId costs the same quota as generating. Check status once after 30s, not 15 times every 5s.
- **Never run a batch of 17 API calls without testing 1 first** — always smoke test a single item end-to-end before scaling.
- **Never retry a failing approach more than once without diagnosing the root cause first.**

### URL params for state selection

The playground supports direct state loading via URL params:
- Tab: `?tab=project-sage`
- State: `&sage-state=<state-id>`

Example: `http://localhost:5177/?tab=project-sage&sage-state=enhanced-notes`

Valid sage states:
- Pre-Meeting: `desktop-idle`, `pre-meeting-notif`, `pre-meeting-brief`, `notification`
- Meeting: `meeting-active`, `pill-collapsed`, `pill-expanded`
- Notes Panel: `empty-editor`, `generate-prompt`, `enhancing`, `enhanced-notes`, `private-notes`
- Overlays: `templates`, `share`, `source-popover`, `transcript`, `chat`

### Figma Capture — General product routes

For non-Sage product routes:
1. Start dev server on port 5177
2. Append `?demo=true` to any route that requires auth
3. Each route in `src/product/routes.ts` maps to one Figma page
4. Light mode default; add `?theme=dark` for dark mode

## Project Structure

```
src/
  components/     # 70 design system components
  tokens/         # CSS custom properties (globals.css)
  playground/     # Dev playground with tabs:
                  #   - Design System (existing)
                  #   - Migration (atoms showcase)
                  #   - Review (component approval tool)
                  #   - Experiments
  product/        # Product assembly
    routes.ts     # All app routes
    DemoProvider.tsx  # Mock data provider
```

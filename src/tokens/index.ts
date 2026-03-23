/**
 * Design Tokens — Sentra Design System
 * Built and designed by Shaurya Narang
 *
 * JS-accessible tokens for use in component logic, inline styles,
 * or CSS-in-JS. The canonical values live in globals.css as CSS custom
 * properties; these mirror them for programmatic access.
 */

export const colors = {
  white: "#ffffff",
  gray50: "#fafafa",
  gray100: "#f4f4f5",
  gray200: "#e4e4e7",
  gray300: "#d4d4d8",
  gray400: "#a1a1aa",
  gray500: "#71717a",
  gray600: "#52525b",
  gray700: "#3f3f46",
  gray800: "#27272a",
  gray900: "#18181b",
  gray950: "#09090b",
  destructive: "#e11d48",
  destructiveLight: "#fb7185",
} as const;

/** Figma semantic foreground tokens (foregrounds/*) */
export const fg = {
  base: "#18181b",
  subtle: "#52525b",
  muted: "#71717a",
  disabled: "#a1a1aa",
  onColor: "#ffffff",
} as const;

/** Figma semantic background tokens (backgrounds/*) */
export const bg = {
  base: "#ffffff",
  subtle: "#fafafa",
  baseHover: "#fafafa",
  basePressed: "#efeff0",
} as const;

/** Figma semantic border tokens (borders/*) */
export const border = {
  subtle: "#efeff0",
  base: "#e4e4e7",
} as const;

/** Figma brand tokens */
export const brand = {
  buttonBrand: "#2563eb",
  buttonNeutral: "#ffffff",
  brand800: "#1e40af",
} as const;

/** Figma tag color tokens */
export const tag = {
  greenBg: "#ebfaf4",
  purpleBg: "#ede9fe",
  purpleText: "#5b21b6",
  blueBg: "#dbeafe",
  orangeBg: "#fff7ed",
} as const;

export const spacing = {
  0: "0",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
} as const;

export const radii = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  full: "9999px",
} as const;

/** Dark theme overrides — mirrors [data-theme="dark"] in globals.css */
export const darkTheme = {
  fg: { base: "#fafafa", subtle: "#a1a1aa", muted: "#71717a", disabled: "#52525b", onColor: "#ffffff" },
  bg: { base: "#18181b", subtle: "#09090b", baseHover: "#27272a", basePressed: "#3f3f46" },
  border: { subtle: "#27272a", base: "#3f3f46" },
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;

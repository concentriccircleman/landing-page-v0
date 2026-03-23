/**
 * Design Tokens — Solidroad Design System
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

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
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

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;

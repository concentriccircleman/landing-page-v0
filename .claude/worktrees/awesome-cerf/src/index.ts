/**
 * Solidroad Design System
 *
 * Every export maps 1:1 to a component in the Figma design system.
 * Code Connect links each component back to its Figma node so the
 * Dev Panel shows real code when a designer selects a component.
 */

/* ── Tokens ── */
export { colors, spacing, radii } from "./tokens";
export type { ColorToken, SpacingToken, RadiusToken } from "./tokens";

/* ── Components ── */
export { ContextMenu } from "./components/ContextMenu";
export type {
  ContextMenuProps,
  ContextMenuEntry,
  ContextMenuItemDef,
  ContextMenuSeparatorDef,
  IconName,
} from "./components/ContextMenu";

// Future components — uncomment as they are built:
// export { SidebarNav } from "./components/SidebarNav";
// export { SettingsSidebar } from "./components/SettingsSidebar";
// export { InboxView } from "./components/InboxView";

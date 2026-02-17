import { ContextMenu } from "../components/ContextMenu";

export function Playground() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>Solidroad Design System</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
        Component playground — preview every component from the design system here.
      </p>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
          Context Menu
        </h2>
        <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
          <div style={{ background: "var(--color-surface-dark)", padding: "1.5rem", borderRadius: 8 }}>
            <ContextMenu
              variant="dark"
              items={[
                { label: "Edit", icon: "edit" },
                { label: "Duplicate", icon: "copy" },
                { type: "separator" },
                { label: "Delete", icon: "trash", destructive: true },
              ]}
            />
          </div>
          <div style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: 8, border: "1px solid var(--color-border)" }}>
            <ContextMenu
              variant="light"
              items={[
                { label: "Edit", icon: "edit" },
                { label: "Duplicate", icon: "copy" },
                { type: "separator" },
                { label: "Delete", icon: "trash", destructive: true },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

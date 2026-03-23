import { createContext, useContext, useState, type ReactNode } from "react";
import styles from "./Tabs.module.css";

interface TabsContextValue {
  value: string;
  onValueChange: (v: string) => void;
  variant: "default" | "pills" | "underline";
}

const TabsContext = createContext<TabsContextValue>({ value: "", onValueChange: () => {}, variant: "default" });

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "default" | "pills" | "underline";
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, defaultValue = "", onValueChange, variant = "default", children, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const handleChange = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };
  return (
    <TabsContext.Provider value={{ value: current, onValueChange: handleChange, variant }}>
      <div className={`${styles.tabs} ${className ?? ""}`}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  const { variant } = useContext(TabsContext);
  const variantClass = variant === "pills" ? styles.listPills : variant === "underline" ? styles.listUnderline : styles.listDefault;
  return <div className={`${styles.list} ${variantClass} ${className ?? ""}`} role="tablist">{children}</div>;
}

export interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, disabled, children, className }: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;
  const variantClass = ctx.variant === "pills" ? styles.triggerPills : ctx.variant === "underline" ? styles.triggerUnderline : styles.triggerDefault;
  const cls = [styles.trigger, variantClass, isActive ? styles.triggerActive : "", disabled ? styles.triggerDisabled : "", className].filter(Boolean).join(" ");
  return (
    <button type="button" role="tab" aria-selected={isActive} disabled={disabled} className={cls} onClick={() => ctx.onValueChange(value)}>
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div role="tabpanel" className={`${styles.content} ${className ?? ""}`}>{children}</div>;
}

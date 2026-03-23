import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "sentra-experiments";

export interface ExperimentFlag {
  key: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

export const EXPERIMENT_FLAGS: ExperimentFlag[] = [
  {
    key: "deepResearchHandoff",
    label: "Deep Research handoff",
    description: "When Memory search finds no results, offer to search with Deep Research instead.",
    defaultValue: false,
  },
];

type FlagMap = Record<string, boolean>;

interface ExperimentsContextValue {
  flags: FlagMap;
  setFlag: (key: string, value: boolean) => void;
}

const ExperimentsContext = createContext<ExperimentsContextValue | null>(null);

function loadFlags(): FlagMap {
  const defaults: FlagMap = {};
  for (const f of EXPERIMENT_FLAGS) defaults[f.key] = f.defaultValue;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaults;
}

function persistFlags(flags: FlagMap) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(flags)); } catch { /* ignore */ }
}

export function ExperimentsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FlagMap>(loadFlags);

  const setFlag = useCallback((key: string, value: boolean) => {
    setFlags((prev) => {
      const next = { ...prev, [key]: value };
      persistFlags(next);
      return next;
    });
  }, []);

  return (
    <ExperimentsContext.Provider value={{ flags, setFlag }}>
      {children}
    </ExperimentsContext.Provider>
  );
}

export function useExperiments(): ExperimentsContextValue {
  const ctx = useContext(ExperimentsContext);
  if (!ctx) throw new Error("useExperiments must be used within an ExperimentsProvider");
  return ctx;
}

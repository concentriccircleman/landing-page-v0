import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

export type FontFamily = "geist" | "inter";

export type ColorAccent = "blue" | "sage";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  grayscale: boolean;
  setGrayscale: (on: boolean) => void;
  fontFamily: FontFamily;
  setFontFamily: (f: FontFamily) => void;
  accent: ColorAccent;
  setAccent: (a: ColorAccent) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

function getStoredTheme(
  storageKey: string
): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

function getStoredGrayscale(storageKey: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "false") return false;
    return true;
  } catch {
    return true;
  }
}

function getStoredFont(storageKey: string): FontFamily {
  if (typeof window === "undefined") return "geist";
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "inter") return "inter";
    return "geist";
  } catch {
    return "geist";
  }
}

function getStoredAccent(storageKey: string): ColorAccent {
  if (typeof window === "undefined") return "blue";
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "sage") return "sage";
    return "blue";
  } catch {
    return "blue";
  }
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

export interface ThemeProviderProps {
  defaultTheme?: Theme;
  storageKey?: string;
  grayscaleStorageKey?: string;
  fontStorageKey?: string;
  accentStorageKey?: string;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  defaultTheme = "system",
  storageKey = "sentra-theme",
  grayscaleStorageKey = "sentra-grayscale",
  fontStorageKey = "sentra-font",
  accentStorageKey = "sentra-accent",
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = getStoredTheme(storageKey);
    return stored ?? defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme)
  );

  const [grayscale, setGrayscaleState] = useState<boolean>(() =>
    getStoredGrayscale(grayscaleStorageKey)
  );

  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() =>
    getStoredFont(fontStorageKey)
  );

  const [accent, setAccentState] = useState<ColorAccent>(() =>
    getStoredAccent(accentStorageKey)
  );

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // ignore
      }
    },
    [storageKey]
  );

  const setGrayscale = useCallback(
    (on: boolean) => {
      setGrayscaleState(on);
      try {
        localStorage.setItem(grayscaleStorageKey, String(on));
      } catch {
        // ignore
      }
    },
    [grayscaleStorageKey]
  );

  const setFontFamily = useCallback(
    (f: FontFamily) => {
      setFontFamilyState(f);
      try {
        localStorage.setItem(fontStorageKey, f);
      } catch {
        // ignore
      }
    },
    [fontStorageKey]
  );

  const setAccent = useCallback(
    (a: ColorAccent) => {
      setAccentState(a);
      try {
        localStorage.setItem(accentStorageKey, a);
      } catch {
        // ignore
      }
    },
    [accentStorageKey]
  );

  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, [theme]);

  useEffect(() => {
    if (grayscale) {
      document.documentElement.setAttribute("data-grayscale", "");
    } else {
      document.documentElement.removeAttribute("data-grayscale");
    }
  }, [grayscale]);

  useEffect(() => {
    if (fontFamily === "inter") {
      document.documentElement.setAttribute("data-font", "inter");
    } else {
      document.documentElement.removeAttribute("data-font");
    }
  }, [fontFamily]);

  useEffect(() => {
    if (accent === "sage") {
      document.documentElement.setAttribute("data-accent", "sage");
    } else {
      document.documentElement.removeAttribute("data-accent");
    }
  }, [accent]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      document.documentElement.setAttribute("data-theme", resolved);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      grayscale,
      setGrayscale,
      fontFamily,
      setFontFamily,
      accent,
      setAccent,
    }),
    [theme, setTheme, resolvedTheme, grayscale, setGrayscale, fontFamily, setFontFamily, accent, setAccent]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

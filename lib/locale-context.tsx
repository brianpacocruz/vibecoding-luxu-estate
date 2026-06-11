"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Locale,
  type Translations,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getTranslations,
  isValidLocale,
} from "@/lib/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LocaleContext = createContext<LocaleContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface LocaleProviderProps {
  children: ReactNode;
  /** Initial locale resolved on the server from the cookie */
  initialLocale: Locale;
  /** Pre-loaded translations for the initial locale (avoids a client-side fetch on first render) */
  initialTranslations: Translations;
}

export function LocaleProvider({
  children,
  initialLocale,
  initialTranslations,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [t, setT] = useState<Translations>(initialTranslations);
  const [isLoading, setIsLoading] = useState(false);

  const setLocale = useCallback(async (newLocale: Locale) => {
    if (newLocale === locale) return;

    setIsLoading(true);
    try {
      const translations = await getTranslations(newLocale);
      setT(translations);
      setLocaleState(newLocale);

      // Persist in cookie (1 year)
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=${maxAge}; SameSite=Lax`;

      // Update the <html lang> attribute
      document.documentElement.lang = newLocale;
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  // Sync html lang on mount with server-resolved locale
  useEffect(() => {
    document.documentElement.lang = locale;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a <LocaleProvider>");
  }
  return ctx;
}

// Re-export for convenience
export type { Locale, Translations };
export { isValidLocale };

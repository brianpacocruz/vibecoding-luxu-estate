import type en from "@/locales/en.json";

export type Locale = "en" | "es" | "fr";

export type Translations = typeof en;

export const LOCALES: Locale[] = ["en", "es", "fr"];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
};

export const LOCALE_COOKIE = "luxe-locale";

const translationsCache: Partial<Record<Locale, Translations>> = {};

export async function getTranslations(locale: Locale): Promise<Translations> {
  if (translationsCache[locale]) {
    return translationsCache[locale]!;
  }

  let translations: Translations;

  switch (locale) {
    case "es":
      translations = (await import("@/locales/es.json")).default as Translations;
      break;
    case "fr":
      translations = (await import("@/locales/fr.json")).default as Translations;
      break;
    default:
      translations = (await import("@/locales/en.json")).default as Translations;
  }

  translationsCache[locale] = translations;
  return translations;
}

export function getTranslationsSync(locale: Locale): Translations {
  // For client-side usage — requires translations to be pre-loaded
  // Falls back to empty object (should not happen in normal usage)
  return translationsCache[locale] ?? ({} as Translations);
}

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import React from "react";
import en, { type TranslationKeys } from "./en";
import so from "./so";

export type Locale = "en" | "so";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  so: "Soomaali",
};

const translations: Record<Locale, TranslationKeys> = { en, so };

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

export type TKey = NestedKeyOf<TranslationKeys>;

function getNestedValue(obj: unknown, path: string): string {
  const val = path
    .split(".")
    .reduce(
      (acc, key) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
      obj
    );
  return typeof val === "string" ? val : "";
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

const STORAGE_KEY = "unfpa-dmp-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && translations[stored]) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const val = getNestedValue(translations[locale], key);
      if (val) return val;
      // Fallback to English if the Somali value is empty
      return getNestedValue(translations.en, key) || key;
    },
    [locale]
  );

  return React.createElement(
    I18nContext.Provider,
    { value: { locale, setLocale, t } },
    children
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

export { type TranslationKeys };

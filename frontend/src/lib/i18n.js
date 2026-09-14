import { siteConfig } from "@/data/siteConfig";

const STORAGE_KEY = "beni-lang";

// Note: localStorage is used here only for non-sensitive language preference storage.
// This is acceptable as it only stores a simple language code (fr/en).

export function getDefaultLanguage() {
  return siteConfig?.i18n?.defaultLanguage || "fr";
}

export function getSupportedLanguages() {
  return siteConfig?.i18n?.languages || [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
  ];
}

export function normalizeLanguage(lang) {
  const supported = getSupportedLanguages().map((l) => l.code);
  if (supported.includes(lang)) return lang;
  return getDefaultLanguage();
}

export function getInitialLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return normalizeLanguage(stored);
  } catch (error) {
    // localStorage may be unavailable (private browsing, SSR, etc.)
    console.warn("Could not access localStorage for language preference:", error.message);
  }

  const nav = (navigator.language || "").slice(0, 2).toLowerCase();
  return normalizeLanguage(nav);
}

export function setStoredLanguage(lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    // localStorage may be unavailable (private browsing, SSR, etc.)
    console.warn("Could not save language preference to localStorage:", error.message);
  }
}

export function t(lang, path, fallback = "") {
  const dict = siteConfig?.dictionary?.[lang] || {};
  const parts = String(path).split(".");
  let cur = dict;
  for (const p of parts) {
    cur = cur?.[p];
    if (cur === undefined || cur === null) return fallback;
  }
  return typeof cur === "string" ? cur : fallback;
}

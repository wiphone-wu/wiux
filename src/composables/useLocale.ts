import { ref } from "vue";
import { createI18n, useI18n, type I18n } from "vue-i18n";
import zh from "../locales/zh";
import en from "../locales/en";

export type Locale = "zh" | "en";

export interface LocaleMessages {
  [key: string]: string;
}

export interface LocaleContext {
  locale: Locale;
  messages: Record<string, LocaleMessages>;
}

let globalI18n: I18n | null = null;

export function createLocale(
  defaultLocale: Locale = "zh",
  extraMessages?: Record<string, LocaleMessages>,
) {
  const messages: Record<string, LocaleMessages> = {
    zh: { ...zh },
    en: { ...en },
  };

  if (extraMessages) {
    for (const locale of Object.keys(extraMessages)) {
      if (messages[locale]) {
        messages[locale] = { ...messages[locale], ...extraMessages[locale] };
      }
    }
  }

  const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    messages,
    warnHtmlMessage: false,
  });

  globalI18n = i18n;
  return i18n;
}

export function useLocale() {
  let i18nT: (key: string) => string;
  let locale: { value: string };

  try {
    const i18n = useI18n({ useScope: "global" });
    i18nT = i18n.t;
    locale = i18n.locale as unknown as { value: string };
  } catch {
    if (globalI18n) {
      i18nT = (key: string) =>
        (globalI18n!.global.t as (key: string) => string)(key);
      locale = globalI18n.global.locale as unknown as { value: string };
    } else {
      i18nT = (key: string) => key;
      locale = ref("zh");
    }
  }

  const t = (key: string, fallback?: string): string => {
    const result = i18nT(key);
    if (result && result !== key) {
      return result;
    }
    return fallback || key;
  };

  return {
    locale,
    t,
  };
}
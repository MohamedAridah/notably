import { defineRouting } from "next-intl/routing";
import { defaultLocale, Locale, locales, rtlLocales } from "@/i18n/config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "never",
});

export const isLocaleRtl = (locale: string) => {
  return rtlLocales.includes(locale as Locale);
};

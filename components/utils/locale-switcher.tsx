import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "@/components/utils/locale-switcher-select";
import { isLocaleRtl } from "@/i18n/routing";
import { locales } from "@/i18n/config";

export default function LocaleSwitcher({ withLabel }: { withLabel?: boolean }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const isRtl = isLocaleRtl(locale);

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={locales.map((locale) => ({ value: locale, label: t(locale) }))}
      label={t("label")}
      dir={isRtl ? "rtl" : "ltr"}
      withLabel={withLabel}
    />
  );
}

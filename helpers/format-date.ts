interface FormatDateParams {
  date: Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  dateOnly?: boolean;
}

const DEFAULT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

export const formatDate = ({
  date,
  locale = "en-US",
  options,
  dateOnly = false,
}: FormatDateParams) => {
  if (dateOnly) {
    DEFAULT_DATE_FORMAT_OPTIONS.hour = undefined;
    DEFAULT_DATE_FORMAT_OPTIONS.minute = undefined;
    DEFAULT_DATE_FORMAT_OPTIONS.second = undefined;
    DEFAULT_DATE_FORMAT_OPTIONS.hour12 = undefined;
  }

  const formatted = new Intl.DateTimeFormat(locale, {
    ...DEFAULT_DATE_FORMAT_OPTIONS,
    ...options,
    numberingSystem: "latn",
  }).format(new Date(date));

  if (dateOnly) return formatted.replace(/,/g, "");
  return formatted;
};

import { IResult } from "ua-parser-js";

export const getBrowserInfo = (userAgent: IResult | null) => {
  if (userAgent === null) return "Unknown Device";
  if (userAgent.browser.name === null && userAgent.os.name === null) {
    return "Unknown Device";
  }
  if (userAgent.browser.name === null) return userAgent.os.name;
  if (userAgent.os.name === null) return userAgent.browser.name;

  return `${userAgent.browser.name}, ${userAgent.os.name}`;
};

const DEFAULT_DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

interface FormatDateParams {
  date: Date;
  local?: string;
  options?: Intl.DateTimeFormatOptions;
}

export const formatDate = ({
  date,
  local = "en-US",
  options,
}: FormatDateParams) => {
  return new Intl.DateTimeFormat(local, {
    ...DEFAULT_DATE_FORMAT_OPTIONS,
    ...options,
  }).format(new Date(date));
};

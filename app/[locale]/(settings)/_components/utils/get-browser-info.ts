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



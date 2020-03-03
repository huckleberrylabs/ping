import * as iots from "io-ts";

/* 
  Older Browsers
  window.navigator.userLanguage
  window.navigator.browserLanguage
  window.navigator.systemLanguage
*/

export const Codec = iots.type({
  locale: iots.string,
  language: iots.string,
  languages: iots.readonlyArray(iots.string),
  timezone: iots.string,
  calendar: iots.string,
  numberingSystem: iots.string,
});
export type T = iots.TypeOf<typeof Codec>;

export const Detect = (): T => {
  const intl = Intl.DateTimeFormat().resolvedOptions();
  return {
    locale: intl.locale,
    language: window.navigator.language,
    languages: window.navigator.languages,
    timezone: intl.timeZone,
    calendar: intl.calendar,
    numberingSystem: intl.numberingSystem,
  };
};

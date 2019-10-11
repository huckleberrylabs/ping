import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";

/* 
  Older Browsers
  window.navigator.userLanguage
  window.navigator.browserLanguage
  window.navigator.systemLanguage
*/

export const GeoCodec = iots.type({
  locale: iots.string,
  language: iots.string,
  languages: iots.readonlyArray(iots.string),
  timezone: iots.string,
  calendar: iots.string,
  numberingSystem: iots.string,
});
export type Geo = iots.TypeOf<typeof GeoCodec>;

export const Geo = (): Geo =>
  pipe(
    Intl.DateTimeFormat().resolvedOptions(),
    intl => ({
      locale: intl.locale,
      language: window.navigator.language,
      languages: window.navigator.languages,
      timezone: intl.timeZone,
      calendar: intl.calendar,
      numberingSystem: intl.numberingSystem,
    })
  );

import * as iots from "io-ts";
import * as Color from "./color";
import * as Country from "./country";
import * as EmailAddress from "./email-address";
import * as KebabCaseString from "./kebab-case-string";
import * as NameSpaceCaseString from "./namespace-case-string";
import * as NonEmptyString from "./non-empty-string";
import * as OptionFromNullable from "./option-from-nullable";
import * as PersonName from "./person-name";
import * as Phone from "./phone";
import * as StatusCode from "./status-code";
import * as TimeStamp from "./timestamp";
import * as Type from "./type";
import * as Url from "./url";
import * as UUID from "./uuid";

export type Names =
  | typeof Color.Name
  | typeof Country.Name
  | typeof EmailAddress.Name
  | typeof KebabCaseString.Name
  | typeof NameSpaceCaseString.Name
  | typeof NonEmptyString.Name
  | typeof PersonName.Name
  | typeof Phone.Name
  | typeof StatusCode.Name
  | typeof TimeStamp.Name
  | typeof Type.Name
  | typeof Url.Name
  | typeof UUID.Name;

export const Codecs = new Map<Names, iots.Mixed>([
  [Color.Name, Color.Codec],
  [Country.Name, Country.Codec],
  [EmailAddress.Name, EmailAddress.Codec],
  [KebabCaseString.Name, KebabCaseString.Codec],
  [NameSpaceCaseString.Name, NameSpaceCaseString.Codec],
  [NonEmptyString.Name, NonEmptyString.Codec],
  [PersonName.Name, PersonName.Codec],
  [Phone.Name, Phone.Codec],
  [StatusCode.Name, StatusCode.Codec],
  [TimeStamp.Name, TimeStamp.Codec],
  [Type.Name, Type.Codec],
  [Url.Name, Url.Codec],
  [UUID.Name, UUID.Codec],
]);

export {
  Color,
  Country,
  EmailAddress,
  KebabCaseString,
  NameSpaceCaseString,
  NonEmptyString,
  OptionFromNullable,
  PersonName,
  Phone,
  StatusCode,
  TimeStamp,
  Type,
  Url,
  UUID,
};

import * as iots from "io-ts";
import { Either, fold, left, right } from "fp-ts/lib/Either";
import { Url, NameSpaceCaseString, UUID, Errors } from "../../../values";
import { Color, ButtonText, Animation, Icon, Offset } from "../../values";
import { DecodeErrorFormatter } from "../../../logging";

export const Name = "widget:model:settings" as NameSpaceCaseString.T;
export const Codec = iots.type(
  {
    type: iots.literal(Name),
    id: UUID.Codec,
    account: UUID.Codec,
    homePage: Url.Codec,
    color: Color.Codec,
    icon: Icon.Codec,
    animation: Animation.Codec,
    buttonText: ButtonText.Codec,
    yOffset: Offset.Codec,
    xOffset: Offset.Codec,
    enabled: iots.boolean,
    liveChat: iots.boolean,
    branding: iots.boolean,
  },
  Name
);
export const Decode = (value: unknown) =>
  fold<iots.Errors, T, Either<Errors.Validation.T, T>>(
    errors =>
      left(
        Errors.Validation.C(Name, `Decode: ${DecodeErrorFormatter(errors)}`)
      ),
    decoded => right(decoded)
  )(Codec.decode(value));
export const Encode = Codec.encode;
export const Is = Codec.is;
export type T = iots.TypeOf<typeof Codec>;
export const C = (
  account: UUID.T,
  homePage: Url.T,
  color: Color.T = Color.DEFAULT,
  icon: Icon.T = Icon.DEFAULT
): T => ({
  type: Name,
  id: UUID.C(),
  account,
  homePage,
  color,
  icon,
  animation: Animation.C(),
  buttonText: ButtonText.C(),
  xOffset: Offset.C(),
  yOffset: Offset.C(),
  enabled: true,
  liveChat: true,
  branding: true,
});

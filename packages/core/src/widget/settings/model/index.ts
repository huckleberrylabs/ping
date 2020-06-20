import * as iots from "io-ts";
import { Url, Country, NameSpaceCaseString, UUID } from "../../../values";
import { Color, ButtonText, Animation, Icon, Offset } from "../../values";

export const Name = "widget:model:settings" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    id: UUID.Codec,
    account: UUID.Codec,
    homePage: Url.Codec,
    color: Color.Codec,
    country: Country.Codec,
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

export type T = iots.TypeOf<typeof Codec>;

export const C = (
  account: UUID.T,
  homePage: Url.T,
  country: Country.T,
  color: Color.T,
  icon: Icon.T
): T => ({
  type: Name,
  id: UUID.C(),
  account,
  homePage,
  country,
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

export const Is = Codec.is;

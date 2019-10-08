import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import { map, Either } from "fp-ts/lib/Either";
import { UUID, Phone, PhoneCodec } from "@huckleberryai/core";
import { WidgetEvent, WidgetEventCodec } from "../../../base/event";

export const WidgetAddPhoneToMessageCommandType =
  "widget:command:add-phone-to-message";

export const WidgetAddPhoneToMessageCommandCodec = iots.intersection(
  [
    WidgetEventCodec,
    iots.type({
      phone: PhoneCodec,
    }),
  ],
  WidgetAddPhoneToMessageCommandType
);

export type WidgetAddPhoneToMessageCommand = iots.TypeOf<
  typeof WidgetAddPhoneToMessageCommandCodec
>;

export const WidgetAddPhoneToMessageCommand = (
  phone: Phone,
  widget: UUID,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): Either<Error, WidgetAddPhoneToMessageCommand> =>
  pipe(
    WidgetEvent(WidgetAddPhoneToMessageCommandType)(
      widget,
      origin,
      corr,
      parent,
      agent
    ),
    map(event => ({ ...event, name }))
  );

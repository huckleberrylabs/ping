import { pipe } from "fp-ts/lib/pipeable";

import * as iots from "io-ts";
import { Type, UUID, Phone, PhoneCodec } from "@huckleberryai/core";
import { MessageEvent, MessageEventCodec } from "../base";

export const CommandType = "widget:command:add-phone-to-message" as Type;

export const CommandCodec = iots.intersection(
  [
    MessageEventCodec,
    iots.type({
      phone: PhoneCodec,
    }),
  ],
  CommandType
);

export type Command = iots.TypeOf<typeof CommandCodec>;

export const Command = (
  phone: Phone,
  message: UUID,
  widget: UUID,
  corr?: UUID,
  parent?: UUID
): Command =>
  pipe(
    MessageEvent(CommandType)(message, widget, corr, parent),
    event => ({ ...event, phone })
  );

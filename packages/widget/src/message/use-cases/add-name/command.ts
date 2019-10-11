import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import { Type, UUID, PersonName, PersonNameCodec } from "@huckleberryai/core";
import { WidgetEventCodec } from "../../../base/event";
import { MessageEvent } from "../base";

export const CommandType = "widget:command:add-name-to-message" as Type;

export const CommandCodec = iots.intersection(
  [
    WidgetEventCodec,
    iots.type({
      name: PersonNameCodec,
    }),
  ],
  CommandType
);

export type Command = iots.TypeOf<typeof CommandCodec>;

export const Command = (
  name: PersonName,
  message: UUID,
  widget: UUID,
  corr?: UUID,
  parent?: UUID
): Command =>
  pipe(
    MessageEvent(CommandType)(message, widget, corr, parent),
    event => ({ ...event, name })
  );

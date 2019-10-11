import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import { Type, UUIDCodec, UUID } from "@huckleberryai/core";
import { WidgetEvent, WidgetEventCodec } from "../../../base";

export const MessageEventCodec = iots.intersection([
  WidgetEventCodec,
  iots.type({
    message: UUIDCodec,
  }),
]);

export type MessageEvent = iots.TypeOf<typeof MessageEventCodec>;

export const MessageEvent = (type: Type) => (
  message: UUID,
  widget: UUID,
  corr?: UUID,
  parent?: UUID
): MessageEvent =>
  pipe(
    WidgetEvent(type)(widget, corr, parent),
    event => ({ ...event, message })
  );

import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import { Type, UUID, Event, EventCodec, UUIDCodec } from "@huckleberryai/core";

export const WidgetEventCodec = iots.intersection([
  EventCodec,
  iots.type({
    widget: UUIDCodec,
  }),
]);

export type WidgetEvent = iots.TypeOf<typeof WidgetEventCodec>;

export const WidgetEvent = (type: Type) => (
  widget: UUID,
  corr?: UUID,
  parent?: UUID
): WidgetEvent =>
  pipe(
    Event(type, corr, parent),
    event => ({
      ...event,
      widget,
    })
  );

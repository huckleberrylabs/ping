import { pipe } from "fp-ts/lib/pipeable";
import * as iots from "io-ts";
import "io-ts-types/lib/optionFromNullable";
import { Type, UUID, Event, EventCodec, UUIDCodec } from "@huckleberryai/core";
import { Either, map } from "fp-ts/lib/Either";

export const WidgetEventCodec = iots.intersection([
  EventCodec,
  iots.type({
    widget: UUIDCodec,
  }),
]);

export type WidgetEvent = iots.TypeOf<typeof WidgetEventCodec>;

export const WidgetEvent = (type: Type) => (
  widget: UUID,
  origin: Type,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): Either<Error, WidgetEvent> =>
  pipe(
    Event(type, origin, corr, parent, agent),
    map(event => ({
      ...event,
      widget,
    }))
  );

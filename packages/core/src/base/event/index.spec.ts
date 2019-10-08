import { Event, EventCodec } from ".";
import { UUID, Type } from "../../values";
import { pipe } from "fp-ts/lib/pipeable";
import { map, isRight } from "fp-ts/lib/Either";

describe("event", () => {
  test("construct, encode, decode", () => {
    pipe(
      Event(
        "core:event:test" as Type,
        "core:origin:event-test" as Type,
        undefined,
        undefined,
        UUID()
      ),
      map(EventCodec.encode),
      event => expect(isRight(event)).toBeTruthy()
    );
    pipe(
      Event(
        "core:event:test" as Type,
        "core:origin:event-test" as Type,
        UUID(),
        UUID()
      ),
      map(EventCodec.encode),
      event => expect(isRight(event)).toBeTruthy()
    );
    pipe(
      Event(
        "core:event:test" as Type,
        "core:origin:event-test" as Type,
        UUID(),
        UUID()
      ),
      map(EventCodec.encode),
      map(EventCodec.decode),
      event => expect(isRight(event)).toBeTruthy()
    );
  });
});

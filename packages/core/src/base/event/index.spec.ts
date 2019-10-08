import { Event, EventCodec } from ".";
import { UUID, Type } from "../../values";
import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";

describe("event", () => {
  test("should", () => {
    pipe(
      Event(
        "core:event:test" as Type,
        "core:origin:event-test" as Type,
        UUID(),
        UUID()
      ),
      map(EventCodec.encode),
      event => console.log(event)
    );
    pipe(
      Event(
        "core:event:test" as Type,
        "core:origin:event-test" as Type,
        UUID(),
        UUID()
      ),
      map(EventCodec.encode),
      map(event => EventCodec.decode(event)),
      event => console.log(event)
    );
    expect(true).toBeTruthy();
  });
});

import { Event, EventCodec } from ".";
import { UUID, Type } from "../../values";
import { pipe } from "fp-ts/lib/pipeable";
import { isRight } from "fp-ts/lib/Either";

describe("event", () => {
  test("construct, encode, decode", () => {
    pipe(
      Event("core:event:test" as Type),
      EventCodec.encode,
      event => expect(event).toBeTruthy()
    );
    pipe(
      Event("core:event:test" as Type, UUID(), UUID()),
      EventCodec.encode,
      event => expect(event).toBeTruthy()
    );
    pipe(
      Event("core:event:test" as Type, UUID(), UUID()),
      EventCodec.encode,
      EventCodec.decode,
      event => expect(isRight(event)).toBeTruthy()
    );
  });
});

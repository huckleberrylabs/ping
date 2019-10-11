import * as Event from ".";
import { UUID, Type } from "../values";
import { pipe } from "fp-ts/lib/pipeable";
import { isRight } from "fp-ts/lib/Either";

describe("event", () => {
  test("construct, encode, decode", () => {
    pipe(
      Event.C("core:event:test" as Type.T),
      Event.Codec.encode,
      event => expect(event).toBeTruthy()
    );
    pipe(
      Event.C("core:event:test" as Type.T, UUID.C(), UUID.C()),
      Event.Codec.encode,
      event => expect(event).toBeTruthy()
    );
    pipe(
      Event.C("core:event:test" as Type.T, UUID.C(), UUID.C()),
      Event.Codec.encode,
      Event.Codec.decode,
      event => expect(isRight(event)).toBeTruthy()
    );
  });
});

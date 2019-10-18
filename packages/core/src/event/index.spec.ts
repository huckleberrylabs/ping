import * as Event from ".";
import { UUID } from "../values";
import { pipe } from "fp-ts/lib/pipeable";
import { isRight } from "fp-ts/lib/Either";

describe("event", () => {
  test("construct, encode, decode", () => {
    pipe(
      Event.C(),
      Event.Codec.encode,
      event => expect(event).toBeTruthy()
    );
    pipe(
      Event.C(UUID.C(), UUID.C()),
      Event.Codec.encode,
      event => expect(event).toBeTruthy()
    );
    pipe(
      Event.C(UUID.C(), UUID.C()),
      Event.Codec.encode,
      Event.Codec.decode,
      event => expect(isRight(event)).toBeTruthy()
    );
  });
});

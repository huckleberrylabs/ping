import { pipe } from "fp-ts/lib/pipeable";
import { isRight } from "fp-ts/lib/Either";
import { Type, NonEmptyString } from "@huckleberrylabs/core";
import * as Event from ".";

describe("log-entry-event", () => {
  test("type is correct", () => {
    expect(Type.Is(Event.Name)).toBeTruthy();
  });
  test("it constructs", () => {
    expect(
      Event.C("info", "test-message" as NonEmptyString.T, [
        "test-tag" as NonEmptyString.T,
      ])
    ).toBeTruthy();
  });
  test("it encodes/decodes", () => {
    pipe(
      Event.C("info", "test-message" as NonEmptyString.T, [
        "test-tag" as NonEmptyString.T,
      ]),
      Event.Codec.encode,
      Event.Codec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
  });
});

import { pipe } from "fp-ts/lib/pipeable";
import { isRight } from "fp-ts/lib/Either";
import { IsType, NonEmptyString } from "@huckleberryai/core";
import { LogEventType, LogEvent, LogEventCodec } from ".";

describe("log-entry-event", () => {
  test("type is correct", () => {
    expect(IsType(LogEventType)).toBeTruthy();
  });
  test("it constructs", () => {
    expect(
      LogEvent("info", "test-message" as NonEmptyString, [
        "test-tag" as NonEmptyString,
      ])
    ).toBeTruthy();
  });
  test("it encodes/decodes", () => {
    pipe(
      LogEvent("info", "test-message" as NonEmptyString, [
        "test-tag" as NonEmptyString,
      ]),
      LogEventCodec.encode,
      LogEventCodec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
  });
});

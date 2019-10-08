import { LogEntryEventType, LogEntryEvent, LogEntryEventCodec } from ".";
import { IsType, Type } from "@huckleberryai/core";
import { pipe } from "fp-ts/lib/pipeable";
import { map, mapLeft, isRight, isLeft } from "fp-ts/lib/Either";

describe("log-entry-event", () => {
  test("type is correct", () => {
    expect(IsType(LogEntryEventType)).toBeTruthy();
  });
  test("it constructs", () => {
    pipe(
      LogEntryEvent(
        "test-message",
        "info",
        ["test-tag"],
        "core:origin:event-test" as Type
      ),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      LogEntryEvent("", "info", ["test-tag"], "core:origin:event-test" as Type),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      LogEntryEvent(
        "test-message",
        "info",
        [""],
        "core:origin:event-test" as Type
      ),
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
  test("it encodes/decodes", () => {
    pipe(
      LogEntryEvent(
        "test-message",
        "info",
        ["test-tag"],
        "log:origin:log-entry-event-test" as Type
      ),
      map(LogEntryEventCodec.encode),
      map(LogEntryEventCodec.decode),
      result => expect(isRight(result)).toBeTruthy()
    );
  });
});

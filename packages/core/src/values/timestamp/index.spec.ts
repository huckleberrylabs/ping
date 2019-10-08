import { pipe } from "fp-ts/lib/pipeable";
import { IsTimeStamp, TimeStamp, TimeStampCodec } from ".";
import { map } from "fp-ts/lib/Either";

describe("timestamp", () => {
  test("it constructs", () => {
    expect(TimeStamp()).toBeTruthy();
  });
  test("it guards", () => {
    expect(IsTimeStamp(TimeStamp())).toBeTruthy();
  });
  test("it encodes/decodes", () => {
    pipe(
      TimeStamp(),
      TimeStampCodec.encode,
      TimeStampCodec.decode,
      map(timestamp => expect(IsTimeStamp(timestamp)).toBeTruthy())
    );
  });
});

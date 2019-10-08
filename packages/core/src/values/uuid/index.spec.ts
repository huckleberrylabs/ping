import { pipe } from "fp-ts/lib/pipeable";
import { IsUUID, UUID, UUIDCodec } from ".";
import { map } from "fp-ts/lib/Either";

describe("uuid", () => {
  test("it constructs", () => {
    expect(UUID()).toBeTruthy();
  });
  test("it guards", () => {
    expect(IsUUID(UUID())).toBeTruthy();
  });
  test("it encodes/decodes", () => {
    pipe(
      UUID(),
      UUIDCodec.encode,
      UUIDCodec.decode,
      map(timestamp => expect(IsUUID(timestamp)).toBeTruthy())
    );
  });
});

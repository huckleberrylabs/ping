import { isRight } from "fp-ts/lib/Either";
import { Type, UUID } from "@huckleberryai/core";
import { Name, C, Codec, Is } from "./query";

describe("widget:settings:get-by-id:query", () => {
  test("has a name", () => {
    expect(Type.Is(Name)).toBeTruthy();
  });
  test("it constructs", () => {
    const query = C(UUID.C(), UUID.C(), UUID.C());
    expect(Is(query)).toBeTruthy();
  });
  test("it encodes", () => {
    const query = C(UUID.C(), UUID.C(), UUID.C());
    expect(Codec.encode(query)).toBeTruthy();
  });
  test("it decodes", () => {
    const query = C(UUID.C(), UUID.C(), UUID.C());
    const encoded = Codec.encode(query);
    const decoded = Codec.decode(encoded);
    expect(isRight(decoded)).toBeTruthy();
  });
});

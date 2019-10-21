import { isRight } from "fp-ts/lib/Either";
import { Type, Phone, Url } from "@huckleberryai/core";
import { Name, C, Is, Codec } from ".";

describe("widget:settings", () => {
  test("has a name", () => {
    expect(Type.Is(Name)).toBeTruthy();
  });
  test("it constructs", () => {
    const settings = C(
      "+1 647 295 1647" as Phone.T,
      "http://localhost" as Url.T
    );
    expect(Is(settings)).toBeTruthy();
  });
  test("it encodes", () => {
    const settings = C(
      "+1 647 295 1647" as Phone.T,
      "http://localhost" as Url.T
    );
    expect(Codec.encode(settings)).toBeTruthy();
  });
  test("it decodes", () => {
    const settings = C(
      "+1 647 295 1647" as Phone.T,
      "http://localhost" as Url.T
    );
    const encoded = Codec.encode(settings);
    const decoded = Codec.decode(encoded);
    expect(isRight(decoded)).toBeTruthy();
  });
  test("it decodes", () => {
    const settings = {
      type: "widget:settings",
      id: "d805c6fa-44c4-412c-b6d7-2828da2aba2d",
      color: "#3988f5",
      phone: "+16472951647",
      enabled: true,
      homePage: "http://localhost.com",
    };
    const decoded = Codec.decode(settings);
    expect(isRight(decoded)).toBeTruthy();
  });
});

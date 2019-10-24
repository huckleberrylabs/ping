import { isRight } from "fp-ts/lib/Either";
import { Type, Phone, Url, Color } from "@huckleberryai/core";
import { Name, C, Is, Codec } from ".";

describe("ping:widget", () => {
  test("has a name", () => {
    expect(Type.Is(Name)).toBeTruthy();
  });
  test("it constructs", () => {
    const widget = C(
      "+1 647 295 1647" as Phone.T,
      "http://localhost" as Url.T,
      "white" as Color.T
    );
    expect(Is(widget)).toBeTruthy();
  });
  test("it encodes", () => {
    const widget = C(
      "+1 647 295 1647" as Phone.T,
      "http://localhost" as Url.T,
      "white" as Color.T
    );
    expect(Codec.encode(widget)).toBeTruthy();
  });
  test("it decodes", () => {
    const widget = C(
      "+1 647 295 1647" as Phone.T,
      "http://localhost" as Url.T,
      "white" as Color.T
    );
    const encoded = Codec.encode(widget);
    const decoded = Codec.decode(encoded);
    expect(isRight(decoded)).toBeTruthy();
  });
  test("it decodes", () => {
    const widget = {
      type: "ping:widget",
      id: "d805c6fa-44c4-412c-b6d7-2828da2aba2d",
      color: "#3988f5",
      phone: "+16472951647",
      enabled: true,
      homePage: "http://localhost.com",
    };
    const decoded = Codec.decode(widget);
    expect(isRight(decoded)).toBeTruthy();
  });
});

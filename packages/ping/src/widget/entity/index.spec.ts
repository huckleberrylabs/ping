import { isRight } from "fp-ts/lib/Either";
import { Type, Phone, Url, Color, Country } from "@huckleberryai/core";
import { Name, C, Is, Codec } from ".";

describe("ping:widget", () => {
  const TEST_PHONE = "+16479999999" as Phone.T;
  const TEST_COUNTRY = "CA" as Country.T;
  const TEST_HOME_PAGE = "https://example.com" as Url.T;
  const TEST_COLOR = "#3988f5" as Color.T;
  const TEST_WIDGET = C(TEST_PHONE, TEST_COUNTRY, TEST_HOME_PAGE, TEST_COLOR);
  test("has a name", () => {
    expect(Type.Is(Name)).toBeTruthy();
  });
  test("it constructs", () => {
    expect(Is(TEST_WIDGET)).toBeTruthy();
  });
  test("it encodes", () => {
    expect(Codec.encode(TEST_WIDGET)).toBeTruthy();
  });
  test("it decodes", () => {
    const encoded = Codec.encode(TEST_WIDGET);
    const decoded = Codec.decode(encoded);
    expect(isRight(decoded)).toBeTruthy();
  });
  test("it decodes", () => {
    const widget = {
      type: "ping:widget",
      id: "d805c6fa-44c4-412c-b6d7-2828da2aba2d",
      color: TEST_COLOR as string,
      phone: TEST_PHONE as string,
      enabled: true,
      country: TEST_COUNTRY as string,
      homePage: TEST_HOME_PAGE as string,
    };
    const decoded = Codec.decode(widget);
    expect(isRight(decoded)).toBeTruthy();
  });
});

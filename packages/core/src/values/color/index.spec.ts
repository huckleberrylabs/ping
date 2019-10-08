import { FormatColor, ParseColor, Color, ColorCodec } from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { isRight, map, isLeft } from "fp-ts/lib/Either";

describe("color", () => {
  test("it parses", () => {
    pipe(
      ParseColor("white"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      ParseColor("rgb(0,0,0)"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      ParseColor("#fff"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      ParseColor("not a color"),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      ParseColor(""),
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
  test("it formats", () => {
    pipe(
      ParseColor("rgb(255,255,255)"),
      map(FormatColor),
      map(result => expect(result).toBe("#ffffff"))
    );
    pipe(
      ParseColor("rgb(221, 245, 66)"),
      map(FormatColor),
      map(result => expect(result).toBe("#ddf542"))
    );
  });
  test("it constructs", () => {
    pipe(
      Color("white"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Color("rgb(0,0,0)"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Color("#fff"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Color("not a color"),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      Color(""),
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
  test("it encodes/decodes", () => {
    pipe(
      "#fff",
      ColorCodec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      "rgb(0,0,0)",
      ColorCodec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      "",
      ColorCodec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      Color("#fff"),
      map(ColorCodec.encode),
      map(ColorCodec.decode),
      result => expect(isRight(result)).toBeTruthy()
    );
  });
});

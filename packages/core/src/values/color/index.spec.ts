import * as Color from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { isRight, map, isLeft } from "fp-ts/lib/Either";

describe("color", () => {
  test("it parses", () => {
    pipe(
      Color.Parse("white"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Color.Parse("rgb(0,0,0)"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Color.Parse("#fff"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Color.Parse("not a color"),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      Color.Parse(""),
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
  test("it formats", () => {
    pipe(
      Color.Parse("rgb(255,255,255)"),
      map(Color.Format),
      map(result => expect(result).toBe("#ffffff"))
    );
    pipe(
      Color.Parse("rgb(221, 245, 66)"),
      map(Color.Format),
      map(result => expect(result).toBe("#ddf542"))
    );
  });
  test("it constructs", () => {
    pipe(
      Color.C("white"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Color.C("rgb(0,0,0)"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Color.C("#fff"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Color.C("not a color"),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      Color.C(""),
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
  test("it encodes/decodes", () => {
    pipe(
      "#fff",
      Color.Codec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      "rgb(0,0,0)",
      Color.Codec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      "",
      Color.Codec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      Color.C("#fff"),
      map(Color.Codec.encode),
      map(Color.Codec.decode),
      result => expect(isRight(result)).toBeTruthy()
    );
  });
});

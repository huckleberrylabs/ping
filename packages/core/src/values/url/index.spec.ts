import { pipe } from "fp-ts/lib/pipeable";
import { UrlCodec, Url, NormalizeUrl } from ".";
import { map, isRight, isLeft } from "fp-ts/lib/Either";

describe("type", () => {
  test("it normalizes", () => {
    pipe(
      NormalizeUrl("http://www.example.com/?"),
      result => expect(result).toBe("http://example.com")
    );
    pipe(
      Url("not a url"),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      Url(""),
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
  test("it constructs", () => {
    pipe(
      Url("https://example.com"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      Url("not a url"),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      Url(""),
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
  test("it encodes/decodes", () => {
    pipe(
      Url("https://example.com"),
      map(UrlCodec.encode),
      map(UrlCodec.decode),
      result => expect(isRight(result)).toBeTruthy()
    );
  });
});

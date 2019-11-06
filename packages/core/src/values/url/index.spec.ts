import { pipe } from "fp-ts/lib/pipeable";
import { Codec, C, Normalize } from ".";
import { map, isRight, isLeft } from "fp-ts/lib/Either";

describe("type", () => {
  test("it normalizes", () => {
    pipe(
      Normalize("http://www.example.com/?"),
      result => expect(result).toBe("http://example.com")
    );
    pipe(
      C("not a url"),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      C(""),
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
  test("it constructs", () => {
    pipe(
      C("https://example.com"),
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      C("not a url"),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      C(""),
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
  test("it decodes", () => {
    const decoded = Codec.decode("http://example.com");
    expect(isRight(decoded)).toBeTruthy();
  });
  test("it encodes/decodes", () => {
    pipe(
      C("https://example.com"),
      map(Codec.encode),
      map(Codec.decode),
      result => expect(isRight(result)).toBeTruthy()
    );
  });
});

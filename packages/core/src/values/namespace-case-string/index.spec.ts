import { Is, Codec } from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { isRight, isLeft } from "fp-ts/lib/Either";

describe("name-space-string", () => {
  test("it encodes/decodes", () => {
    expect(Is("d243r3-4r3r3:r23r-f34r-ff43f")).toBeTruthy();
    expect(Is("2332d-d3-32:d:f3-32")).toBeTruthy();
    expect(Is("23-:d3-32df3-32")).toBeFalsy();
    expect(Is("-34242e3-d23")).toBeFalsy();
    expect(Is("-:")).toBeFalsy();
    expect(Is("34242e::3-d23")).toBeFalsy();
    expect(Is("324423e23d-:-23d23d3-d232-d2")).toBeFalsy();
    expect(Is("353i30-eiw23d-$@$@d3-d232-d2")).toBeFalsy();
    expect(Is("324#@$@-dwc23c{}#RD_#@D")).toBeFalsy();
  });
  test("it encodes/decodes", () => {
    pipe(
      "d243r3-4r3r3:r23r-f34r-ff43f",
      Codec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      "2332d-d3-32:d:f3-32",
      Codec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      "23-:d3-32df3-32",
      Codec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      "-34242e3-d23",
      Codec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      "-:",
      Codec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      "34242e::3-d23",
      Codec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
});

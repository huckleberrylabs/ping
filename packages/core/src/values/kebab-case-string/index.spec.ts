import { Is, Codec } from ".";
import { pipe } from "fp-ts/lib/pipeable";
import { isRight, isLeft } from "fp-ts/lib/Either";

describe("kebab-space-string", () => {
  test("it encodes/decodes", () => {
    expect(Is("d243r3-4r3r3r23r-f34r-ff43f")).toBeTruthy();
    expect(Is("2332d-d3-32df3-32")).toBeTruthy();
    expect(Is("23EER-d3-32df3-32")).toBeFalsy();
    expect(Is("-34242e3-d23")).toBeFalsy();
    expect(Is("34242e3-d23-")).toBeFalsy();
    expect(Is("324423e23d--23d23d3-d232-d2")).toBeFalsy();
    expect(Is("353i30-eiw23d-232$@$@d3-d232-d2")).toBeFalsy();
    expect(Is("324#@$@-dwc23c{}#RD_#@D")).toBeFalsy();
  });
  test("it encodes/decodes", () => {
    pipe(
      "d23er43r3-4r3r3r23r-f34r-ff43f",
      Codec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      "23r2df3d32d-d3-32df3-32",
      Codec.decode,
      result => expect(isRight(result)).toBeTruthy()
    );
    pipe(
      "-34242e3-d23-d2d-3",
      Codec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      "324423e23d--23d23d3-d232-d2",
      Codec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      "324423e453i30-eiw23d--23d2332$@$@d3-d232-d2",
      Codec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      "324#@$@-dwc23c{}#RD_#@D",
      Codec.decode,
      result => expect(isLeft(result)).toBeTruthy()
    );
  });
});

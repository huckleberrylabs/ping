import { map, isRight, isLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { PersonName, PersonNameCodec } from ".";
import { isSome, isNone } from "fp-ts/lib/Option";

describe("person-name", () => {
  test("it constructs", () => {
    pipe(
      PersonName(""),
      result => expect(isLeft(result)).toBeTruthy()
    );
    pipe(
      PersonName("Mr. Smith, PhD"),
      map(result => {
        expect(
          isSome(result.parsed) && result.parsed.value === "Mr. Smith, PhD"
        ).toBeTruthy();
        expect(isNone(result.first)).toBeTruthy();
        expect(
          isSome(result.last) && result.last.value === "Smith"
        ).toBeTruthy();
        expect(isNone(result.legal)).toBeTruthy();
        expect(isNone(result.middle)).toBeTruthy();
        expect(
          isSome(result.prefix) && result.prefix.value === "Mr."
        ).toBeTruthy();
        expect(
          isSome(result.suffix) && result.suffix.value === "PhD"
        ).toBeTruthy();
      })
    );
    pipe(
      PersonName("Bobby"),
      map(result => {
        expect(
          isSome(result.parsed) && result.parsed.value === "Bobby"
        ).toBeTruthy();
        expect(
          isSome(result.first) && result.first.value === "Bobby"
        ).toBeTruthy();
        expect(isNone(result.last)).toBeTruthy();
        expect(isNone(result.legal)).toBeTruthy();
        expect(isNone(result.middle)).toBeTruthy();
        expect(isNone(result.prefix)).toBeTruthy();
        expect(isNone(result.suffix)).toBeTruthy();
      })
    );
    pipe(
      PersonName("john doe"),
      map(result => {
        expect(
          isSome(result.parsed) && result.parsed.value === "john doe"
        ).toBeTruthy();
        expect(
          isSome(result.first) && result.first.value === "john"
        ).toBeTruthy();
        expect(isSome(result.last) && result.last.value === "doe").toBeTruthy();
        expect(isNone(result.legal)).toBeTruthy();
        expect(isNone(result.middle)).toBeTruthy();
        expect(isNone(result.prefix)).toBeTruthy();
        expect(isNone(result.suffix)).toBeTruthy();
      })
    );
    pipe(
      PersonName("Mrs. Jane Samantha Doe"),
      map(result => {
        expect(
          isSome(result.parsed) &&
            result.parsed.value === "Mrs. Jane Samantha Doe"
        ).toBeTruthy();
        expect(
          isSome(result.first) && result.first.value === "Jane"
        ).toBeTruthy();
        expect(isSome(result.last) && result.last.value === "Doe").toBeTruthy();
        expect(
          isSome(result.middle) && result.middle.value === "Samantha"
        ).toBeTruthy();
        expect(
          isSome(result.prefix) && result.prefix.value === "Mrs."
        ).toBeTruthy();
        expect(isNone(result.legal)).toBeTruthy();
        expect(isNone(result.suffix)).toBeTruthy();
      })
    );
  });
  test("it decodes", () => {
    pipe(
      PersonName("Mrs. Jane Samantha Doe"),
      map(PersonNameCodec.encode),
      map(PersonNameCodec.decode),
      result => expect(isRight(result)).toBeTruthy()
    );
  });
});

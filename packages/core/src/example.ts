import { pipe } from "fp-ts/lib/pipeable";
import {
  Either,
  left,
  right,
  getValidation,
  map,
  mapLeft,
} from "fp-ts/lib/Either";
import { sequenceT } from "fp-ts/lib/Apply";
import { NonEmptyArray, getSemigroup } from "fp-ts/lib/NonEmptyArray";

const applicativeValidation = getValidation(getSemigroup<string>());

type Lift = <E, A>(
  check: (a: A) => Either<E, A>
) => (a: A) => Either<NonEmptyArray<E>, A>;

const lift: Lift = check => a =>
  pipe(
    check(a),
    mapLeft(a => [a])
  );

const minLength = (s: string): Either<string, string> =>
  s.length >= 6 ? right(s) : left("at least 6 characters");

// const minLengthValidation = lift(minLength);

const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left("at least one capital letter");

//  const oneCapitalValidation = lift(oneCapital);

const oneNumber = (s: string): Either<string, string> =>
  /[0-9]/g.test(s) ? right(s) : left("at least one number");

// const oneNumberValidation = lift(oneNumber);

function validatePassword(s: string): Either<NonEmptyArray<string>, string> {
  return pipe(
    sequenceT(applicativeValidation)(
      lift(minLength)(s),
      lift(oneCapital)(s),
      lift(oneNumber)(s)
    ),
    map(() => s)
  );
}
console.log(validatePassword("ab"));

interface Person {
  name: string;
  age: number;
}

// Person constructor
const toPerson = ([name, age]: [string, number]): Person => ({
  name,
  age,
});

const validateName = (s: string): Either<NonEmptyArray<string>, string> =>
  s.length === 0 ? left(["Invalid name"]) : right(s);

const validateAge = (s: string): Either<NonEmptyArray<string>, number> =>
  isNaN(+s) ? left(["Invalid age"]) : right(+s);

export const validatePerson = (
  name: string,
  age: string
): Either<NonEmptyArray<string>, Person> => {
  return pipe(
    sequenceT(applicativeValidation)(validateName(name), validateAge(age)),
    map(toPerson)
  );
};

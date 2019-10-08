import { Either, map } from "fp-ts/lib/Either";
import { Type } from "../../values";
import { GetEnv, Env } from "../env";
import { pipe } from "fp-ts/lib/pipeable";

export const GetContext = (): Either<Error, Type> =>
  pipe(
    GetEnv(),
    map(env => {
      const contexts: {
        [P in Env]: Type;
      } = {
        development: "core:context:development" as Type,
        staging: "core:context:staging" as Type,
        production: "core:context:production" as Type,
        test: "core:context:test" as Type,
      };
      return contexts[env];
    })
  );

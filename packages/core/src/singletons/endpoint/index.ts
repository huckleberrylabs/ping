import { pipe } from "fp-ts/lib/pipeable";
import { Either, map, flatten } from "fp-ts/lib/Either";
import { GetEnv, Env } from "../env";
import { Url } from "../../values";

export const GetAPIURL = (): Either<Error, Url.T> =>
  pipe(
    GetEnv(),
    map(env => {
      const APIURLS: {
        [P in Env]: Url.T;
      } = {
        development: "http://localhost:8000" as Url.T,
        staging: "https://staging.huckleberry.app" as Url.T,
        production: "https://api.huckleberry.app" as Url.T,
        test: "http://localhost:8000" as Url.T,
      };
      return APIURLS[env];
    })
  );

export const GetEndpoint = (input: string): Either<Error, Url.T> =>
  pipe(
    GetAPIURL(),
    map(url => new URL(url)),
    map(url => {
      url.pathname = input;
      return url.toString();
    }),
    map(Url.C),
    flatten
  );

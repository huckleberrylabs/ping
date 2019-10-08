import { pipe } from "fp-ts/lib/pipeable";
import { Either, map, flatten } from "fp-ts/lib/Either";
import { GetEnv, Env } from "../env";
import { Url } from "../../values";

export const GetAPIURL = (): Either<Error, Url> =>
  pipe(
    GetEnv(),
    map(env => {
      const APIURLS: {
        [P in Env]: Url;
      } = {
        development: "http://localhost:8000" as Url,
        staging: "https://staging.huckleberry.app" as Url,
        production: "https://api.huckleberry.app" as Url,
        test: "http://localhost:8000" as Url,
      };
      return APIURLS[env];
    })
  );

export const GetEndpoint = (input: string): Either<Error, Url> =>
  pipe(
    GetAPIURL(),
    map(url => new URL(url)),
    map(url => {
      url.pathname = input;
      return url.toString();
    }),
    map(Url),
    flatten
  );

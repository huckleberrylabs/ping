import { Either, right, isLeft } from "fp-ts/lib/Either";
import { GetENV, ENV } from "../env";

export const APIURLS: {
  [P in ENV]: string;
} = {
  development: "http://localhost:8000",
  staging: "https://staging.huckleberry.app",
  production: "https://api.huckleberry.app",
  test: "http://localhost:8000",
};

export const GetAPIURL = (): Either<Error, string> => {
  const env = GetENV();
  return isLeft(env) ? env : right(APIURLS[env.right]);
};

export const EVENTS_ENDPOINT = "/events";

export const GetEventsEndpoint = (): Either<Error, string> => {
  const apiUrl = GetAPIURL();
  return isLeft(apiUrl) ? apiUrl : right(apiUrl.right + EVENTS_ENDPOINT);
};

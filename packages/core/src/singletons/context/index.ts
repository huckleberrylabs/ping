import { Either, right, isLeft } from "fp-ts/lib/Either";
import { UUID } from "../../values/uuid";
import { GetENV, ENV } from "../env";

export const CONTEXTS: {
  [P in ENV]: UUID;
} = {
  development: "64b265e6-f69a-4dea-8cab-693a06a5c554",
  staging: "645d5709-2b56-4764-88c5-62bc41e01a27",
  production: "57bc81af-49d6-409a-9aaa-a64e10dea4c5",
  test: "364f9e4e-766a-44ac-9f44-2599e1eaa036",
};

export const GetContext = (): Either<Error, UUID> => {
  const env = GetENV();
  return isLeft(env) ? env : right(CONTEXTS[env.right]);
};

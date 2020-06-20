import * as iots from "io-ts";
import jwt from "jsonwebtoken";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import { right, left, Either } from "fp-ts/lib/Either";

// TODO Cron Job to remove expired invalidated tokens

export const ONE_TIME_ACCESS_TOKEN_EXPIRY = "24h";
export const ACCESS_TOKEN_EXPIRY = "30d";

export const Name = "auth:model:decoded-token" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    account: UUID.Codec,
    oneTime: iots.boolean,
    type: iots.literal(Name),
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    return Codec.is(decoded) ? right(decoded) : left(Errors.Parsing.C());
  } catch (error) {
    return left(Errors.Parsing.C());
  }
};

export const verifyAndDecode = (
  key: string,
  token: string
): Either<Errors.Unauthenticated.T | Errors.Parsing.T, T> => {
  // Verify
  try {
    jwt.verify(token, key);
  } catch (error) {
    return left(Errors.Unauthenticated.C());
  }
  // Decode
  try {
    const decoded = jwt.decode(token);
    return Codec.is(decoded) ? right(decoded) : left(Errors.Parsing.C());
  } catch (error) {
    return left(Errors.Parsing.C());
  }
};

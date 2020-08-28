import * as iots from "io-ts";
import jwt from "jsonwebtoken";
import { UUID, Errors, NameSpaceCaseString } from "../../../values";
import { right, left, Either } from "fp-ts/lib/Either";

export const ONE_TIME_ACCESS_TOKEN_EXPIRY = "24h";
export const ACCESS_TOKEN_EXPIRY = "30d";

export const Name = "auth:model:decoded-token" as NameSpaceCaseString.T;

export const Codec = iots.type(
  {
    type: iots.literal(Name),
    account: UUID.Codec,
    oneTime: iots.boolean,
  },
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const C = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    return Codec.is(decoded)
      ? right(decoded)
      : left(Errors.Validation.C(Name, `Constructor decoding error`));
  } catch (error) {
    return left(Errors.Validation.C(Name, `Constructor decoding error`));
  }
};

export const VerifyAndDecode = (
  key: string,
  token: string
): Either<Errors.Unauthenticated.T | Errors.Validation.T, T> => {
  // Verify
  try {
    jwt.verify(token, key);
  } catch (error) {
    return left(
      Errors.Unauthenticated.C(
        `${Name}.VerifyAndDecode verify error: ${error.message}`
      )
    );
  }
  // Decode
  try {
    const decoded = jwt.decode(token);
    return Codec.is(decoded)
      ? right(decoded)
      : left(Errors.Validation.C(Name, `VerifyAndDecode decoding error`));
  } catch (error) {
    return left(Errors.Validation.C(Name, `VerifyAndDecode decoding error`));
  }
};

import { left, right, isLeft, Either, isRight } from "fp-ts/lib/Either";
import jwt from "jsonwebtoken";
import {
  IAuthenticationService,
  IInvalidTokenRepository,
} from "../../../interfaces";
import { NonEmptyString, Errors, NameSpaceCaseString } from "../../../values";
import * as Model from "../model";

export const Name = "iam:authentication:service" as NameSpaceCaseString.T;
export const C = (
  invalidTokenRepository: IInvalidTokenRepository
): Either<Errors.Environment.T, IAuthenticationService> => {
  const key = process.env.SECRET_KEY;
  if (!NonEmptyString.Is(key))
    return left(Errors.Environment.C(Name, `SECRET_KEY is missing.`));
  return right({
    generateToken: (account, oneTime, expiry) => {
      return jwt.sign({ account, oneTime, type: Model.Name }, key, {
        expiresIn: expiry,
      }) as NonEmptyString.T;
    },
    authenticateToken: async token => {
      /* IMPORTANT Make sure that the logic is correct */
      const decodedMaybe = Model.VerifyAndDecode(key, token);
      if (isRight(decodedMaybe)) {
        // Check if Token is Invalidated
        const decoded = decodedMaybe.right;
        const existsMaybe = await invalidTokenRepository.exists(token);
        if (isLeft(existsMaybe) && Errors.NotFound.Is(existsMaybe.left)) {
          // Invalidate Token if it is a one time use token
          if (decoded.oneTime) {
            const addedMaybe = await invalidTokenRepository.add(token);
            if (isLeft(addedMaybe)) return addedMaybe;
          }
          return right(decoded);
        }
      }
      return left(
        Errors.Unauthenticated.C(
          Name,
          "token authentication failed",
          "Authentication invalid or expired. Please try to login again."
        )
      );
    },
    invalidateToken: async token => {
      const addedMaybe = await invalidTokenRepository.add(token);
      if (isLeft(addedMaybe)) return addedMaybe;
      return right(null);
    },
  });
};

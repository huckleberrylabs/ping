// @ts-ignore
import { Option } from "fp-ts/lib/Option";
// @ts-ignore
import * as i from "fp-ts/lib/Either";

// import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as iots from "io-ts";
import { Either, right, left, isLeft } from "fp-ts/lib/Either";
import { UUID, Errors, NonEmptyString } from "@huckleberrylabs/core";
import { Interfaces } from "@huckleberrylabs/ping";

/* const Hash = (agentID: UUID.T, event: Event.T) => {
  let hash = crypto
    .createHash("md5")
    .update("some_string")
    .digest("hex");
}; */

const DecodedTokenName = "api:value:decoded-token";

const DecodedTokenCodec = iots.type(
  {
    agent: UUID.Codec,
    oneTime: iots.boolean,
    type: iots.literal(DecodedTokenName),
  },
  DecodedTokenName
);

export type DecodedToken = iots.TypeOf<typeof DecodedTokenCodec>;

const DecodeToken = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    return DecodedTokenCodec.is(decoded)
      ? right(decoded)
      : left(Errors.Parsing.C());
  } catch (error) {
    return left(Errors.Parsing.C());
  }
};

export const C = () => {
  const key = process.env.SECRET_KEY;
  if (key) {
    const service: Interfaces.IAMService = {
      generateOneTimeToken(agent: UUID.T): NonEmptyString.T {
        return jwt.sign({ agent, oneTime: true, type: DecodedTokenName }, key, {
          expiresIn: "24h",
        }) as NonEmptyString.T;
      },
      generateToken(agent: UUID.T): NonEmptyString.T {
        return jwt.sign(
          { agent, oneTime: false, type: DecodedTokenName },
          key,
          {
            expiresIn: "30d",
          }
        ) as NonEmptyString.T;
      },
      authenticateToken(
        token: string
      ): Either<Errors.Parsing.T | Errors.Unauthenticated.T, null> {
        try {
          jwt.verify(token, key);
        } catch (error) {
          return left(Errors.Unauthenticated.C());
        }
        const decodedMaybe = DecodeToken(token);
        if (isLeft(decodedMaybe)) return decodedMaybe;
        const decoded = decodedMaybe.right;
        // TODO Check if token is revoked
        if (decoded.oneTime) {
          // TODO Revoke Token
        }
        return right(null);
      },
      getAgentFromToken(token: string): Either<Errors.Parsing.T, UUID.T> {
        const decodedMaybe = DecodeToken(token);
        if (isLeft(decodedMaybe)) return decodedMaybe;
        const decoded = decodedMaybe.right;
        return right(decoded.agent);
      },
    };
    return right(service);
  }
  return left(Errors.Environment.C());
};

import { right, left } from "fp-ts/lib/Either";
import { RedisClient } from "redis";
import { IInvalidTokenRepository } from "../../../interfaces";
import { NameSpaceCaseString, Errors } from "../../../values";

export const Name = "auth:repository:invalid-token" as NameSpaceCaseString.T;

export const C = (redis: RedisClient): IInvalidTokenRepository => ({
  exists: async token =>
    new Promise(resolve =>
      redis.exists(Name + ":" + token, (err, exists) =>
        resolve(
          err !== null
            ? left(
                Errors.Adapter.C(
                  Name,
                  `exists redis error: ${err.message}`,
                  `Server error, please try again later or contact support.`
                )
              )
            : exists !== 1
            ? left(Errors.NotFound.C(Name, `token does not exist`))
            : right(null)
        )
      )
    ),
  add: async token =>
    new Promise(resolve =>
      redis.set(Name + ":" + token, token, err =>
        resolve(
          err
            ? left(
                Errors.Adapter.C(
                  Name,
                  `add redis error: ${err.message}`,
                  `Server error, please try again later or contact support.`
                )
              )
            : right(null)
        )
      )
    ),
});

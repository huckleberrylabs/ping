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
          err !== null || exists !== 1 ? left(Errors.Adapter.C()) : right(null)
        )
      )
    ),
  add: async token =>
    new Promise(resolve =>
      redis.set(Name + ":" + token, token, err =>
        resolve(err ? left(Errors.Adapter.C()) : right(null))
      )
    ),
});

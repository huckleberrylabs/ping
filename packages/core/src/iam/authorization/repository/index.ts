import { RedisClient } from "redis";
import { right, left } from "fp-ts/lib/Either";
import { IAccessPolicyRepository } from "../../../interfaces";
import { NameSpaceCaseString, Errors } from "../../../values";
import * as Model from "../model";

export const Name = "auth:repository:access-policy" as NameSpaceCaseString.T;

export const C = (redis: RedisClient): IAccessPolicyRepository => ({
  exists: async hash =>
    new Promise(resolve =>
      redis.exists(Name + ":" + hash, (err, exists) =>
        resolve(
          err !== null || exists !== 1 ? left(Errors.Adapter.C()) : right(null)
        )
      )
    ),
  add: async record =>
    new Promise(resolve =>
      redis.set(
        Name + ":" + record.hash,
        JSON.stringify(Model.Codec.encode(record)),
        err => resolve(err ? left(Errors.Adapter.C()) : right(null))
      )
    ),
  remove: async hash =>
    new Promise(resolve =>
      redis.del(hash, err =>
        resolve(err ? left(Errors.Adapter.C()) : right(null))
      )
    ),
});

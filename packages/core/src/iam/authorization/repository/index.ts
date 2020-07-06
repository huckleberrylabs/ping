import { RedisClient } from "redis";
import { right, left } from "fp-ts/lib/Either";
import { IAccessPolicyRepository } from "../../../interfaces";
import { NameSpaceCaseString, Errors } from "../../../values";

export const Name = "auth:repository:access-policy" as NameSpaceCaseString.T;

const Keys = (params: {
  account: string;
  action?: string;
  entity?: string;
}) => {
  const keys = [];
  if (params.account && params.action && params.entity) {
    keys.push(`${Name}:${params.account}:${params.action}:${params.entity}`);
  }
  if (params.account && params.action) {
    keys.push(`${Name}:${params.account}:${params.action}:`);
  }
  if (params.account && params.entity) {
    keys.push(`${Name}:${params.account}::${params.entity}`);
  }
  return keys;
};

export const C = (redis: RedisClient): IAccessPolicyRepository => ({
  exists: async params =>
    new Promise(resolve =>
      redis.exists(Keys(params), (err, exists) =>
        resolve(
          err !== null
            ? left(Errors.Adapter.C())
            : exists === 0
            ? left(Errors.NotFound.C())
            : right(null)
        )
      )
    ),
  add: async params =>
    new Promise(resolve => {
      const multi = redis.multi();
      Keys(params).forEach(key => multi.set(key, ""));
      multi.exec(err => resolve(err ? left(Errors.Adapter.C()) : right(null)));
    }),
  remove: async params =>
    new Promise(resolve =>
      redis.del(Keys(params), err =>
        resolve(err ? left(Errors.Adapter.C()) : right(null))
      )
    ),
});

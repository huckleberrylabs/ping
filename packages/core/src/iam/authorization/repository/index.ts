import { IRedis, IAccessPolicyRepository } from "../../../interfaces";
import { isRight, right } from "fp-ts/lib/Either";
import { NameSpaceCaseString } from "../../../values";
import * as Model from "../model";

export const Name = "auth:repository:access-policy" as NameSpaceCaseString.T;

export const C = (redis: IRedis): IAccessPolicyRepository => ({
  exists: async hash => {
    const result = await redis.get(Name + ":" + hash);
    if (isRight(result)) return right(null);
    return result;
  },
  add: async record => {
    const result = await redis.set(
      Name + ":" + record.hash,
      JSON.stringify(Model.Codec.encode(record))
    );
    return isRight(result) ? right(null) : result;
  },
  remove: async hash => {
    return redis.remove(hash);
  },
});

import { IInvalidTokenRepository, IRedis } from "../../../interfaces";
import { isRight, right } from "fp-ts/lib/Either";
import { NameSpaceCaseString } from "../../../values";

export const Name = "auth:repository:invalid-token" as NameSpaceCaseString.T;

export const C = (redis: IRedis): IInvalidTokenRepository => ({
  exists: async token => {
    const result = await redis.get(Name + ":" + token);
    if (isRight(result)) return right(null);
    return result;
  },
  add: async token => {
    const result = await redis.set(Name + ":" + token, token);
    return isRight(result) ? right(null) : result;
  },
});

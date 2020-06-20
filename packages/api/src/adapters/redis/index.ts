import redis, { RedisClient } from "redis";
import { promisify } from "util";
import { IRedis, Errors } from "@huckleberrylabs/ping-core";
import { left, right } from "fp-ts/lib/Either";

export const SharedConstructor = (client: RedisClient): IRedis => ({
  get: async key => {
    try {
      const getAsync = promisify(client.get).bind(client);
      const value = await getAsync(key);
      if (typeof value === "string") return right(value);
      return left(Errors.Adapter.C());
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  set: async (key, value) => {
    try {
      const setAsync = promisify(client.set).bind(client);
      const result = await setAsync(key, value);
      if (result === "OK") return right(null);
      return left(Errors.Adapter.C());
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
  remove: async key => {
    try {
      client.del(key);
      return right(null);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  },
});

export const C = (): IRedis => {
  const client = redis.createClient();
  return SharedConstructor(client);
};

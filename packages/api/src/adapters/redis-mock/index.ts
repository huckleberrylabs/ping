import redis from "redis-mock";
import { SharedConstructor } from "../redis";
import { IRedis } from "@huckleberrylabs/ping-core";

export const C = (): IRedis => {
  const client = redis.createClient();
  return SharedConstructor(client);
};

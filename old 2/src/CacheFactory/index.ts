import { promisify } from "util";
import redis, { RedisClient } from "redis";
// @ts-ignore
import { IServiceFactory } from "../interfaces";
import Cache, { ICache } from "../Cache";
// @ts-ignore
import Framework from "../../Framework";

export type CacheClient = RedisClient;
export type EnhancedCacheClient = {
  sync: CacheClient;
  async: {
    get: () => Promise<string>;
    mget: () => Promise<Array<string | void>>;
    set: () => Promise<number>;
    del: () => Promise<number>;
    smembers: () => Promise<Array<string | void>>;
    sadd: () => Promise<number>;
    srem: () => Promise<number>;
  };
};
export type CacheConfig = {
  db?: string;
  username?: string;
  password?: string;
  host?: string;
  port?: number;
  connect_timeout?: number;
};
export type ICacheFactory = IServiceFactory<ICache, CacheConfig>;
export default class CacheFactory implements ICacheFactory {
  config: CacheConfig;
  client: CacheClient;
  constructor(config: CacheConfig) {
    this.config = config;
    const client = redis.createClient(this.config);
    this.client = {
      async: {
        get: promisify(client.get).bind(client),
        mget: promisify(client.mget).bind(client),
        set: promisify(client.set).bind(client),
        del: promisify(client.del).bind(client),
        smembers: promisify(client.smembers).bind(client),
        sadd: promisify(client.sadd).bind(client),
        srem: promisify(client.srem).bind(client)
      },
      sync: client
    };
  }
  get(withNameSpace: string): ICache {
    if (!withNameSpace) {
      throw new Error("Cache namespace must be provided");
    }
    return new Cache(withNameSpace, this.client);
  }
}

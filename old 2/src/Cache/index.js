import { promisify } from "util";
import { type EnhancedCacheClient } from "../CacheFactory";

export interface ICache {
  +namespace: string;
  client: EnhancedCacheClient;
  constructor(withNameSpace: string, client: EnhancedCacheClient): void;
  getIndex(): Promise<Array<string | void>>;
  getData(...args: Array<string>): Promise<Array<string | void>>;
  save(...args: Array<string>): Promise<void>;
  clear(...args: Array<string>): Promise<void>;
}

export default class Cache implements ICache {
  namespace: string;
  client: EnhancedCacheClient;
  constructor(withNameSpace: string, client: EnhancedCacheClient): void {
    if (!withNameSpace) {
      throw new Error("Cache namespace must be provided");
    }
    this.namespace = withNameSpace;
    this.client = client;
  }
  nameSpaceKey(key) {
    this.namespace ? `${this.namespace}:${key}` : key;
  }
  async getIndex(): Promise<Array<string | void>> {
    return this.client.async.smembers(this.namespace);
  }
  async getData(...args: Array<string>): Promise<Array<string | void>> {
    let ids = args;
    if (args.length === 0) {
      ids = this.getIndex();
    }
    if (ids.length === 0) {
      return [];
    }
    const keys = ids.map(id => this.nameSpaceKey(id));
    return this.client.async.mget(...keys);
  }
  async save(...args: Array<string>): Promise<void> {
    if (args.length < 2 || !(args.length % 2 == 0)) {
      throw new Error("Invalid Arguments");
    }
    const ids = args.filter((e, i) => i % 2 === 0);
    const keyValueArray = args;
    keyValueArray.map((e, i) => (i % 2 === 0 ? this.nameSpaceKey(e) : e));
    const multi = this.client.sync.multi();
    const exec = promisify(multi.exec).bind(multi);
    multi.sadd(this.namespace, ...ids);
    multi.mset(...args);
    return exec();
  }
  async clear(...args: Array<string>): Promise<void> {
    let ids = args;
    if (args.length === 0) {
      ids = this.getIndex();
    }
    const keys = ids.map(id => this.nameSpaceKey(id));
    const multi = this.client.sync.multi();
    const exec = promisify(multi.exec).bind(multi);
    multi.del(...keys);
    multi.srem(this.namespace, ...keys);
    return exec();
  }
}

import { injectable } from "inversify";
import { MongoClient, Db } from "mongodb";
import { Logger } from "../logger";
import { Config } from "@huckleberry/config";

@injectable()
export class Mongo {
  private client: MongoClient;
  public db!: Db;
  constructor(private config: Config, private logger: Logger) {
    this.client = new MongoClient(config.mongo.url, { useNewUrlParser: true });
  }
  async init() {
    await this.client.connect();
    this.logger.log("info", "Database Initialized Successfully");
    this.db = this.client.db(this.config.name);
  }
}

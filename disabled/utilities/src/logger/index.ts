import { injectable } from "inversify";
import logger, { FluentSender, Timestamp } from "fluent-logger";
import { Config } from "@huckleberry/config";

@injectable()
export class Logger {
  logger: FluentSender<{}>;
  constructor(config: Config) {
    this.logger = logger.createFluentSender(config.name, config.log);
  }
  log(label: string, data: any, timestamp?: Timestamp) {
    if (timestamp) {
      this.logger.emit(label, data, timestamp);
    } else {
      this.logger.emit(label, data);
    }
  }
}

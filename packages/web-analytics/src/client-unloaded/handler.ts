import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { ILogEntriesRepository } from "@huckleberryai/log";
import { IClientUnloadedEvent } from "./event";

@injectable()
export class ClientUnloadedEventHandler implements IEventHandler {
  constructor(
    private webAnalyticsRepository: IWebAnalyticsRepository,
    private logEntriesRepository: ILogEntriesRepository
  ) {}
  async handle(event: IClientUnloadedEvent) {
    const origin = "043329cb-bb3f-4912-be84-0c58b2b1a895";
    let status: StatusCode = OK;
    let data = null;
    try {
      await this.webAnalyticsRepository.add(event);
    } catch (error) {
      data = error.toString();
      status = INTERNAL_SERVER_ERROR;
    }
    return Result(data, status, origin, event.corr, event.id);
  }
}

import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { ILogEntryRepository } from "@huckleberryai/log";
import { IWebAnalyticsRepository } from "../interfaces";
import {
  IWebAnalyticsClientUnloadedEvent,
  NormalizeWebAnalyticsClientUnloadedEvent,
  IsWebAnalyticsClientUnloadedEvent,
} from "./event";

@injectable()
export class WebAnalyticsClientUnloadedEventHandler implements IEventHandler {
  constructor(
    private webAnalyticsRepository: IWebAnalyticsRepository,
    private logEntriesRepository: ILogEntryRepository
  ) {}
  async handle(event: IWebAnalyticsClientUnloadedEvent) {
    const ORIGIN_ID = "043329cb-bb3f-4912-be84-0c58b2b1a895";
    if (!IsWebAnalyticsClientUnloadedEvent(event)) {
      return Result(null, BAD_REQUEST, ORIGIN_ID);
    }
    try {
      await this.webAnalyticsRepository.add(
        NormalizeWebAnalyticsClientUnloadedEvent(event)
      );
      await Promise.all(event.log.log.map(this.logEntriesRepository.add));
      return Result(null, OK, origin, event.corr, event.id);
    } catch (error) {
      return Result(null, INTERNAL_SERVER_ERROR, origin, event.corr, event.id);
    }
  }
}

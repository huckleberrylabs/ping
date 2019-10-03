import { injectable, inject } from "inversify";
import { IEventHandler, PersistEventHandler } from "@huckleberryai/core";
import {
  IWebAnalyticsClientLoadedEvent,
  IsWebAnalyticsClientLoadedEvent,
} from "./event";
import {
  IWebAnalyticsRepository,
  WebAnalyticsRepositoryType,
} from "../interfaces";

@injectable()
export class WebAnalyticsClientLoadedEventHandler implements IEventHandler {
  constructor(
    @inject(WebAnalyticsRepositoryType)
    private repository: IWebAnalyticsRepository
  ) {}
  handle = PersistEventHandler<IWebAnalyticsClientLoadedEvent>(
    "043329cb-bb3f-4912-be84-0c58b2b1a895",
    this.repository.add,
    IsWebAnalyticsClientLoadedEvent
  );
}

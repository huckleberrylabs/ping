import { injectable, inject } from "inversify";
import { IEventHandler, PersistEventHandler } from "@huckleberryai/core";
import {
  IWebAnalyticsHTTPAccessEvent,
  IsWebAnalyticsHTTPAccessEvent,
} from "./event";
import {
  IWebAnalyticsRepository,
  WebAnalyticsRepositoryType,
} from "../interfaces";

@injectable()
export class WebAnalyticsHTTPAccessEventHandler implements IEventHandler {
  constructor(
    @inject(WebAnalyticsRepositoryType)
    private repository: IWebAnalyticsRepository
  ) {}
  handle = PersistEventHandler<IWebAnalyticsHTTPAccessEvent>(
    "b50b7c54-1b4a-426e-9e98-d53d9de2cfad",
    this.repository.add,
    IsWebAnalyticsHTTPAccessEvent
  );
}

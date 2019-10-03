import { ContainerModule } from "inversify";
import { IEventHandler } from "../../core/lib";
import {
  WebAnalyticsHTTPAccessEventType,
  WebAnalyticsHTTPAccessEventHandler,
} from "./http-access";
import {
  WebAnalyticsClientLoadedEventType,
  WebAnalyticsClientLoadedEventHandler,
} from "./client-loaded";
import {
  WebAnalyticsClientUnloadedEventType,
  WebAnalyticsClientUnloadedEventHandler,
} from "./client-unloaded";

export const WebAnalyticsModule = new ContainerModule(bind => {
  bind<IEventHandler>(WebAnalyticsClientLoadedEventType).to(
    WebAnalyticsClientLoadedEventHandler
  );
  bind<IEventHandler>(WebAnalyticsClientUnloadedEventType).to(
    WebAnalyticsClientUnloadedEventHandler
  );
  bind<IEventHandler>(WebAnalyticsHTTPAccessEventType).to(
    WebAnalyticsHTTPAccessEventHandler
  );
});

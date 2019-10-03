import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import { ILogEntryRepository, LogModule } from "@huckleberryai/log";
import {
  IWebAnalyticsRepository,
  WebAnalyticsModule,
} from "@huckleberryai/web-analytics";
import {
  IWidgetSettingsRepository,
  IWidgetMessageRepository,
  WidgetModule,
} from "@huckleberryai/widget";

import { DocumentStore } from "../utilities";
import {
  LogEntryRepository,
  WebAnalyticsRepository,
  WidgetSettingsRepository,
  WidgetMessageRepository,
} from "../repositories";

const APIModule = new ContainerModule(bind => {
  bind<DocumentStore>(DocumentStore)
    .toSelf()
    .inSingletonScope();
  bind<ILogEntryRepository>(LogEntryRepository).toSelf();
  bind<IWebAnalyticsRepository>(WebAnalyticsRepository).toSelf();
  bind<IWidgetSettingsRepository>(WidgetSettingsRepository).toSelf();
  bind<IWidgetMessageRepository>(WidgetMessageRepository).toSelf();
});

const IoC = new Container();
IoC.load(APIModule, LogModule, WebAnalyticsModule, WidgetModule);

export { IoC };

import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import { ITextingClient, TextingClientType } from "@huckleberryai/core";
import {
  ILogEntryRepository,
  LogEntryRepositoryType,
  LogModule,
} from "@huckleberryai/log";
import {
  IWebAnalyticsRepository,
  WebAnalyticsRepositoryType,
  WebAnalyticsModule,
} from "@huckleberryai/web-analytics";
import {
  IWidgetSettingsRepository,
  WidgetSettingsRepositoryType,
  IWidgetMessageRepository,
  WidgetMessageRepositoryType,
  WidgetModule,
} from "@huckleberryai/widget";
import { DocumentStore, TextingClient } from "./utilities";
import {
  LogEntryRepository,
  WebAnalyticsRepository,
  WidgetSettingsRepository,
  WidgetMessageRepository,
} from "./repositories";

const APIModule = new ContainerModule(bind => {
  bind<DocumentStore>(DocumentStore)
    .toSelf()
    .inSingletonScope();
  bind<ITextingClient>(TextingClientType)
    .to(TextingClient)
    .inSingletonScope();
  bind<ILogEntryRepository>(LogEntryRepositoryType).to(LogEntryRepository);
  bind<IWebAnalyticsRepository>(WebAnalyticsRepositoryType).to(
    WebAnalyticsRepository
  );
  bind<IWidgetSettingsRepository>(WidgetSettingsRepositoryType).to(
    WidgetSettingsRepository
  );
  bind<IWidgetMessageRepository>(WidgetMessageRepositoryType).to(
    WidgetMessageRepository
  );
});

const IoC = new Container();
IoC.load(APIModule, LogModule, WebAnalyticsModule, WidgetModule);

export { IoC };

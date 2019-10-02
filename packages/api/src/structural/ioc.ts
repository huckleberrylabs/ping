import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import { IEventHandler, IEventRepository } from "@huckleberryai/core";
import { IWidgetSettingsRepository } from "@huckleberryai/widget";
import {
  HTTPAccessEventType,
  HTTPAccessEventHandler,
} from "@huckleberryai/web-analytics";
import { DocumentStore } from "../utilities";
import { EventRepository, WidgetSettingsRepository } from "../repositories";

const APIUtilitiesModule = new ContainerModule(bind => {
  bind<DocumentStore>(DocumentStore)
    .toSelf()
    .inSingletonScope();
});

const APIRepositoryModule = new ContainerModule(bind => {
  bind<IWidgetSettingsRepository>(WidgetSettingsRepository).toSelf();
  bind<IEventRepository>(EventRepository).toSelf();
});

const APIHandlerModule = new ContainerModule(bind => {
  bind<IEventHandler>(HTTPAccessEventType).to(HTTPAccessEventHandler);
});

const IoC = new Container();
IoC.load(APIRepositoryModule, APIUtilitiesModule, APIHandlerModule);

export { IoC };

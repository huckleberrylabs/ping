import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import {
  HandlerType,
  IEventHandler,
  IEventRepository,
} from "@huckleberryai/core";
import { IWidgetSettingsRepository } from "@huckleberryai/widget";
import {
  HTTPAccessEventType,
  HTTPAccessEventHandler,
} from "@huckleberryai/web-analytics";
import { FireStore } from "../utilities";
import { EventRepository, WidgetSettingsRepository } from "../repositories";

const APIUtilitiesModule = new ContainerModule(bind => {
  bind<FireStore>(FireStore)
    .toSelf()
    .inSingletonScope();
});

const APIRepositoryModule = new ContainerModule(bind => {
  bind<IWidgetSettingsRepository>(WidgetSettingsRepository).toSelf();
  bind<IEventRepository>(EventRepository).toSelf();
});

const APIHandlerModule = new ContainerModule(bind => {
  bind<IEventHandler>(HTTPAccessEventType)
    .to(HTTPAccessEventHandler)
    .whenTargetNamed(HandlerType);
});

const IoC = new Container();
IoC.load(APIRepositoryModule, APIUtilitiesModule, APIHandlerModule);

export { IoC };

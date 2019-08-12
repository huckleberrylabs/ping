import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import {
  IEventHandler,
  IEventStatic,
  Event,
  Query,
  Command,
} from "@huckleberryai/core";
import { FireStore } from "../firestore";
import { TextWidgetSettingsRepository } from "../widget-repository";
import { EventRepository } from "../event-repository";
import {
  HTTPAccessEventHandler,
  TextWidgetLoadedEventHandler,
  TextWidgetOpenedCommandHandler,
  TextWidgetMessageAddedCommandHandler,
  TextWidgetNameAddedCommandHandler,
  TextWidgetPhoneAddedCommandHandler,
  TextWidgetSentCommandHandler,
  TextWidgetSettingsQueryHandler,
} from "../handlers";
import { HTTPAccessEvent } from "../events";
import {
  TextWidgetLoadedEvent,
  TextWidgetMessageAddedCommand,
  TextWidgetNameAddedCommand,
  TextWidgetPhoneAddedCommand,
  TextWidgetSentCommand,
  TextWidgetOpenedCommand,
  TextWidgetSettingsQuery,
} from "@huckleberryai/text";

export const EVENT_NAME = Symbol.for("EVENT");
export const HANDLER_NAME = Symbol.for("HANDLER");

const domainModule = new ContainerModule(bind => {
  bind<TextWidgetSettingsRepository>(TextWidgetSettingsRepository).toSelf();
  bind<EventRepository>(EventRepository).toSelf();
});

const utilityModule = new ContainerModule(bind => {
  bind<FireStore>(FireStore)
    .toSelf()
    .inSingletonScope();
});

const eventModule = new ContainerModule(bind => {
  // Core Events
  bind<IEventStatic>(Event.type.toSymbol())
    .toConstantValue(Event)
    .whenTargetNamed(EVENT_NAME);
  bind<IEventStatic>(Command.type.toSymbol())
    .toConstantValue(Command)
    .whenTargetNamed(EVENT_NAME);
  bind<IEventStatic>(Query.type.toSymbol())
    .toConstantValue(Query)
    .whenTargetNamed(EVENT_NAME);

  // HTTPAccessEvent
  bind<IEventStatic>(HTTPAccessEvent.type.toSymbol())
    .toConstantValue(HTTPAccessEvent)
    .whenTargetNamed(EVENT_NAME);

  // TextWidget Events

  // LoadedEvent
  bind<IEventStatic>(TextWidgetLoadedEvent.type.toSymbol())
    .toConstantValue(TextWidgetLoadedEvent)
    .whenTargetNamed(EVENT_NAME);
  // OpenedCommand
  bind<IEventStatic>(TextWidgetOpenedCommand.type.toSymbol())
    .toConstantValue(TextWidgetOpenedCommand)
    .whenTargetNamed(EVENT_NAME);
  // MessageAddedCommand
  bind<IEventStatic>(TextWidgetMessageAddedCommand.type.toSymbol())
    .toConstantValue(TextWidgetMessageAddedCommand)
    .whenTargetNamed(EVENT_NAME);
  // NameAddedCommand
  bind<IEventStatic>(TextWidgetNameAddedCommand.type.toSymbol())
    .toConstantValue(TextWidgetNameAddedCommand)
    .whenTargetNamed(EVENT_NAME);
  // PhoneAddedCommand
  bind<IEventStatic>(TextWidgetPhoneAddedCommand.type.toSymbol())
    .toConstantValue(TextWidgetPhoneAddedCommand)
    .whenTargetNamed(EVENT_NAME);
  // SentCommand
  bind<IEventStatic>(TextWidgetSentCommand.type.toSymbol())
    .toConstantValue(TextWidgetSentCommand)
    .whenTargetNamed(EVENT_NAME);
  // SettingsQuery
  bind<IEventStatic>(TextWidgetSettingsQuery.type.toSymbol())
    .toConstantValue(TextWidgetSettingsQuery)
    .whenTargetNamed(EVENT_NAME);
});

const handlerModule = new ContainerModule(bind => {
  // HTTPAccessEvent
  bind<IEventHandler>(HTTPAccessEventHandler.type.toSymbol())
    .to(HTTPAccessEventHandler)
    .whenTargetNamed(HANDLER_NAME);

  // TextWidget Events

  // LoadedEvent
  bind<IEventHandler>(TextWidgetLoadedEventHandler.type.toSymbol())
    .to(TextWidgetLoadedEventHandler)
    .whenTargetNamed(HANDLER_NAME);
  // OpenedCommand
  bind<IEventHandler>(TextWidgetOpenedCommandHandler.type.toSymbol())
    .to(TextWidgetOpenedCommandHandler)
    .whenTargetNamed(HANDLER_NAME);
  // MessageAddedCommand
  bind<IEventHandler>(TextWidgetMessageAddedCommandHandler.type.toSymbol())
    .to(TextWidgetMessageAddedCommandHandler)
    .whenTargetNamed(HANDLER_NAME);
  // NameAddedCommand
  bind<IEventHandler>(TextWidgetNameAddedCommandHandler.type.toSymbol())
    .to(TextWidgetNameAddedCommandHandler)
    .whenTargetNamed(HANDLER_NAME);
  // PhoneAddedCommand
  bind<IEventHandler>(TextWidgetPhoneAddedCommandHandler.type.toSymbol())
    .to(TextWidgetPhoneAddedCommandHandler)
    .whenTargetNamed(HANDLER_NAME);
  // SentCommand
  bind<IEventHandler>(TextWidgetSentCommandHandler.type.toSymbol())
    .to(TextWidgetSentCommandHandler)
    .whenTargetNamed(HANDLER_NAME);
  // SettingsQuery
  bind<IEventHandler>(TextWidgetSettingsQueryHandler.type.toSymbol())
    .to(TextWidgetSettingsQueryHandler)
    .whenTargetNamed(HANDLER_NAME);
});

const IoCContainer = new Container();
IoCContainer.load(domainModule, utilityModule, eventModule, handlerModule);

export { IoCContainer };

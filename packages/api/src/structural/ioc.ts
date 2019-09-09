import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import {
  SerializerName,
  DeserializerName,
  HandlerName,
  ISerializer,
  IDeserializer,
  IEventHandler,
} from "@huckleberryai/core";

// Utilities
import { FireStore } from "../utilities/firestore";

// Repositories
import { EventRepository, TextWidgetSettingsRepository } from "../repositories";

// Serializers / Deserializers
import {
  IHTTPAccessEvent,
  ISerializedHTTPAccessEvent,
  HTTPAccessEventName,
  HTTPAccessEventSerializer,
  HTTPAccessEventDeserializer,
} from "../events";
import {
  TextSerializerModule,
  TextDeserializerModule,
} from "@huckleberryai/text";

// Handlers
import { HTTPAccessEventHandler } from "../handlers";

const APIUtilitiesModule = new ContainerModule(bind => {
  bind<FireStore>(FireStore)
    .toSelf()
    .inSingletonScope();
});

const APIRepositoryModule = new ContainerModule(bind => {
  bind<TextWidgetSettingsRepository>(TextWidgetSettingsRepository).toSelf();
  bind<EventRepository>(EventRepository).toSelf();
});

const APISerializerModule = new ContainerModule(bind => {
  bind<ISerializer<IHTTPAccessEvent, ISerializedHTTPAccessEvent>>(
    HTTPAccessEventName
  )
    .toFunction(HTTPAccessEventSerializer)
    .whenTargetNamed(SerializerName);
});

const APIDeserializerModule = new ContainerModule(bind => {
  bind<IDeserializer<IHTTPAccessEvent>>(HTTPAccessEventName)
    .toFunction(HTTPAccessEventDeserializer)
    .whenTargetNamed(DeserializerName);
});

const APIHandlerModule = new ContainerModule(bind => {
  bind<IEventHandler>(HTTPAccessEventName)
    .to(HTTPAccessEventHandler)
    .whenTargetNamed(HandlerName);
});

const IoC = new Container();
IoC.load(
  APIRepositoryModule,
  APIUtilitiesModule,
  APISerializerModule,
  APIDeserializerModule,
  APIHandlerModule,
  TextSerializerModule,
  TextDeserializerModule
);

export { IoC };

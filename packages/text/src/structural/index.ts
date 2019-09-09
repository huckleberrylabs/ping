import { ContainerModule } from "inversify";
import {
  ISerializer,
  SerializerName,
} from "@huckleberryai/core/src/structural/serializer";

import {
  IDeserializer,
  DeserializerName,
} from "@huckleberryai/core/src/structural/deserializer";

import {
  ITextWidgetLoadedEvent,
  ISerializedTextWidgetLoadedEvent,
  TextWidgetLoadedEventName,
  TextWidgetLoadedEventSerializer,
  TextWidgetLoadedEventDeserializer,
} from "../events/text-widget-loaded-event";

import {
  ITextWidgetMessageAddedCommand,
  ISerializedTextWidgetMessageAddedCommand,
  TextWidgetMessageAddedCommandName,
  TextWidgetMessageAddedCommandSerializer,
  TextWidgetMessageAddedCommandDeserializer,
} from "../events/text-widget-message-added-command";

import {
  ITextWidgetNameAddedCommand,
  ISerializedTextWidgetNameAddedCommand,
  TextWidgetNameAddedCommandName,
  TextWidgetNameAddedCommandSerializer,
  TextWidgetNameAddedCommandDeserializer,
} from "../events/text-widget-name-added-command";

import {
  ITextWidgetOpenedCommand,
  ISerializedTextWidgetOpenedCommand,
  TextWidgetOpenedCommandName,
  TextWidgetOpenedCommandSerializer,
  TextWidgetOpenedCommandDeserializer,
} from "../events/text-widget-opened-command";

import {
  ITextWidgetPhoneAddedCommand,
  ISerializedTextWidgetPhoneAddedCommand,
  TextWidgetPhoneAddedCommandName,
  TextWidgetPhoneAddedCommandSerializer,
  TextWidgetPhoneAddedCommandDeserializer,
} from "../events/text-widget-phone-added-command";

import {
  ITextWidgetSentCommand,
  ISerializedTextWidgetSentCommand,
  TextWidgetSentCommandName,
  TextWidgetSentCommandSerializer,
  TextWidgetSentCommandDeserializer,
} from "../events/text-widget-sent-command";

import {
  ITextWidgetSettingsQuery,
  ISerializedTextWidgetSettingsQuery,
  TextWidgetSettingsQueryName,
  TextWidgetSettingsQuerySerializer,
  TextWidgetSettingsQueryDeserializer,
} from "../events/text-widget-settings-query";

import {
  ITextWidgetUnloadedEvent,
  ISerializedTextWidgetUnloadedEvent,
  TextWidgetUnloadedEventName,
  TextWidgetUnloadedEventSerializer,
  TextWidgetUnloadedEventDeserializer,
} from "../events/text-widget-unloaded-event";

import {
  ITextWidgetSettings,
  ISerializedTextWidgetSettings,
  TextWidgetSettingsName,
  TextWidgetSettingsSerializer,
  TextWidgetSettingsDeserializer,
} from "../models/text-widget-settings";

export const TextSerializerModule = new ContainerModule(bind => {
  // TextWidgetLoadedEvent
  bind<ISerializer<ITextWidgetLoadedEvent, ISerializedTextWidgetLoadedEvent>>(
    TextWidgetLoadedEventName
  )
    .toFunction(TextWidgetLoadedEventSerializer)
    .whenTargetNamed(SerializerName);

  // TextWidgetMessageAddedCommand
  bind<
    ISerializer<
      ITextWidgetMessageAddedCommand,
      ISerializedTextWidgetMessageAddedCommand
    >
  >(TextWidgetMessageAddedCommandName)
    .toFunction(TextWidgetMessageAddedCommandSerializer)
    .whenTargetNamed(SerializerName);

  // TextWidgetNameAddedCommand
  bind<
    ISerializer<
      ITextWidgetNameAddedCommand,
      ISerializedTextWidgetNameAddedCommand
    >
  >(TextWidgetNameAddedCommandName)
    .toFunction(TextWidgetNameAddedCommandSerializer)
    .whenTargetNamed(SerializerName);

  // TextWidgetOpenedCommand
  bind<
    ISerializer<ITextWidgetOpenedCommand, ISerializedTextWidgetOpenedCommand>
  >(TextWidgetOpenedCommandName)
    .toFunction(TextWidgetOpenedCommandSerializer)
    .whenTargetNamed(SerializerName);

  // TextWidgetPhoneAddedCommand
  bind<
    ISerializer<
      ITextWidgetPhoneAddedCommand,
      ISerializedTextWidgetPhoneAddedCommand
    >
  >(TextWidgetPhoneAddedCommandName)
    .toFunction(TextWidgetPhoneAddedCommandSerializer)
    .whenTargetNamed(SerializerName);

  // TextWidgetSentCommand
  bind<ISerializer<ITextWidgetSentCommand, ISerializedTextWidgetSentCommand>>(
    TextWidgetSentCommandName
  )
    .toFunction(TextWidgetSentCommandSerializer)
    .whenTargetNamed(SerializerName);

  // TextWidgetSettingsQuery
  bind<
    ISerializer<ITextWidgetSettingsQuery, ISerializedTextWidgetSettingsQuery>
  >(TextWidgetSettingsQueryName)
    .toFunction(TextWidgetSettingsQuerySerializer)
    .whenTargetNamed(SerializerName);

  // TextWidgetUnloadedEvent
  bind<
    ISerializer<ITextWidgetUnloadedEvent, ISerializedTextWidgetUnloadedEvent>
  >(TextWidgetUnloadedEventName)
    .toFunction(TextWidgetUnloadedEventSerializer)
    .whenTargetNamed(SerializerName);

  // TextWidgetSettings
  bind<ISerializer<ITextWidgetSettings, ISerializedTextWidgetSettings>>(
    TextWidgetSettingsName
  )
    .toFunction(TextWidgetSettingsSerializer)
    .whenTargetNamed(SerializerName);
});

export const TextDeserializerModule = new ContainerModule(bind => {
  // TextWidgetLoadedEvent
  bind<IDeserializer<ITextWidgetLoadedEvent>>(TextWidgetLoadedEventName)
    .toFunction(TextWidgetLoadedEventDeserializer)
    .whenTargetNamed(DeserializerName);

  // TextWidgetMessageAddedCommand
  bind<IDeserializer<ITextWidgetMessageAddedCommand>>(
    TextWidgetMessageAddedCommandName
  )
    .toFunction(TextWidgetMessageAddedCommandDeserializer)
    .whenTargetNamed(DeserializerName);

  // TextWidgetNameAddedCommand
  bind<IDeserializer<ITextWidgetNameAddedCommand>>(
    TextWidgetNameAddedCommandName
  )
    .toFunction(TextWidgetNameAddedCommandDeserializer)
    .whenTargetNamed(DeserializerName);

  // TextWidgetOpenedCommand
  bind<IDeserializer<ITextWidgetOpenedCommand>>(TextWidgetOpenedCommandName)
    .toFunction(TextWidgetOpenedCommandDeserializer)
    .whenTargetNamed(DeserializerName);

  // TextWidgetPhoneAddedCommand
  bind<IDeserializer<ITextWidgetPhoneAddedCommand>>(
    TextWidgetPhoneAddedCommandName
  )
    .toFunction(TextWidgetPhoneAddedCommandDeserializer)
    .whenTargetNamed(DeserializerName);

  // TextWidgetSentCommand
  bind<IDeserializer<ITextWidgetSentCommand>>(TextWidgetSentCommandName)
    .toFunction(TextWidgetSentCommandDeserializer)
    .whenTargetNamed(DeserializerName);

  // TextWidgetSettingsQuery
  bind<IDeserializer<ITextWidgetSettingsQuery>>(TextWidgetSettingsQueryName)
    .toFunction(TextWidgetSettingsQueryDeserializer)
    .whenTargetNamed(DeserializerName);

  // TextWidgetUnloadedEvent
  bind<IDeserializer<ITextWidgetUnloadedEvent>>(TextWidgetUnloadedEventName)
    .toFunction(TextWidgetUnloadedEventDeserializer)
    .whenTargetNamed(DeserializerName);

  // TextWidgetSettings
  bind<IDeserializer<ITextWidgetSettings>>(TextWidgetSettingsName)
    .toFunction(TextWidgetSettingsDeserializer)
    .whenTargetNamed(DeserializerName);
});

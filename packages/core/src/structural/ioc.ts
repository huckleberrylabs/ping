import { ContainerModule } from "inversify";
import { ISerializer, SerializerName } from "./serializer";

import { IDeserializer, DeserializerName } from "./deserializer";

import {
  IColor,
  ISerializedColor,
  ColorName,
  ColorSerializer,
  ColorDeserializer,
} from "../value-objects/color";

import {
  IMessage,
  ISerializedMessage,
  MessageName,
  MessageSerializer,
  MessageDeserializer,
} from "../value-objects/message";

import {
  INull,
  ISerializedNull,
  NullName,
  NullSerializer,
  NullDeserializer,
} from "../value-objects/null";

import {
  IPersonName,
  ISerializedPersonName,
  PersonNameName,
  PersonNameSerializer,
  PersonNameDeserializer,
} from "../value-objects/person-name";

import {
  IPhone,
  ISerializedPhone,
  PhoneName,
  PhoneSerializer,
  PhoneDeserializer,
} from "../value-objects/phone";

import {
  ITimeStamp,
  ISerializedTimeStamp,
  TimeStampName,
  TimeStampSerializer,
  TimeStampDeserializer,
} from "../value-objects/timestamp";

import {
  ITypeName,
  ISerializedTypeName,
  TypeNameName,
  TypeNameSerializer,
  TypeNameDeserializer,
} from "../value-objects/type-name";

import {
  IUUID,
  ISerializedUUID,
  UUIDName,
  UUIDSerializer,
  UUIDDeserializer,
} from "../value-objects/uuid";

export const CoreSerializerModule = new ContainerModule(bind => {
  // Color
  bind<ISerializer<IColor, ISerializedColor>>(ColorName)
    .toFunction(ColorSerializer)
    .whenTargetNamed(SerializerName);
  // Message
  bind<ISerializer<IMessage, ISerializedMessage>>(MessageName)
    .toFunction(MessageSerializer)
    .whenTargetNamed(SerializerName);
  // Null
  bind<ISerializer<INull, ISerializedNull>>(NullName)
    .toFunction(NullSerializer)
    .whenTargetNamed(SerializerName);
  // PersonName
  bind<ISerializer<IPersonName, ISerializedPersonName>>(PersonNameName)
    .toFunction(PersonNameSerializer)
    .whenTargetNamed(SerializerName);
  // Phone
  bind<ISerializer<IPhone, ISerializedPhone>>(PhoneName)
    .toFunction(PhoneSerializer)
    .whenTargetNamed(SerializerName);
  // TimeStamp
  bind<ISerializer<ITimeStamp, ISerializedTimeStamp>>(TimeStampName)
    .toFunction(TimeStampSerializer)
    .whenTargetNamed(SerializerName);
  // TypeName
  bind<ISerializer<ITypeName, ISerializedTypeName>>(TypeNameName)
    .toFunction(TypeNameSerializer)
    .whenTargetNamed(SerializerName);
  // UUID
  bind<ISerializer<IUUID, ISerializedUUID>>(UUIDName)
    .toFunction(UUIDSerializer)
    .whenTargetNamed(SerializerName);
});

export const CoreDeserializerModule = new ContainerModule(bind => {
  // Color
  bind<IDeserializer<IColor>>(ColorName)
    .toFunction(ColorDeserializer)
    .whenTargetNamed(DeserializerName);
  // Message
  bind<IDeserializer<IMessage>>(MessageName)
    .toFunction(MessageDeserializer)
    .whenTargetNamed(DeserializerName);
  // Null
  bind<IDeserializer<INull>>(NullName)
    .toFunction(NullDeserializer)
    .whenTargetNamed(DeserializerName);
  // PersonName
  bind<IDeserializer<IPersonName>>(PersonNameName)
    .toFunction(PersonNameDeserializer)
    .whenTargetNamed(DeserializerName);
  // Phone
  bind<IDeserializer<IPhone>>(PhoneName)
    .toFunction(PhoneDeserializer)
    .whenTargetNamed(DeserializerName);
  // TimeStamp
  bind<IDeserializer<ITimeStamp>>(TimeStampName)
    .toFunction(TimeStampDeserializer)
    .whenTargetNamed(DeserializerName);
  // TypeName
  bind<IDeserializer<ITypeName>>(TypeNameName)
    .toFunction(TypeNameDeserializer)
    .whenTargetNamed(DeserializerName);
  // UUID
  bind<IDeserializer<IUUID>>(UUIDName)
    .toFunction(UUIDDeserializer)
    .whenTargetNamed(DeserializerName);
});

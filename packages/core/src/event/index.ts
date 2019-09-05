import { IResult } from "../result";
import { CONTEXT_ID } from "../context";
import { INewable, IData } from "../interfaces";
import {
  IUUID,
  UUID,
  ISerializedUUID,
  IsUUID,
  IsSerializedUUID,
  UUIDSerializer,
  UUIDDeserializer,
} from "../value-objects/uuid";
import {
  ITypeName,
  ISerializedTypeName,
  IsTypeName,
  IsSerializedTypeName,
  TypeNameSerializer,
  TypeNameDeserializer,
} from "../value-objects/type-name";
import {
  ITimeStamp,
  ISerializedTimeStamp,
  TimeStamp,
  IsTimeStamp,
  IsSerializedTimeStamp,
  TimeStampSerializer,
  TimeStampDeserializer,
} from "../value-objects/timestamp";
import { IsNonNullObject } from "../helpers";

export interface IEvent {
  type: ITypeName;
  timestamp: ITimeStamp;
  context: IUUID;
  origin: IUUID;
  id: IUUID;
  corr: IUUID;
  parent: IUUID | null;
  agent: IUUID | null;
}

export interface ISerializedEvent {
  [key: string]: any; // This is needed because of JSONObject
  type: ISerializedTypeName;
  timestamp: ISerializedTimeStamp;
  context: ISerializedUUID;
  origin: ISerializedUUID;
  id: ISerializedUUID;
  corr: ISerializedUUID;
  parent: ISerializedUUID | null;
  agent: ISerializedUUID | null;
}

export interface IEventHandlerStatic extends INewable<IEventHandler> {
  type: ITypeName;
}
export interface IEventHandler {
  id: IUUID;
  handle(event: IEvent): Promise<IResult<IData>>;
}

export const IsEvent = (input: unknown): input is IEvent => {
  // Must be Object
  if (!IsNonNullObject(input)) {
    return false;
  }
  // Must have all properties
  const hasType = "type" in input;
  const hasTimeStamp = "timestamp" in input;
  const hasContext = "context" in input;
  const hasOrigin = "origin" in input;
  const hasID = "id" in input;
  const hasCorr = "corr" in input;
  const hasParent = "parent" in input;
  const hasAgent = "agent" in input;
  if (
    !hasType ||
    !hasTimeStamp ||
    !hasContext ||
    !hasOrigin ||
    !hasID ||
    !hasCorr ||
    !hasParent ||
    !hasAgent
  ) {
    return false;
  }
  const { type, timestamp, context, origin } = <IEvent>input;
  const { id, corr, parent, agent } = <IEvent>input;
  // Must have valid type
  if (!IsTypeName(type)) {
    return false;
  }
  // Must have valid timestamp
  if (!IsTimeStamp(timestamp)) {
    return false;
  }
  // Must have valid context
  if (!IsUUID(context)) {
    return false;
  }
  // Must have valid origin
  if (!IsUUID(origin)) {
    return false;
  }
  // Must have valid id
  if (!IsUUID(id)) {
    return false;
  }
  // Must have valid corr
  if (!IsUUID(corr)) {
    return false;
  }
  // Must have valid parent
  if (parent !== null || !IsUUID(parent)) {
    return false;
  }
  // Must have valid agent
  if (agent !== null || !IsUUID(agent)) {
    return false;
  }
  return true;
};

export const IsSerializedEvent = (
  input: unknown
): input is ISerializedEvent => {
  // Must be Object
  if (typeof input !== "object") {
    return false;
  }
  // Must be non-null
  if (!input) {
    return false;
  }
  // Must have all properties
  const hasType = "type" in input;
  const hasTimeStamp = "timestamp" in input;
  const hasContext = "context" in input;
  const hasOrigin = "origin" in input;
  const hasID = "id" in input;
  const hasCorr = "corr" in input;
  const hasParent = "parent" in input;
  const hasAgent = "agent" in input;
  if (
    !hasType ||
    !hasTimeStamp ||
    !hasContext ||
    !hasOrigin ||
    !hasID ||
    !hasCorr ||
    !hasParent ||
    !hasAgent
  ) {
    return false;
  }
  const { type, timestamp, context, origin } = <ISerializedEvent>input;
  const { id, corr, parent, agent } = <ISerializedEvent>input;
  // Must have valid type
  if (!IsSerializedTypeName(type)) {
    return false;
  }
  // Must have valid timestamp
  if (!IsSerializedTimeStamp(timestamp)) {
    return false;
  }
  // Must have valid context
  if (!IsSerializedUUID(context)) {
    return false;
  }
  // Must have valid origin
  if (!IsSerializedUUID(origin)) {
    return false;
  }
  // Must have valid id
  if (!IsSerializedUUID(id)) {
    return false;
  }
  // Must have valid corr
  if (!IsSerializedUUID(corr)) {
    return false;
  }
  // Must have valid parent
  if (parent !== null || !IsSerializedUUID(parent)) {
    return false;
  }
  // Must have valid agent
  if (agent !== null || !IsSerializedUUID(agent)) {
    return false;
  }
  return true;
};

export const Event = (
  type: ITypeName,
  origin: IUUID,
  corr?: IUUID,
  parent?: IUUID,
  agent?: IUUID
): IEvent => {
  return {
    type,
    timestamp: TimeStamp(),
    context: CONTEXT_ID,
    origin: origin,
    id: UUID(),
    corr: corr ? corr : UUID(),
    parent: parent ? parent : null,
    agent: agent ? agent : null,
  };
};

export const EventSerializer = (input: IEvent): ISerializedEvent => {
  if (!IsEvent(input)) {
    throw new Error("EventSerializer: not a valid Event");
  }
  return {
    type: TypeNameSerializer(input.type),
    timestamp: TimeStampSerializer(input.timestamp),
    context: UUIDSerializer(input.context),
    origin: UUIDSerializer(input.origin),
    id: UUIDSerializer(input.id),
    corr: UUIDSerializer(input.corr),
    parent: input.parent ? UUIDSerializer(input.parent) : null,
    agent: input.agent ? UUIDSerializer(input.agent) : null,
  };
};

export const EventDeserializer = (input: unknown): IEvent => {
  if (!IsSerializedEvent(input)) {
    throw new Error("EventDeserializer: not a valid Event");
  }
  const event = Event(
    TypeNameDeserializer(input.type),
    UUIDDeserializer(input.origin),
    input.corr ? UUIDDeserializer(input.corr) : undefined,
    input.parent ? UUIDDeserializer(input.parent) : undefined,
    input.agent ? UUIDDeserializer(input.agent) : undefined
  );
  event.id = UUIDDeserializer(input.id);
  event.timestamp = TimeStampDeserializer(input.timestamp);
  event.context = UUIDDeserializer(input.context);
  return event;
};

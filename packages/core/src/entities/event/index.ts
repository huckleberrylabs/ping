import { CONTEXT_ID } from "../../singletons";
import {
  UUID,
  IsUUID,
  TimeStamp,
  IsTimeStamp,
  Type,
  IsType,
  Data,
  IsNonNullObject,
} from "../../value-objects";
import { IResult } from "../result";

export interface IEvent {
  type: Type;
  timestamp: TimeStamp;
  context: UUID;
  origin: UUID;
  id: UUID;
  corr: UUID;
  parent: UUID | null;
  agent: UUID | null;
}

export interface IEventHandler {
  id: UUID;
  handle(event: IEvent): Promise<IResult<Data>>;
}

export const Event = (
  type: Type,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): IEvent => ({
  type,
  timestamp: TimeStamp(),
  context: CONTEXT_ID,
  origin: origin,
  id: UUID(),
  corr: corr ? corr : UUID(),
  parent: parent ? parent : null,
  agent: agent ? agent : null,
});

export const IsEvent = (input: unknown): input is IEvent =>
  IsNonNullObject(input) &&
  IsType(input.type) &&
  IsTimeStamp(input.timestamp) &&
  IsUUID(input.context) &&
  IsUUID(input.origin) &&
  IsUUID(input.id) &&
  IsUUID(input.corr) &&
  (input.parent === null || IsUUID(input.parent)) &&
  (input.agent === null || IsUUID(input.agent));

import { Either, right, isLeft } from "fp-ts/lib/Either";
import { GetContext } from "../../singletons";
import {
  UUID,
  IsUUID,
  TimeStamp,
  IsTimeStamp,
  Type,
  IsType,
  IsNonNullObject,
} from "../../values";

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

export const Event = (
  type: Type,
  origin: UUID,
  corr?: UUID,
  parent?: UUID,
  agent?: UUID
): Either<Error, IEvent> => {
  const context = GetContext();
  return isLeft(context)
    ? context
    : right({
        type,
        timestamp: TimeStamp(),
        context: context.right,
        origin: origin,
        id: UUID(),
        corr: corr ? corr : UUID(),
        parent: parent ? parent : null,
        agent: agent ? agent : null,
      });
};

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

import { TypeName } from "../type-name";
import { TimeStamp } from "../timestamp";
import { ID } from "../id";
import { StatusCode } from "../status-codes";

export interface Newable<T> {
  new (...args: any[]): T;
}

export interface WithTimeStamp {
  timestamp: TimeStamp;
}

export interface WithType {
  type: TypeName;
}

export interface WithID {
  id: ID;
}

export interface WithContextID {
  contextID: ID;
}

export interface WithOriginID {
  originID: ID;
}

export interface WithCorrID {
  corrID: ID;
}

export interface WithParentID {
  parentID?: ID;
}

export interface WithSerialize {
  toJSON: () => string | object;
}

export interface WithDeserialize<Type> {
  fromJSON: (json: any) => IResult;
}

export interface IEventStatic
  extends Newable<IEvent>,
    WithType,
    WithDeserialize<IEvent> {}
export interface IEvent
  extends WithType,
    WithTimeStamp,
    WithID,
    WithContextID,
    WithOriginID,
    WithCorrID,
    WithParentID,
    WithSerialize {}

export function isEvent(object: any): object is IEvent {
  if (object) {
    return (
      "type" in object &&
      "timestamp" in object &&
      "id" in object &&
      "contextID" in object &&
      "originID" in object &&
      "corrID" in object
    );
  }
  return false;
}

export interface IEventHandlerStatic extends Newable<IEventHandler>, WithType {}
export interface IEventHandler extends WithID {
  handle(event: IEvent): Promise<IResult>;
}

export interface IResultStatic
  extends Newable<IResult>,
    WithDeserialize<IResult> {}

export interface IResult
  extends WithType,
    WithTimeStamp,
    WithID,
    WithContextID,
    WithOriginID,
    WithCorrID,
    WithParentID,
    WithSerialize {
  status: StatusCode;
  isError: boolean;
  data: any;
}

export function isResult(object: any): object is IResult {
  if (object) {
    return (
      "type" in object &&
      "timestamp" in object &&
      "id" in object &&
      "contextID" in object &&
      "originID" in object &&
      "corrID" in object &&
      "status" in object &&
      "isError" in object &&
      "data" in object
    );
  }
  return false;
}

export interface IPolicy extends WithID {}

export interface IPolicyStatic extends Newable<IPolicy>, WithID {}

export interface ITask extends WithType, WithID {
  description: string;
}

export interface ITaskStatic extends Newable<ITask>, WithType, WithID {
  description: string;
}

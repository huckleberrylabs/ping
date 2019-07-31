import { ID } from "../id";
import { TimeStamp } from "../timestamp";

export interface Newable<T> {
  new (...args: any[]): T;
}

export interface WithType {
  type: symbol;
}

export interface WithID {
  id: ID;
}

export interface IEvent extends WithType, WithID {
  timestamp: TimeStamp;
  contextID: ID;
  nodeID: ID;
  corrID: ID;
  parentID?: ID;
}

export interface IEventStatic extends Newable<IEvent>, WithType {
  contextID: ID;
}

export interface IEventHandler<Event> extends WithType {
  handle(event: Event): Promise<IEvent[] | IEvent | void>;
  contextID: ID;
  nodeID: ID;
}

export interface IPolicy extends WithID {}

export interface IPolicyStatic extends Newable<IPolicy>, WithID {}

export interface ITask extends WithType, WithID {
  description: string;
}

export interface ITaskStatic extends Newable<ITask>, WithType, WithID {
  description: string;
}

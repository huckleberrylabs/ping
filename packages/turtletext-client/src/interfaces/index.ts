export interface Newable<T> {
  new (...args: any[]): T;
}

export interface WithType {
  type: symbol;
}

export interface WithID {
  id: string;
}

export interface IEvent extends WithType, WithID {
  timestamp: string;
  contextID: string;
  nodeID: string;
  corrID: string;
  parentID: string | undefined;
}

export interface IEventStatic extends Newable<IEvent>, WithType {
  contextID: string;
}

export interface IEventHandler {
  handle(event: IEvent): Promise<IEvent[] | IEvent | void>;
}

export interface IEventHandlerStatic extends Newable<IEventHandler>, WithType {}

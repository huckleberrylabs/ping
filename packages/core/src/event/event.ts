import { ID } from "../id";
import { TypeName } from "../type-name";
import { TimeStamp } from "../timestamp";
import { CONTEXT_ID } from "../context";
import { IResult } from "../interfaces";

type Serialized = "Serialized";

const Name = new TypeName("Event");

interface IEventSerialized {
  type: string;
  timestamp: string;
  context: string;
  origin: string;
  id: string;
  corr: string;
  parent: string | null;
}

interface IEvent {
  type: TypeName;
  timestamp: TimeStamp;
  context: ID;
  origin: ID;
  id: ID;
  corr: ID;
  parent: ID | null;
}

export type Event<IsSerialized> = IsSerialized extends Serialized
  ? IEventSerialized
  : IEvent;

const Constructor = (origin: ID, corr?: ID, parent?: ID): Event<null> => {
  return {
    type: Name,
    timestamp: new TimeStamp(),
    context: CONTEXT_ID,
    origin: origin,
    id: new ID(),
    corr: corr ? corr : new ID(),
    parent: parent ? parent : null,
  };
};

const Is = (input: unknown): input is Event<null> => {
  return true;
};

function IsS(input: unknown): input is Event<Serialized> {
  return true;
}

const Deserializer = (input: unknown): IResult => {
  if (IsS(input)) {
    const event = Constructor(
      new ID(input.origin),
      input.corr ? new ID(input.corr) : undefined,
      input.parent ? new ID(input.parent) : undefined
    );
    event.id = new ID(input.id);
    event.timestamp = new TimeStamp(input.timestamp);
    event.context = new ID(input.context);
  }
};

const Serializer = (input: IEvent): IResult => {};

export { TypeName, IEvent, Constructor, Deserializer, Serializer, Is };

type Arguments<T> = T extends (...args: infer A) => any ? A : never;
type Return<T> = T extends (...args: any[]) => infer R ? R : never;

function time<F extends Function>(fn: F, ...args: Arguments<F>): Return<F> {
  console.time();
  const result = fn(...args);
  console.timeEnd();
  return result;
}
time((d: number) => d + 4, 3);

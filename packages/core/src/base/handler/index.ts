import { Either, left } from "fp-ts/lib/Either";
import { UUID, JSON, Type } from "../../values";
import { IEvent } from "../event";
import { Result, IResult } from "../result";

export const PersistEventHandler = <Event extends IEvent>(
  origin: UUID,
  persistEvent: (event: Event) => Promise<Either<IResult<null>, IResult<null>>>,
  isEvent: (input: any) => input is Event,
  eventType?: Type
) => async (event: Event): Promise<Either<IResult<null>, IResult<JSON>>> => {
  if (!isEvent(event)) return left(Result("bad-request", null, origin));
  const toSave = { ...event, type: eventType ? eventType : event.type };
  return persistEvent(toSave);
};

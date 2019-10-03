import {
  UUID,
  OK,
  INTERNAL_SERVER_ERROR,
  JSON,
  Type,
  BAD_REQUEST,
} from "../../values";
import { IEvent } from "../event";
import { Result, IResult } from "../result";

export const PersistEventHandler = <Event extends IEvent>(
  origin: UUID,
  persistEvent: (event: Event) => Promise<void>,
  isEvent: (input: any) => input is Event,
  eventType?: Type
) => async (event: Event): Promise<IResult<JSON>> => {
  if (!isEvent(event)) {
    return Result(null, BAD_REQUEST, origin);
  }
  try {
    const toSave = { ...event, type: eventType ? eventType : event.type };
    await persistEvent(toSave);
    return Result(null, OK, origin, event.corr, event.id);
  } catch (error) {
    return Result(null, INTERNAL_SERVER_ERROR, origin, event.corr, event.id);
  }
};

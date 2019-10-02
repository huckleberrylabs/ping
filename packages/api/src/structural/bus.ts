import { Container } from "inversify";
import {
  JSON,
  UUID,
  INTERNAL_SERVER_ERROR,
  IResult,
  Result,
  IEvent,
  IEventHandler,
} from "@huckleberryai/core";
import { IoC } from "./ioc";

export const Bus = (ioc: Container) => async (
  event: IEvent
): Promise<IResult<JSON>> => {
  const ORIGIN_ID: UUID = "81e59010-9e0b-41b2-b621-7f98248db456";
  let handler: IEventHandler;
  try {
    handler = ioc.get<IEventHandler>(event.type);
  } catch (error) {
    return Result(
      `handler for type ${event.type.toString()} could not be resolved`,
      INTERNAL_SERVER_ERROR,
      ORIGIN_ID,
      event.corr,
      event.id
    );
  }
  return await handler.handle(event);
};

export const bus = Bus(IoC);

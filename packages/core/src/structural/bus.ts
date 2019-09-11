import { Container } from "inversify";
import { IResult, Result } from "../entities/result";
import { UUID, TypeName, INTERNAL_SERVER_ERROR, IData } from "../value-objects";
import { IEvent, IEventHandler } from "../entities/event";

export const HandlerName = TypeName("Handler");

export const Bus = (ioc: Container) => async (
  event: IEvent
): Promise<IResult<IData>> => {
  const ORIGIN_ID = UUID("81e59010-9e0b-41b2-b621-7f98248db456");
  let handler: IEventHandler;
  try {
    handler = ioc.getNamed<IEventHandler>(event.type, HandlerName);
  } catch (error) {
    return Result(
      `handler for type ${event.type.toString()} could not be resolved`,
      HandlerName,
      INTERNAL_SERVER_ERROR,
      ORIGIN_ID,
      event.corr,
      event.id
    );
  }
  return await handler.handle(event);
};
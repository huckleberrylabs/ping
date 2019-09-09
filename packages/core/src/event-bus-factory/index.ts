import { Container } from "inversify";
import { IResult, Result } from "../result";
import { IData, IEventHandler } from "../interfaces";
import { UUID, TypeName, INTERNAL_SERVER_ERROR } from "../value-objects";
import { IEvent } from "../event";

export const HandlerName = TypeName("Handler");

export const EventBusFactory = (ioc: Container) => async (
  event: IEvent
): Promise<IResult<IData>> => {
  const ORIGIN_ID = UUID("81e59010-9e0b-41b2-b621-7f98248db456");
  let handler: IEventHandler;
  try {
    handler = ioc.getNamed<IEventHandler>(event.type, HandlerName);
  } catch (error) {
    return Result(
      `Handler with type ${event.type.toString()} could not be resolved by IoC Container: ${error.toString()}`,
      HandlerName,
      INTERNAL_SERVER_ERROR,
      ORIGIN_ID,
      event.corr,
      event.id
    );
  }
  return await handler.handle(event);
};

import { Container } from "inversify";
import {
  IEvent,
  IEventHandler,
  IResult,
  Result,
  INTERNAL_SERVER_ERROR,
  ID,
} from "@huckleberryai/core";
import { IoCContainer, HANDLER_NAME } from "../ioc-container";

class EventBus {
  public constructor(private container: Container) {}
  public async emit(event: IEvent): Promise<IResult> {
    const ORIGIN_ID = new ID("81e59010-9e0b-41b2-b621-7f98248db456");
    let handler: IEventHandler;
    try {
      handler = this.container.getNamed<IEventHandler>(
        event.type.toSymbol(),
        HANDLER_NAME
      );
    } catch (error) {
      return new Result(
        `Handler with type ${event.type.toString()} could not be resolved by IoC Container: ${error.toString()}`,
        INTERNAL_SERVER_ERROR,
        event.type,
        ORIGIN_ID,
        event.corrID,
        event.id
      );
    }
    return await handler.handle(event);
  }
}

export const bus = new EventBus(IoCContainer);

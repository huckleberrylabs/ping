import { Container } from "inversify";
import { IEvent, IEventHandler } from "@huckleberryai/core";

export const Bus = (container: Container) => async (event: IEvent) => {
  let handler: IEventHandler;
  try {
    handler = container.get<IEventHandler>(event.type);
  } catch (error) {
    return error as Error;
  }
  return await handler.handle(event);
};

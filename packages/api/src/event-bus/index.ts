import { Container } from "inversify";
import {
  IEvent,
  IEventHandler,
  IResult,
  isEvent,
  isResult,
} from "@huckleberryai/core";
import { IoCContainer, HANDLER_NAME } from "../ioc-container";

class EventBus {
  public constructor(private container: Container) {}
  public async emit<Event extends IEvent>(
    event: Event
  ): Promise<IResult | null> {
    const handler = this.container.getNamed<IEventHandler>(
      event.type.toSymbol(),
      HANDLER_NAME
    );
    const output = await handler.handle(event);
    if (output instanceof Array) {
      output.map(event => this.emit(event));
      // The Order of these branches matters, because IResult extends IEvent
    } else if (isResult(output)) {
      return output;
    } else if (isEvent(output)) {
      this.emit(output);
    }
    return null;
  }
}

export const bus = new EventBus(IoCContainer);

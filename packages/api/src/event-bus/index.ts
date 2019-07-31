import { Container } from "inversify";
import { IEvent, IEventHandler, IEventHandlerStatic } from "@huckleberry/core";
import { IoCContainer } from "../ioc-container";

export interface IEventBus {
  register(handler: IEventHandlerStatic): void;
  emit(event: IEvent): Promise<void>;
}

export class EventBus implements IEventBus {
  private container: Container;
  public constructor() {
    this.container = IoCContainer;
  }
  public register(handler: IEventHandlerStatic): void {
    this.container.bind<IEventHandler>(handler.type).to(handler);
  }
  public async emit(event: IEvent): Promise<void> {
    const handlers = this.container.getAll<IEventHandler>(event.type);
    handlers.map(async handler => {
      const output = await handler.handle(event);
      if (Array.isArray(output)) {
        output.map(event => this.emit(event));
      } else if (output) {
        this.emit(output);
      }
    });
  }
}

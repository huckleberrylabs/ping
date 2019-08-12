import {
  ID,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
} from "@huckleberryai/core";
import { HTTPAccessEvent } from "../events";
import { EventRepository } from "../event-repository";
import { injectable } from "inversify";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class HTTPAccessEventHandler implements IEventHandler {
  public id = new ID("b50b7c54-1b4a-426e-9e98-d53d9de2cfad");
  public static type = HTTPAccessEvent.type;
  constructor(private eventRepo: EventRepository) {}
  async handle(event: HTTPAccessEvent) {
    return this.eventRepo.add(event);
  }
}

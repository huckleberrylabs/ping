import {
  ID,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
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
    let status: StatusCode = OK;
    let data;
    try {
      await this.eventRepo.add(event);
    } catch (error) {
      data = error.toString();
      status = INTERNAL_SERVER_ERROR;
    }
    return new Result(
      data,
      status,
      event.type,
      this.id,
      event.corrID,
      event.id
    );
  }
}

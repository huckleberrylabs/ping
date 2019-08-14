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
import { TextWidgetLoadedEvent } from "@huckleberryai/text";
import { EventRepository } from "../event-repository";
import { injectable } from "inversify";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TextWidgetLoadedEventHandler implements IEventHandler {
  public id = new ID("043329cb-bb3f-4912-be84-0c58b2b1a895");
  public static type = TextWidgetLoadedEvent.type;
  constructor(private eventRepo: EventRepository) {}
  async handle(event: TextWidgetLoadedEvent) {
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

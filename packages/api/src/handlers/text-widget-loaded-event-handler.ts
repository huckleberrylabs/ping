import {
  UUID,
  IEventHandler,
  Result,
  IStatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { ITextWidgetLoadedEvent } from "@huckleberryai/text";
import { EventRepository } from "../repositories/event-repository";
import { injectable } from "inversify";

@injectable()
export class TextWidgetLoadedEventHandler implements IEventHandler {
  public id = UUID("043329cb-bb3f-4912-be84-0c58b2b1a895");
  constructor(private eventRepo: EventRepository) {}
  async handle(event: ITextWidgetLoadedEvent) {
    let status: IStatusCode = OK;
    let data;
    try {
      await this.eventRepo.add(event);
    } catch (error) {
      data = error.toString();
      status = INTERNAL_SERVER_ERROR;
    }
    return Result(data, data.type, status, this.id, event.corr, event.id);
  }
}

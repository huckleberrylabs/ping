import {
  UUID,
  IEventHandler,
  Result,
  IStatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { ITextWidgetOpenedCommand } from "@huckleberryai/text";
import { EventRepository } from "../repositories/event-repository";
import { injectable } from "inversify";

@injectable()
export class TextWidgetOpenedCommandHandler implements IEventHandler {
  public id = UUID("6017d44d-63af-4382-9ba8-cf548b3c2ac9");
  constructor(private eventRepo: EventRepository) {}
  async handle(event: ITextWidgetOpenedCommand) {
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

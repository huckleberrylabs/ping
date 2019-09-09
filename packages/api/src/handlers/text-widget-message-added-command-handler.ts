import {
  UUID,
  IEventHandler,
  Result,
  IStatusCode,
  INTERNAL_SERVER_ERROR,
  OK,
} from "@huckleberryai/core";
import { ITextWidgetMessageAddedCommand } from "@huckleberryai/text";
import { EventRepository } from "../repositories/event-repository";
import { injectable } from "inversify";

@injectable()
export class TextWidgetMessageAddedCommandHandler implements IEventHandler {
  public id = UUID("b23c3273-8629-4f69-9cd3-31b0303b3b5e");
  constructor(private eventRepo: EventRepository) {}
  async handle(event: ITextWidgetMessageAddedCommand) {
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

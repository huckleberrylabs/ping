import {
  UUID,
  IEventHandler,
  Result,
  IStatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { ITextWidgetPhoneAddedCommand } from "@huckleberryai/text";
import { EventRepository } from "../repositories/event-repository";
import { injectable } from "inversify";

@injectable()
export class TextWidgetPhoneAddedCommandHandler implements IEventHandler {
  public id = UUID("753ed383-f71c-4eb5-8d28-4f71462611b7");
  constructor(private eventRepo: EventRepository) {}
  async handle(event: ITextWidgetPhoneAddedCommand) {
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

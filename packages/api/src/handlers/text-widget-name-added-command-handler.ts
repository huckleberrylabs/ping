import {
  UUID,
  IEventHandler,
  Result,
  IStatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { ITextWidgetNameAddedCommand } from "@huckleberryai/text";
import { EventRepository } from "../repositories/event-repository";
import { injectable } from "inversify";

@injectable()
export class TextWidgetNameAddedCommandHandler implements IEventHandler {
  public id = UUID("7b12f9ca-404e-49bb-9b97-d8bfe51f4854");
  constructor(private eventRepo: EventRepository) {}
  async handle(event: ITextWidgetNameAddedCommand) {
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

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
import { TextWidgetPhoneAddedCommand } from "@huckleberryai/text";
import { EventRepository } from "../event-repository";
import { injectable } from "inversify";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TextWidgetPhoneAddedCommandHandler implements IEventHandler {
  public id = new ID("753ed383-f71c-4eb5-8d28-4f71462611b7");
  public static type = TextWidgetPhoneAddedCommand.type;
  constructor(private eventRepo: EventRepository) {}
  async handle(event: TextWidgetPhoneAddedCommand) {
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

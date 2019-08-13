import {
  ID,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
  Result,
  StatusCode,
  INTERNAL_SERVER_ERROR,
  OK,
} from "@huckleberryai/core";
import { TextWidgetMessageAddedCommand } from "@huckleberryai/text";
import { EventRepository } from "../event-repository";
import { injectable } from "inversify";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TextWidgetMessageAddedCommandHandler implements IEventHandler {
  public id = new ID("b23c3273-8629-4f69-9cd3-31b0303b3b5e");
  public static type = TextWidgetMessageAddedCommand.type;
  constructor(private eventRepo: EventRepository) {}
  async handle(event: TextWidgetMessageAddedCommand) {
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

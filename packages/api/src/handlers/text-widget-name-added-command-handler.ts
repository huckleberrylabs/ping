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
import { TextWidgetNameAddedCommand } from "@huckleberryai/text";
import { EventRepository } from "../event-repository";
import { injectable } from "inversify";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TextWidgetNameAddedCommandHandler implements IEventHandler {
  public id = new ID("7b12f9ca-404e-49bb-9b97-d8bfe51f4854");
  public static type = TextWidgetNameAddedCommand.type;
  constructor(private eventRepo: EventRepository) {}
  async handle(event: TextWidgetNameAddedCommand) {
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

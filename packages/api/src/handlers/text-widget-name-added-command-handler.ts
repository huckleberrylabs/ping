import {
  ID,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
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
    return this.eventRepo.add(event);
  }
}

import {
  ID,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
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
    return this.eventRepo.add(event);
  }
}

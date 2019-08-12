import {
  ID,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
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
    return this.eventRepo.add(event);
  }
}

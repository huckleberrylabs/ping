import {
  ID,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
} from "@huckleberryai/core";
import { TextWidgetOpenedCommand } from "@huckleberryai/text";
import { EventRepository } from "../event-repository";
import { injectable } from "inversify";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TextWidgetOpenedCommandHandler implements IEventHandler {
  public id = new ID("6017d44d-63af-4382-9ba8-cf548b3c2ac9");
  public static type = TextWidgetOpenedCommand.type;
  constructor(private eventRepo: EventRepository) {}
  async handle(event: TextWidgetOpenedCommand) {
    return this.eventRepo.add(event);
  }
}

import { injectable } from "inversify";
import { IEventHandler, PersistEventHandler } from "@huckleberryai/core";
import {
  IWidgetCreateMessageCommand,
  IsWidgetCreateMessageCommand,
} from "./command";
import { WidgetMessageCreatedEventType } from "./event";
import { IWidgetMessageRepository } from "../../../interfaces";

@injectable()
export class WidgetCreateMessageCommandHandler implements IEventHandler {
  constructor(private repository: IWidgetMessageRepository) {}
  handle = PersistEventHandler<IWidgetCreateMessageCommand>(
    "6017d44d-63af-4382-9ba8-cf548b3c2ac9",
    this.repository.add,
    IsWidgetCreateMessageCommand,
    WidgetMessageCreatedEventType
  );
}

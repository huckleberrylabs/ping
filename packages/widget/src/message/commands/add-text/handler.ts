import { injectable } from "inversify";
import { IEventHandler, PersistEventHandler } from "@huckleberryai/core";
import {
  IWidgetAddTextToMessageCommand,
  IsWidgetAddTextToMessageCommand,
} from "./command";
import { WidgetTextAddedToMessageEventType } from "./event";
import { IWidgetMessageRepository } from "../../../interfaces";

@injectable()
export class WidgetAddTextToMessageCommandHandler implements IEventHandler {
  constructor(private repository: IWidgetMessageRepository) {}
  handle = PersistEventHandler<IWidgetAddTextToMessageCommand>(
    "b23c3273-8629-4f69-9cd3-31b0303b3b5e",
    this.repository.add,
    IsWidgetAddTextToMessageCommand,
    WidgetTextAddedToMessageEventType
  );
}

import { injectable } from "inversify";
import { IEventHandler, PersistEventHandler } from "@huckleberryai/core";
import {
  IWidgetAddNameToMessageCommand,
  IsWidgetAddNameToMessageCommand,
} from "./command";
import { WidgetNameAddedToMessageEventType } from "./event";
import { IWidgetMessageRepository } from "../../../interfaces";

@injectable()
export class WidgetAddNameToMessageCommandHandler implements IEventHandler {
  constructor(private repository: IWidgetMessageRepository) {}
  handle = PersistEventHandler<IWidgetAddNameToMessageCommand>(
    "7b12f9ca-404e-49bb-9b97-d8bfe51f4854",
    this.repository.add,
    IsWidgetAddNameToMessageCommand,
    WidgetNameAddedToMessageEventType
  );
}

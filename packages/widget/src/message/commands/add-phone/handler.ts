import { injectable, inject } from "inversify";
import { IEventHandler, PersistEventHandler } from "@huckleberryai/core";
import {
  IWidgetAddPhoneToMessageCommand,
  IsWidgetAddPhoneToMessageCommand,
} from "./command";
import { WidgetPhoneAddedToMessageEventType } from "./event";
import {
  IWidgetMessageRepository,
  WidgetMessageRepositoryType,
} from "../../../interfaces";

@injectable()
export class WidgetAddPhoneToMessageCommandHandler implements IEventHandler {
  constructor(
    @inject(WidgetMessageRepositoryType)
    private repository: IWidgetMessageRepository
  ) {}
  handle = PersistEventHandler<IWidgetAddPhoneToMessageCommand>(
    "753ed383-f71c-4eb5-8d28-4f71462611b7",
    this.repository.add,
    IsWidgetAddPhoneToMessageCommand,
    WidgetPhoneAddedToMessageEventType
  );
}

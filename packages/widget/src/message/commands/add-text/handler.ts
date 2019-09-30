import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  StatusCode,
  INTERNAL_SERVER_ERROR,
  OK,
  IEventRepository,
} from "@huckleberryai/core";
import { IAddTextToWidgetMessageCommand } from "./command";

@injectable()
export class TextWidgetMessageAddedCommandHandler implements IEventHandler {
  public origin = "b23c3273-8629-4f69-9cd3-31b0303b3b5e";
  constructor(private repository: IEventRepository) {}
  async handle(event: IAddTextToWidgetMessageCommand) {
    let status: StatusCode = OK;
    let data = null;
    try {
      await this.repository.add(event);
    } catch (error) {
      data = error.toString();
      status = INTERNAL_SERVER_ERROR;
    }
    return Result(data, status, this.origin, event.corr, event.id);
  }
}

import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
  IEventRepository,
} from "@huckleberryai/core";
import { IAddNameToWidgetMessageCommand } from "./command";

@injectable()
export class AddNameToWidgetMessageCommandHandler implements IEventHandler {
  public origin = "7b12f9ca-404e-49bb-9b97-d8bfe51f4854";
  constructor(private repository: IEventRepository) {}
  async handle(event: IAddNameToWidgetMessageCommand) {
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

import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
  IEventRepository,
} from "@huckleberryai/core";
import { ICreateTextWidgetMessageCommand } from "./command";

@injectable()
export class CreateTextWidgetMessageCommandHandler implements IEventHandler {
  public origin = "6017d44d-63af-4382-9ba8-cf548b3c2ac9";
  constructor(private repository: IEventRepository) {}
  async handle(event: ICreateTextWidgetMessageCommand) {
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

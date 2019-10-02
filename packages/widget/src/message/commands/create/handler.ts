import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
  IEventRepository,
} from "@huckleberryai/core";
import { ICreateWidgetMessageCommand } from "./command";

@injectable()
export class CreateWidgetMessageCommandHandler implements IEventHandler {
  constructor(private repository: IEventRepository) {}
  async handle(event: ICreateWidgetMessageCommand) {
    const origin = "6017d44d-63af-4382-9ba8-cf548b3c2ac9";
    let status: StatusCode = OK;
    let data = null;
    try {
      await this.repository.add(event);
    } catch (error) {
      data = error.toString();
      status = INTERNAL_SERVER_ERROR;
    }
    return Result(data, status, origin, event.corr, event.id);
  }
}

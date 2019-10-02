import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
  IEventRepository,
  IEvent,
  IResult,
  JSON,
} from "@huckleberryai/core";
import { IAddNameToWidgetMessageCommand } from "./command";

type SaveEvent = (event: IEvent) => Promise<void>;

export const Handler = (saveEvent: SaveEvent) => async (
  event: IAddNameToWidgetMessageCommand
): Promise<IResult<JSON>> => {
  const origin = "7b12f9ca-404e-49bb-9b97-d8bfe51f4854";
  let status: StatusCode = OK;
  let data = null;
  try {
    await saveEvent(event);
  } catch (error) {
    data = error.toString();
    status = INTERNAL_SERVER_ERROR;
  }
  return Result(data, status, origin, event.corr, event.id);
};

@injectable()
export class AddNameToWidgetMessageCommandHandler implements IEventHandler {
  constructor(private repository: IEventRepository) {}
  async handle(event: IAddNameToWidgetMessageCommand) {
    const origin = "7b12f9ca-404e-49bb-9b97-d8bfe51f4854";
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

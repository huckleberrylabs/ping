import {
  IEventHandler,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
  IRepository
} from "@huckleberryai/core";
import { IClientLoadedEvent } from "@huckleberryai/widget";
import { injectable } from "inversify";

@injectable()
export class ClientLoadedEventHandler implements IEventHandler {
  public id = "043329cb-bb3f-4912-be84-0c58b2b1a895";
  constructor(private repository: IRepository) {}
  async handle(event: IClientLoadedEvent) {
    let status: StatusCode = OK;
    let data;
    try {
      await this.repository.add(event);
    } catch (error) {
      data = error.toString();
      status = INTERNAL_SERVER_ERROR;
    }
    return Result(data, status, this.id, event.corr, event.id);
  }
}

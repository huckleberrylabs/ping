import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
  IEventRepository
} from "@huckleberryai/core";
import { IClientLoadedEvent } from "./event";

@injectable()
export class ClientLoadedEventHandler implements IEventHandler {
  public origin = "043329cb-bb3f-4912-be84-0c58b2b1a895";
  constructor(private repository: IEventRepository) {}
  async handle(event: IClientLoadedEvent) {
    let status: StatusCode = OK;
    let data = null;
    try {
      await this.repository.add(event);
    } catch (error) {
      data = error.toString();
      status = INTERNAL_SERVER_ERROR;
    }
    return Result(data, status, this.id, event.corr, event.id);
  }
}

import { injectable } from "inversify";
import {
  IEventHandler,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
  IEventRepository
} from "@huckleberryai/core";
import { IHTTPAccessEvent } from "../events";

@injectable()
export class HTTPAccessEventHandler implements IEventHandler {
  public origin = "b50b7c54-1b4a-426e-9e98-d53d9de2cfad";
  constructor(private repository: IEventRepository) {}
  async handle(event: IHTTPAccessEvent) {
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

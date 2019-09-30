import {
  IEventHandler,
  Result,
  StatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
  IRepository
} from "@huckleberryai/core";
import { IHTTPAccessEvent } from "../events";
import { injectable } from "inversify";

@injectable()
export class HTTPAccessEventHandler implements IEventHandler {
  public id = "b50b7c54-1b4a-426e-9e98-d53d9de2cfad";
  constructor(private repository: IRepository) {}
  async handle(event: IHTTPAccessEvent) {
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

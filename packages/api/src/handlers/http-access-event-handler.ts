import {
  UUID,
  IEventHandler,
  Result,
  IStatusCode,
  OK,
  INTERNAL_SERVER_ERROR,
} from "@huckleberryai/core";
import { IHTTPAccessEvent } from "../events";
import { EventRepository } from "../repositories/event-repository";
import { injectable } from "inversify";

@injectable()
export class HTTPAccessEventHandler implements IEventHandler {
  public id = UUID("b50b7c54-1b4a-426e-9e98-d53d9de2cfad");
  constructor(private eventRepo: EventRepository) {}
  async handle(event: IHTTPAccessEvent) {
    let status: IStatusCode = OK;
    let data;
    try {
      await this.eventRepo.add(event);
    } catch (error) {
      data = error.toString();
      status = INTERNAL_SERVER_ERROR;
    }
    return Result(data, data.type, status, this.id, event.corr, event.id);
  }
}

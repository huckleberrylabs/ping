import { ID } from "../id";
import { CONTEXT_ID } from "../context";
import { Event } from "../event";
import { IEventHandler } from "../interfaces";

export const EventHandler: IEventHandler<Event> = {
  type: Event.type,
  nodeID: new ID(),
  contextID: CONTEXT_ID,
  async handle(event: Event): Promise<void> {},
};

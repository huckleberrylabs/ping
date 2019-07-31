import { ID } from "../id";
import { TimeStamp } from "../timestamp";
import { CONTEXT_ID } from "../context";
import { IEvent, IEventStatic } from "../interfaces";
import { staticImplements } from "../helpers";

const EventType = Symbol.for("Event");

@staticImplements<IEventStatic>()
export class Event implements IEvent {
  public id: ID;
  public timestamp: TimeStamp;
  public nodeID: ID;
  public corrID: ID;
  public parentID?: ID;
  constructor(nodeID: ID, corrID?: ID, parentID?: ID) {
    this.id = new ID();
    this.timestamp = new TimeStamp();
    this.nodeID = nodeID;
    if (corrID) {
      this.corrID = corrID;
    } else {
      this.corrID = new ID();
    }
    this.parentID = parentID;
  }
  public get type(): symbol {
    return EventType;
  }
  public static get type(): symbol {
    return EventType;
  }
  public get contextID(): ID {
    return CONTEXT_ID;
  }
  public static get contextID(): ID {
    return CONTEXT_ID;
  }
}

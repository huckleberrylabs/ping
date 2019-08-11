import { ID } from "../id";
import { Type } from "../type";
import { TimeStamp } from "../timestamp";
import { CONTEXT_ID } from "../context";
import { IEvent, IEventStatic } from "../interfaces";
import { staticImplements } from "../helpers";

@staticImplements<IEventStatic>()
export class Event implements IEvent {
  public id: ID;
  public timestamp: TimeStamp;
  public originID: ID;
  public corrID: ID;
  public parentID?: ID;
  private _contextID: ID = CONTEXT_ID;
  constructor(originID: ID, corrID?: ID, parentID?: ID) {
    this.id = new ID();
    this.timestamp = new TimeStamp();
    this.originID = originID;
    if (corrID) {
      this.corrID = corrID;
    } else {
      this.corrID = new ID();
    }
    this.parentID = parentID;
  }
  public get type() {
    return Event.type;
  }
  public static get type() {
    return new Type("Event");
  }
  public get contextID() {
    return this._contextID;
  }
  public set contextID(id: ID) {
    this._contextID = id;
  }
  public toJSON() {
    return this;
  }
  public static fromJSON(json: any): Event {
    const event = new Event(
      new ID(json.originID),
      json.corrID ? new ID(json.corrID) : undefined,
      json.parentID ? new ID(json.parentID) : undefined
    );
    event.id = new ID(json.id);
    event.timestamp = new TimeStamp(json.timestamp);
    event.contextID = new ID(json.contextID);
    return event;
  }
}

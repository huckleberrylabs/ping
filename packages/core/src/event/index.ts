import { ID } from "../id";
import { TypeName } from "../type-name";
import { TimeStamp } from "../timestamp";
import { CONTEXT_ID } from "../context";
import { IEvent, IEventStatic } from "../interfaces";
import { staticImplements } from "../helpers";

@staticImplements<IEventStatic>()
export class Event implements IEvent {
  public timestamp: TimeStamp;
  public id: ID;
  public originID: ID;
  public corrID: ID;
  public parentID?: ID;
  protected _contextID: ID;
  constructor(originID: ID, corrID?: ID, parentID?: ID) {
    this.timestamp = new TimeStamp();
    this.id = new ID();
    this.originID = originID;
    this.corrID = corrID ? corrID : new ID();
    this.parentID = parentID;
    this._contextID = CONTEXT_ID;
  }
  public get type() {
    return Event.type;
  }
  public static get type() {
    return new TypeName("Event");
  }
  public get contextID() {
    return this._contextID;
  }
  public set contextID(id: ID) {
    this._contextID = id;
  }
  public toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      originID: this.originID,
      corrID: this.corrID,
      parentID: this.parentID,
      contextID: this.contextID,
      type: this.type,
    };
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

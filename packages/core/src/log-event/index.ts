import { ID } from "../id";
import { Event } from "../event";
import { TimeStamp } from "../timestamp";
import { TypeName } from "../type-name";

export type LOG_LEVELS = "critical" | "error" | "debug" | "info";

export type LOG_LABELS = LOG_LEVELS | "text-widget";

export class LogEvent extends Event {
  public labels: LOG_LABELS[];
  public message: string;
  constructor(
    message: string,
    labels: LOG_LABELS[],
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(originID, corrID, parentID);
    this.message = message;
    this.labels = labels;
  }
  public get type() {
    return LogEvent.type;
  }
  public static get type() {
    return new TypeName("LogEvent");
  }
  public toJSON() {
    return {
      timestamp: this.timestamp,
      id: this.id,
      originID: this.originID,
      corrID: this.corrID,
      parentID: this.parentID,
      contextID: this.contextID,
      type: this.type,
      message: this.message,
      labels: this.labels,
    };
  }
  public static fromJSON(json: any): LogEvent {
    const event = new LogEvent(
      json.message,
      json.labels,
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

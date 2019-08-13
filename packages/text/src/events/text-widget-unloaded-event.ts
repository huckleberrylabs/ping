import { ID, Type, Event, TimeStamp, Log } from "@huckleberryai/core";

export class TextWidgetUnloadedEvent extends Event {
  public log: Log;
  public widgetID: ID | undefined;
  constructor(
    log: Log,
    widgetID: ID | undefined,
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(originID, corrID, parentID);
    this.log = log;
    this.widgetID = widgetID;
  }
  public get type() {
    return TextWidgetUnloadedEvent.type;
  }
  public static get type() {
    return new Type("TextWidgetUnloadedEvent");
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
      log: this.log,
      widgetID: this.widgetID,
    };
  }
  public static fromJSON(json: any): TextWidgetUnloadedEvent {
    const event = new TextWidgetUnloadedEvent(
      Log.fromJSON(json.log),
      json.widgetID ? new ID(json.widgetID) : undefined,
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

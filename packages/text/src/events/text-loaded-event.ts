import { ID, Type, Event, TimeStamp } from "@huckleberryai/core";

export class TextWidgetLoadedEvent extends Event {
  public widgetID: ID;
  constructor(widgetID: ID, originID: ID, corrID?: ID, parentID?: ID) {
    super(originID, corrID, parentID);
    this.widgetID = widgetID;
  }
  public get type() {
    return TextWidgetLoadedEvent.type;
  }
  public static get type() {
    return new Type("TextWidgetLoadedEvent");
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
      widgetID: this.widgetID,
    };
  }
  public static fromJSON(json: any): TextWidgetLoadedEvent {
    const event = new TextWidgetLoadedEvent(
      new ID(json.widgetID),
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

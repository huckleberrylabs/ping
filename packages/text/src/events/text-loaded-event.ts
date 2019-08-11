import { ID, Type, Event, TimeStamp } from "@huckleberry/core";

export class TextWidgetLoadedEvent extends Event {
  public appID: ID;
  constructor(appID: ID, originID: ID, corrID?: ID, parentID?: ID) {
    super(originID, corrID, parentID);
    this.appID = appID;
  }
  public get type() {
    return TextWidgetLoadedEvent.type;
  }
  public static get type() {
    return new Type("TextWidgetLoadedEvent");
  }
  public static fromJSON(json: any): TextWidgetLoadedEvent {
    const event = new TextWidgetLoadedEvent(
      new ID(json.appID),
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

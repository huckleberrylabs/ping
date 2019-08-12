import { ID, Type, Query, TimeStamp } from "@huckleberryai/core";

export class TextWidgetSettingsQuery extends Query {
  public widgetID: ID;
  constructor(
    widgetID: ID,
    agentID: ID,
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(agentID, originID, corrID, parentID);
    this.widgetID = widgetID;
  }
  public get type() {
    return TextWidgetSettingsQuery.type;
  }
  public static get type() {
    return new Type("TextWidgetSettingsQuery");
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
      agentID: this.agentID,
      widgetID: this.widgetID,
    };
  }
  public static fromJSON(json: any): TextWidgetSettingsQuery {
    const query = new TextWidgetSettingsQuery(
      new ID(json.widgetID),
      new ID(json.agentID),
      new ID(json.originID),
      json.corrID ? new ID(json.corrID) : undefined,
      json.parentID ? new ID(json.parentID) : undefined
    );
    query.id = new ID(json.id);
    query.timestamp = new TimeStamp(json.timestamp);
    query.contextID = new ID(json.contextID);
    return query;
  }
}

import { ID, Type, Query, TimeStamp } from "@huckleberry/core";

export class TextWidgetSettingsQuery extends Query {
  public appID: ID;
  constructor(
    appID: ID,
    agentID: ID,
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(agentID, originID, corrID, parentID);
    this.appID = appID;
  }
  public get type() {
    return TextWidgetSettingsQuery.type;
  }
  public static get type() {
    return new Type("TextWidgetSettingsQuery");
  }
  public static fromJSON(json: any): TextWidgetSettingsQuery {
    const query = new TextWidgetSettingsQuery(
      new ID(json.appID),
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

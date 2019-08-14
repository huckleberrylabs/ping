import { ID } from "../id";
import { Type } from "../type";
import { Event } from "../event";
import { TimeStamp } from "../timestamp";

export class Query extends Event {
  public agentID: ID;
  constructor(agentID: ID, originID: ID, corrID?: ID, parentID?: ID) {
    super(originID, corrID, parentID);
    this.agentID = agentID;
  }
  public get type() {
    return Query.type;
  }
  public static get type() {
    return new Type("Query");
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
    };
  }
  public static fromJSON(json: any): Query {
    const query = new Query(
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

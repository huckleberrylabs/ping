import { ID } from "../id";
import { Event } from "../event";

const QueryType = Symbol.for("Query");

export class Query extends Event {
  public agentID: ID;
  constructor(agentID: ID, nodeID: ID, corrID?: ID, parentID?: ID) {
    super(nodeID, corrID, parentID);
    this.agentID = agentID;
  }
  public get type(): symbol {
    return QueryType;
  }
  public static get type(): symbol {
    return QueryType;
  }
}

import { ID } from "../id";
import { Event } from "../event";

const CommandType = Symbol.for("Command");

export class Command extends Event {
  public agentID: ID;
  constructor(agentID: ID, nodeID: ID, corrID?: ID, parentID?: ID) {
    super(nodeID, corrID, parentID);
    this.agentID = agentID;
  }
  public get type(): symbol {
    return CommandType;
  }
  public static get type(): symbol {
    return CommandType;
  }
}

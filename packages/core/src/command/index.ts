import { ID } from "../id";
import { TypeName } from "../type-name";
import { Event } from "../event";
import { TimeStamp } from "../timestamp";

export class Command extends Event {
  public agentID: ID;
  constructor(agentID: ID, originID: ID, corrID?: ID, parentID?: ID) {
    super(originID, corrID, parentID);
    this.agentID = agentID;
  }
  public get type() {
    return Command.type;
  }
  public static get type() {
    return new TypeName("Command");
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
  public static fromJSON(json: any): Command {
    const command = new Command(
      new ID(json.agentID),
      new ID(json.originID),
      json.corrID ? new ID(json.corrID) : undefined,
      json.parentID ? new ID(json.parentID) : undefined
    );
    command.id = new ID(json.id);
    command.timestamp = new TimeStamp(json.timestamp);
    command.contextID = new ID(json.contextID);
    return command;
  }
}

import { ID, Type, Command, TimeStamp } from "@huckleberry/core";

export class TextWidgetOpenedCommand extends Command {
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
    return TextWidgetOpenedCommand.type;
  }
  public static get type() {
    return new Type("TextWidgetOpenedCommand");
  }
  public static fromJSON(json: any): TextWidgetOpenedCommand {
    const command = new TextWidgetOpenedCommand(
      new ID(json.appID),
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

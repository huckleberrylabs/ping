import { ID, Type, Command, TimeStamp } from "@huckleberry/core";

export class TextWidgetMessageAddedCommand extends Command {
  public message: string;
  public appID: ID;
  constructor(
    message: string,
    appID: ID,
    agentID: ID,
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(agentID, originID, corrID, parentID);
    this.message = message;
    this.appID = appID;
  }
  public get type() {
    return TextWidgetMessageAddedCommand.type;
  }
  public static get type() {
    return new Type("TextWidgetMessageAddedCommand");
  }
  public static fromJSON(json: any): TextWidgetMessageAddedCommand {
    const command = new TextWidgetMessageAddedCommand(
      json.message,
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

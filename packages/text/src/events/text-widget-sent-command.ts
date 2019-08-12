import { ID, Type, Command, TimeStamp } from "@huckleberryai/core";

export class TextWidgetSentCommand extends Command {
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
    return TextWidgetSentCommand.type;
  }
  public static get type() {
    return new Type("TextWidgetSentCommand");
  }
  public static fromJSON(json: any): TextWidgetSentCommand {
    const command = new TextWidgetSentCommand(
      new ID(json.widgetID),
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
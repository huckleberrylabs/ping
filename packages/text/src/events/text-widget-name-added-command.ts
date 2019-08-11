import { ID, Type, Command, TimeStamp } from "@huckleberry/core";

export class TextWidgetNameAddedCommand extends Command {
  public name: string;
  public widgetID: ID;
  constructor(
    name: string,
    widgetID: ID,
    agentID: ID,
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(agentID, originID, corrID, parentID);
    this.name = name;
    this.widgetID = widgetID;
  }
  public get type() {
    return TextWidgetNameAddedCommand.type;
  }
  public static get type() {
    return new Type("TextWidgetNameAddedCommand");
  }
  public static fromJSON(json: any): TextWidgetNameAddedCommand {
    const command = new TextWidgetNameAddedCommand(
      json.name,
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

import { ID, Type, Command, TimeStamp } from "@huckleberryai/core";

export class TextWidgetOpenedCommand extends Command {
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
    return TextWidgetOpenedCommand.type;
  }
  public static get type() {
    return new Type("TextWidgetOpenedCommand");
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
      widgetID: this.widgetID,
    };
  }
  public static fromJSON(json: any): TextWidgetOpenedCommand {
    const command = new TextWidgetOpenedCommand(
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

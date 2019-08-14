import { ID, Type, Command, TimeStamp } from "@huckleberryai/core";

export class TextWidgetMessageAddedCommand extends Command {
  public message: string;
  public widgetID: ID;
  constructor(
    message: string,
    widgetID: ID,
    agentID: ID,
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(agentID, originID, corrID, parentID);
    this.message = message;
    this.widgetID = widgetID;
  }
  public get type() {
    return TextWidgetMessageAddedCommand.type;
  }
  public static get type() {
    return new Type("TextWidgetMessageAddedCommand");
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
      widgetID: this.widgetID,
      message: this.message,
    };
  }
  public static fromJSON(json: any): TextWidgetMessageAddedCommand {
    const command = new TextWidgetMessageAddedCommand(
      json.message,
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

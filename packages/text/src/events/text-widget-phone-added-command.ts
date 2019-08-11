import { ID, Type, Command, TimeStamp } from "@huckleberry/core";

export class TextWidgetPhoneAddedCommand extends Command {
  public phone: string;
  public widgetID: ID;
  constructor(
    phone: string,
    widgetID: ID,
    agentID: ID,
    originID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(agentID, originID, corrID, parentID);
    this.phone = phone;
    this.widgetID = widgetID;
  }
  public get type() {
    return TextWidgetPhoneAddedCommand.type;
  }
  public static get type() {
    return new Type("TextWidgetPhoneAddedCommand");
  }
  public static fromJSON(json: any): TextWidgetPhoneAddedCommand {
    const command = new TextWidgetPhoneAddedCommand(
      json.phone,
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

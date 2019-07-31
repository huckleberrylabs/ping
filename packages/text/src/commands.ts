import { ID, Command } from "@huckleberry/core";

const TextAppOpenedCommandType = Symbol.for("TextAppOpenedCommand");
export class TextAppOpenedCommand extends Command {
  public appID: ID;
  constructor(appID: ID, agentID: ID, nodeID: ID, corrID?: ID, parentID?: ID) {
    super(agentID, nodeID, corrID, parentID);
    this.appID = appID;
  }
  public get type(): symbol {
    return TextAppOpenedCommandType;
  }
  public static get type(): symbol {
    return TextAppOpenedCommandType;
  }
}

const TextAppMessageAddedCommandType = Symbol.for("TextAppMessageAddedCommand");
export class TextAppMessageAddedCommand extends Command {
  public message: string;
  public appID: ID;
  constructor(
    message: string,
    appID: ID,
    agentID: ID,
    nodeID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(agentID, nodeID, corrID, parentID);
    this.message = message;
    this.appID = appID;
  }
  public get type(): symbol {
    return TextAppMessageAddedCommandType;
  }
  public static get type(): symbol {
    return TextAppMessageAddedCommandType;
  }
}

const TextAppPhoneAddedCommandType = Symbol.for("TextAppPhoneAddedCommand");
export class TextAppPhoneAddedCommand extends Command {
  public phone: string;
  public appID: ID;
  constructor(
    phone: string,
    appID: ID,
    agentID: ID,
    nodeID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(agentID, nodeID, corrID, parentID);
    this.phone = phone;
    this.appID = appID;
  }
  public get type(): symbol {
    return TextAppPhoneAddedCommandType;
  }
  public static get type(): symbol {
    return TextAppPhoneAddedCommandType;
  }
}

const TextAppNameAddedCommandType = Symbol.for("TextAppNameAddedCommand");
export class TextAppNameAddedCommand extends Command {
  public name: string;
  public appID: ID;
  constructor(
    name: string,
    appID: ID,
    agentID: ID,
    nodeID: ID,
    corrID?: ID,
    parentID?: ID
  ) {
    super(agentID, nodeID, corrID, parentID);
    this.name = name;
    this.appID = appID;
  }
  public get type(): symbol {
    return TextAppNameAddedCommandType;
  }
  public static get type(): symbol {
    return TextAppNameAddedCommandType;
  }
}

const TextAppSentCommandType = Symbol.for("TextAppSentCommand");
export class TextAppSentCommand extends Command {
  public appID: ID;
  constructor(appID: ID, agentID: ID, nodeID: ID, corrID?: ID, parentID?: ID) {
    super(agentID, nodeID, corrID, parentID);
    this.appID = appID;
  }
  public get type(): symbol {
    return TextAppSentCommandType;
  }
  public static get type(): symbol {
    return TextAppSentCommandType;
  }
}

import { Action } from "../base";

const WidgetOpenedActionType = Symbol("WidgetOpenedAction");
export class WidgetOpenedAction extends Action {
  public get type(): symbol {
    return WidgetOpenedActionType;
  }
  public static get type(): symbol {
    return WidgetOpenedActionType;
  }
}

const WidgetMessageAddedActionType = Symbol("WidgetMessageAddedAction");
export class WidgetMessageAddedAction extends Action {
  public message: string;
  constructor(
    nodeID: string,
    corrID: string | undefined,
    parentID: string | undefined,
    appID: string,
    agentID: string,
    message: string
  ) {
    super(nodeID, corrID, parentID, appID, agentID);
    this.message = message;
  }
  public get type(): symbol {
    return WidgetMessageAddedActionType;
  }
  public static get type(): symbol {
    return WidgetMessageAddedActionType;
  }
}

const WidgetPhoneAddedActionType = Symbol("WidgetPhoneAddedAction");
export class WidgetPhoneAddedAction extends Action {
  public phone: string;
  constructor(
    nodeID: string,
    corrID: string | undefined,
    parentID: string | undefined,
    appID: string,
    agentID: string,
    phone: string
  ) {
    super(nodeID, corrID, parentID, appID, agentID);
    this.phone = phone;
  }
  public get type(): symbol {
    return WidgetPhoneAddedActionType;
  }
  public static get type(): symbol {
    return WidgetPhoneAddedActionType;
  }
}

const WidgetNameAddedActionType = Symbol("WidgetNameAddedAction");
export class WidgetNameAddedAction extends Action {
  public name: string;
  constructor(
    nodeID: string,
    corrID: string | undefined,
    parentID: string | undefined,
    appID: string,
    agentID: string,
    name: string
  ) {
    super(nodeID, corrID, parentID, appID, agentID);
    this.name = name;
  }
  public get type(): symbol {
    return WidgetNameAddedActionType;
  }
  public static get type(): symbol {
    return WidgetNameAddedActionType;
  }
}

const WidgetSentActionType = Symbol("WidgetSentAction");
export class WidgetSentAction extends Action {
  public get type(): symbol {
    return WidgetSentActionType;
  }
  public static get type(): symbol {
    return WidgetSentActionType;
  }
}

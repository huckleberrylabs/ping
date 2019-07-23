import uuid from "uuid/v4";
import moment from "moment";
import { CONTEXT_ID } from "../config";
import { staticImplements } from "../helpers";
import { IEvent, IEventStatic } from "../interfaces";

const EventType = Symbol("Event");
@staticImplements<IEventStatic>()
export class Event implements IEvent {
  public id: string;
  public timestamp: string;
  public nodeID: string;
  public corrID: string;
  public parentID: string | undefined;
  public appID: string | undefined;
  constructor(
    nodeID: string,
    corrID: string | undefined,
    parentID: string | undefined,
    appID: string
  ) {
    this.id = uuid();
    this.timestamp = moment().toISOString();
    this.nodeID = nodeID;
    if (!corrID) {
      this.corrID = uuid();
    } else {
      this.corrID = corrID;
    }
    this.parentID = parentID;
    this.appID = appID;
  }
  public get type(): symbol {
    return EventType;
  }
  public static get type(): symbol {
    return EventType;
  }
  public get contextID(): string {
    return CONTEXT_ID;
  }
  public static get contextID(): string {
    return CONTEXT_ID;
  }
}

const ActionType = Symbol("Action");
export class Action extends Event {
  public agentID: string;
  constructor(
    nodeID: string,
    corrID: string | undefined,
    parentID: string | undefined,
    appID: string,
    agentID: string
  ) {
    super(nodeID, corrID, parentID, appID);
    this.agentID = agentID;
  }
  public get type(): symbol {
    return ActionType;
  }
  public static get type(): symbol {
    return ActionType;
  }
}

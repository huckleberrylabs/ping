import uuid from "uuid/v4";
import { Event, Action } from "../base";

const ReminderCreateActionType = Symbol("ReminderCreateAction");
export class ReminderCreateAction extends Action {
  public jobID: string;
  public events: Event[];
  public schedule: string;
  public timezone: string;
  public disabled: boolean = false;
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    events: Event[],
    schedule: string,
    timezone: string,
    disabled?: boolean
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.jobID = uuid();
    this.events = events;
    this.schedule = schedule;
    this.timezone = timezone;
    if (disabled) {
      this.disabled = disabled;
    }
  }
  public get type(): symbol {
    return ReminderCreateActionType;
  }
  public static get type(): symbol {
    return ReminderCreateActionType;
  }
}

const ReminderStartActionType = Symbol("ReminderStartAction");
export class ReminderStartAction extends Action {
  public jobID: string;
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    jobID: string
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.jobID = jobID;
  }
  public get type(): symbol {
    return ReminderStartActionType;
  }
  public static get type(): symbol {
    return ReminderStartActionType;
  }
}

const ReminderPauseActionType = Symbol("ReminderPauseAction");
export class ReminderPauseAction extends Action {
  public jobID: string;
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    jobID: string
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.jobID = jobID;
  }
  public get type(): symbol {
    return ReminderPauseActionType;
  }
  public static get type(): symbol {
    return ReminderPauseActionType;
  }
}

const ReminderCancelActionType = Symbol("ReminderCancelAction");
export class ReminderCancelAction extends Action {
  public jobID: string;
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    jobID: string
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.jobID = jobID;
  }
  public get type(): symbol {
    return ReminderCancelActionType;
  }
  public static get type(): symbol {
    return ReminderCancelActionType;
  }
}

const ReminderRescheduleActionType = Symbol("ReminderRescheduleAction");
export class ReminderRescheduleAction extends Action {
  public jobID: string;
  public schedule: string;
  public timezone: string;
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    jobID: string,
    schedule: string,
    timezone: string
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.jobID = jobID;
    this.schedule = schedule;
    this.timezone = timezone;
  }
  public get type(): symbol {
    return ReminderRescheduleActionType;
  }
  public static get type(): symbol {
    return ReminderRescheduleActionType;
  }
}

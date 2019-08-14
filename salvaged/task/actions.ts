import uuid from "uuid/v4";
import { Action } from "../base";

const TaskCreateActionType = Symbol("TaskCreateAction");
export class TaskCreateAction extends Action {
  public taskID: string;
  public typeID: string;
  public policyIDs: string[];
  public schedule?: {
    deadline?: string;
    string?: string;
    timezone?: string;
  };
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    typeID: string,
    policyIDs: string[],
    schedule?: {
      deadline?: string;
      string?: string;
      timezone?: string;
    }
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.taskID = uuid();
    this.typeID = typeID;
    this.policyIDs = policyIDs;
    this.schedule = schedule;
  }
  public get type(): symbol {
    return TaskCreateActionType;
  }
  public static get type(): symbol {
    return TaskCreateActionType;
  }
}

const TaskStartActionType = Symbol("TaskStartAction");
export class TaskStartAction extends Action {
  public taskID: string;
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    taskID: string
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.taskID = taskID;
  }
  public get type(): symbol {
    return TaskStartActionType;
  }
  public static get type(): symbol {
    return TaskStartActionType;
  }
}

const TaskPauseActionType = Symbol("TaskPauseAction");
export class TaskPauseAction extends Action {
  public taskID: string;
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    taskID: string
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.taskID = taskID;
  }
  public get type(): symbol {
    return TaskPauseActionType;
  }
  public static get type(): symbol {
    return TaskPauseActionType;
  }
}

const TaskCancelActionType = Symbol("TaskCancelAction");
export class TaskCancelAction extends Action {
  public taskID: string;
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    taskID: string
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.taskID = taskID;
  }
  public get type(): symbol {
    return TaskCancelActionType;
  }
  public static get type(): symbol {
    return TaskCancelActionType;
  }
}

const TaskRescheduleActionType = Symbol("TaskRescheduleAction");
export class TaskRescheduleAction extends Action {
  public taskID: string;
  public schedule?: {
    deadline?: string;
    string?: string;
    timezone?: string;
  };
  constructor(
    nodeID: string,
    agentID: string,
    corrID: string,
    parentID: string,
    taskID: string,
    schedule?: {
      deadline?: string;
      string?: string;
      timezone?: string;
    }
  ) {
    super(nodeID, agentID, corrID, parentID);
    this.taskID = taskID;
    this.schedule = schedule;
  }
  public get type(): symbol {
    return TaskRescheduleActionType;
  }
  public static get type(): symbol {
    return TaskRescheduleActionType;
  }
}

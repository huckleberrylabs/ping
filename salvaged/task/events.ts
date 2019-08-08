import { Event } from "../base";

const TaskResultEventType = Symbol("TaskResultEvent");
export class TaskResultEvent extends Event {
  public taskID: string;
  public events: Event[];
  constructor(
    nodeID: string,
    corrID: string,
    parentID: string,
    taskID: string,
    events: Event[]
  ) {
    super(nodeID, corrID, parentID);
    this.taskID = taskID;
    this.events = events;
  }
  public get type(): symbol {
    return TaskResultEventType;
  }
  public static get type(): symbol {
    return TaskResultEventType;
  }
}

const TaskFailEventType = Symbol("TaskFailEvent");
export class TaskFailEvent extends Event {
  public taskID: string;
  constructor(
    nodeID: string,
    corrID: string,
    parentID: string,
    taskID: string
  ) {
    super(nodeID, corrID, parentID);
    this.taskID = taskID;
  }
  public get type(): symbol {
    return TaskFailEventType;
  }
  public static get type(): symbol {
    return TaskFailEventType;
  }
}

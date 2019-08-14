import { Event } from "../base";

const ReminderEventType = Symbol("ReminderEvent");
export class ReminderEvent extends Event {
  public jobID: string;
  public events: Event[];
  constructor(
    nodeID: string,
    corrID: string,
    parentID: string,
    jobID: string,
    events: Event[]
  ) {
    super(nodeID, corrID, parentID);
    this.jobID = jobID;
    this.events = events;
  }
  public get type(): symbol {
    return ReminderEventType;
  }
  public static get type(): symbol {
    return ReminderEventType;
  }
}

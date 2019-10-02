import uuid from "uuid/v4";
import { staticImplements } from "../../../helpers";
import { ITask, ITaskStatic } from "../../../interfaces";
import { SendColdEmailTask } from "../sendColdEmailTask";
import { TaskCreateAction, TaskStartAction } from "../../task";
import {
  ColdEmailVolumePolicy,
  ColdEmailDayPolicy,
  ColdEmailTimePolicy,
} from "./policies";

const Policies = [
  ColdEmailVolumePolicy,
  ColdEmailDayPolicy,
  ColdEmailTimePolicy,
];

const ScheduleColdEmailsTaskType = Symbol("ScheduleColdEmailsTask");
@staticImplements<ITaskStatic>()
export class ScheduleColdEmailsTask implements ITask {
  constructor(
    private ColdEmailVolumePolicy: ColdEmailVolumePolicy,
    private ColdEmailDayPolicy: ColdEmailDayPolicy,
    private ColdEmailTimePolicy: ColdEmailTimePolicy
  ) {}
  async create() {
    const nodeID = "";
    const agentID = "0";
    const corrID = uuid();
    const parentID = "root";
    const taskCreateAction = new TaskCreateAction(
      nodeID,
      agentID,
      corrID,
      parentID,
      this.id,
      this.policyIDs,
      {
        string: "0 0 0/1 1/1 * ? *", // Do Every Hour
      }
    );
    return taskCreateAction;
  }
  async exec(action: TaskStartAction): Promise<TaskCreateAction[]> {
    const output = [];
    const numOfNewEmails = await this.ColdEmailVolumePolicy.exec();
    for (let i = 0; i < numOfNewEmails; i++) {
      const day = await this.ColdEmailDayPolicy.exec();
      const time = await this.ColdEmailTimePolicy.exec();
      output.push(
        new TaskCreateAction(
          this.id,
          action.agentID,
          action.corrID,
          action.parentID,
          SendColdEmailTask.id,
          [],
          {
            string: `${time.minute} ${time.hour} * * ${day}`,
          }
        )
      );
    }
    return output;
  }
  public get id(): string {
    return "fb83e7e7-b769-4f6c-a72b-cc9e27abb5e6";
  }
  public static get id(): string {
    return "fb83e7e7-b769-4f6c-a72b-cc9e27abb5e6";
  }
  public get type(): symbol {
    return ScheduleColdEmailsTaskType;
  }
  public static get type(): symbol {
    return ScheduleColdEmailsTaskType;
  }
  public get description(): string {
    return "Schedule one or more cold emails at a time";
  }
  public static get description(): string {
    return "Schedule one or more cold emails at a time";
  }
  public get policyIDs(): string[] {
    return Policies.map(policy => policy.id);
  }
  public static get policyIDs(): string[] {
    return Policies.map(policy => policy.id);
  }
}

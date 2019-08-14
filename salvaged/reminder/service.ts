import { EventBus, Dkron, DkronJob } from "../../utilities";
import { Config } from "../../config";
import {
  ReminderCreateAction,
  ReminderStartAction,
  ReminderPauseAction,
  ReminderCancelAction,
  ReminderRescheduleAction,
} from "./actions";
import { ReminderEvent } from "./events";

export class ReminderService {
  constructor(
    private client: Dkron,
    private config: Config,
    private eventBus: EventBus
  ) {}
  async create(action: ReminderCreateAction) {
    const nodeID = "0393fd9f-ae41-45cc-8bcc-e4efba694340";
    const reminderEvent = new ReminderEvent(
      nodeID,
      action.corrID,
      action.parentID,
      action.jobID,
      action.events
    );
    const job = new DkronJob();
    job.name = action.jobID;
    job.schedule = action.schedule;
    job.timezone = action.timezone;
    job.owner = action.agentID;
    job.disabled = action.disabled;
    job.executor = "http";
    job.executorConfig = {
      method: "POST",
      url: `${this.config.api.url}/reminder?corrID=${
        reminderEvent.corrID
      }&prvt="${reminderEvent.parentID}`,
      headers: '["Content-Type: application/json"]',
      body: JSON.stringify(reminderEvent),
      timeout: "30",
      expectCode: "200",
      expectBody: "",
      debug: true,
    };
    job.processors = {
      log: {
        forward: false,
      },
    };
    // These may be of use later, namely for performance tuning
    job.tags = undefined;
    job.retries = undefined;
    job.parentJob = undefined;
    job.dependentJobs = undefined;
    job.concurrency = undefined;

    this.client.createOrUpdateJob(job);
  }
  async start(action: ReminderStartAction) {
    const job = await this.client.showJobByName(action.jobID);
    if (job.disabled === true) {
      this.client.toggleJob(action.jobID);
    }
  }
  async pause(action: ReminderPauseAction) {
    const job = await this.client.showJobByName(action.jobID);
    if (job.disabled === false) {
      this.client.toggleJob(action.jobID);
    }
  }
  async cancel(action: ReminderCancelAction) {
    this.client.deleteJob(action.jobID);
  }
  async reschedule(action: ReminderRescheduleAction) {
    throw new Error("Not Implemented Yet");
  }
  async remind(event: ReminderEvent) {
    event.events.map(evt => this.eventBus.emit(evt));
  }
}

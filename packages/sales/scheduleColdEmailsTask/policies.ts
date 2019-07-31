import moment from "moment";
import { IPolicy, IPolicyStatic } from "../../../interfaces";
import { staticImplements } from "../../../helpers";
import {
  EmailService,
  EmailReceivedEvent,
  EmailSpamEvent,
  EmailUnsubscribedEvent,
  EmailBouncedEvent,
} from "@huckleberry/email";

@staticImplements<IPolicyStatic>()
export class ColdEmailVolumePolicy implements IPolicy {
  public MINIMUM_VOLUME = 10;
  constructor(private emailService: EmailService) {}
  async exec(): Promise<number> {
    const emailEvents = await this.emailService.getAllEvents();
    const sendActions = emailEvents.filter(
      action => action.type === "EmailSendAction"
    );
    const interactionEvents = emailEvents.filter(
      event =>
        event.type === EmailReceivedEvent.type ||
        event.type === EmailSpamEvent.type ||
        event.type === EmailUnsubscribedEvent.type ||
        event.type === EmailBouncedEvent.type
    );
    // Hasn't received any events
    const inactiveOutboundEmails = sendActions.filter(
      action =>
        interactionEvents.filter(event => event.corrID === action.corrID)
          .length === 0
    );
    // Inactive for less than a Week
    const recentInactiveOutboundEmails = inactiveOutboundEmails.filter(action =>
      moment(action.timestamp).isAfter(
        moment()
          .subtract(7, "days")
          .startOf("day")
      )
    );
    return this.MINIMUM_VOLUME - recentInactiveOutboundEmails.length;
  }
  public get id(): string {
    return "4fd805f2-a0d3-44c4-b7c5-43f78ff68513";
  }
  public static get id(): string {
    return "4fd805f2-a0d3-44c4-b7c5-43f78ff68513";
  }
}

@staticImplements<IPolicyStatic>()
export class ColdEmailDayPolicy implements IPolicy {
  async exec(): Promise<number> {
    return 1;
  }
  public get id(): string {
    return "4b1c7e2a-a831-4127-bb70-d8ccbdff2c28";
  }
  public static get id(): string {
    return "4b1c7e2a-a831-4127-bb70-d8ccbdff2c28";
  }
  public get agentID(): string {
    return "611fc266-52e6-48fe-9dea-263998d5f086";
  }
  public static get agentID(): string {
    return "611fc266-52e6-48fe-9dea-263998d5f086";
  }
}
@staticImplements<IPolicyStatic>()
export class ColdEmailTimePolicy implements IPolicy {
  async exec(): Promise<{ hour: number; minute: number }> {
    return {
      hour: 1,
      minute: 0,
    };
  }
  public get id(): string {
    return "b975f1a7-4be1-4201-83e7-62a72119dd99";
  }
  public static get id(): string {
    return "b975f1a7-4be1-4201-83e7-62a72119dd99";
  }
  public get agentID(): string {
    return "74c4651b-3221-48af-a3ee-b80f1e1e508e";
  }
  public static get agentID(): string {
    return "74c4651b-3221-48af-a3ee-b80f1e1e508e";
  }
}

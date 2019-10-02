import { staticImplements } from "../../../helpers";
import { ITask, ITaskStatic } from "../../../interfaces";
import { EmailSendAction } from "@huckleberry/email";
import { TaskStartAction } from "../../task";
import {
  NoSpamPolicy,
  ColdEmailWeatherPolicy,
  ColdEmailTemplatePolicy,
} from "./policies";

const Policies = [
  NoSpamPolicy,
  ColdEmailWeatherPolicy,
  ColdEmailTemplatePolicy,
];

const SendColdEmailTaskType = Symbol("SendColdEmailTask");
@staticImplements<ITaskStatic>()
export class SendColdEmailTask implements ITask {
  constructor(
    private ColdEmailWeatherPolicy: ColdEmailWeatherPolicy,
    private ColdEmailTemplatePolicy: ColdEmailTemplatePolicy,
    private NoSpamPolicy: NoSpamPolicy
  ) {}
  async exec(action: TaskStartAction): Promise<EmailSendAction | void> {
    // Find a Person Who Lives where the weather is good right now
    const person = {
      name: "",
      city: "",
      emailAddress: "",
    };
    const goodWeather = await this.ColdEmailWeatherPolicy.exec(person.city);
    // Build the Template using the Person Details
    const template = await this.ColdEmailTemplatePolicy.exec();
    const content = template.generate(person);
    const emailSendAction = new EmailSendAction(
      this.id,
      action.agentID,
      action.corrID,
      action.parentID,
      {
        to: {
          name: person.name,
          email: person.emailAddress,
        },
        from: {
          name: person.name,
          email: person.emailAddress,
        },
        subject: content.title,
        text: content.text,
        html: content.html,
        attachments: content.attachments,
      }
    );
    if (await this.NoSpamPolicy.exec(person.emailAddress)) {
      return emailSendAction;
    }
  }
  public get id(): string {
    return "addc29e7-7dcb-459b-a67d-16959cc798d1";
  }
  public static get id(): string {
    return "addc29e7-7dcb-459b-a67d-16959cc798d1";
  }
  public get type(): symbol {
    return SendColdEmailTaskType;
  }
  public static get type(): symbol {
    return SendColdEmailTaskType;
  }
  public get description(): string {
    return "Send a cold email to a prospect";
  }
  public static get description(): string {
    return "Send a cold email to a prospect";
  }
  public get policyIDs(): string[] {
    return Policies.map(policy => policy.id);
  }
  public static get policyIDs(): string[] {
    return Policies.map(policy => policy.id);
  }
}

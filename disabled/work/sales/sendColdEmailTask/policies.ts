import { IPolicy, IPolicyStatic } from "../../../interfaces";
import { staticImplements } from "../../../helpers";
import {
  EmailService,
  EmailSpamEvent,
  EmailUnsubscribedEvent,
  EmailSendAction,
} from "@huckleberry/email";
import { WeatherService } from "../../weather";
import { Template } from "../../template";
import { QAgentService, CreateQAgentAction } from "../../qagent/service";

@staticImplements<IPolicyStatic>()
export class NoSpamPolicy implements IPolicy {
  constructor(private emailService: EmailService) {}
  async exec(toEmailAddress: string): Promise<boolean> {
    const events = await this.emailService.getEmailEventsByEmailAddress(
      toEmailAddress
    );
    return (
      events.filter(
        event =>
          event.type === EmailSpamEvent.type ||
          event.type === EmailUnsubscribedEvent.type
      ).length === 0
    );
  }
  public get id(): string {
    return "bced4c75-205b-4aed-8a98-0dc40a82dbff";
  }
  public static get id(): string {
    return "bced4c75-205b-4aed-8a98-0dc40a82dbff";
  }
}

type Actions = 0.25 | 0.5 | 0.75 | 1;
type States = symbol;
@staticImplements<IPolicyStatic>()
export class ColdEmailWeatherPolicy implements IPolicy {
  constructor(
    private weatherService: WeatherService,
    private agentService: QAgentService<Actions, States>
  ) {}
  async exec(cityName: string): Promise<boolean> {
    let agent;
    agent = await this.agentService.getById(this.agentID);
    if (!agent) {
      const createQAgentAction = new CreateQAgentAction(
        this.id,
        this.agentID,
        "",
        ""
      );
      agent = await this.agentService.create(createQAgentAction);
    }
    const weatherReport = await this.weatherService.getByCityName(cityName);
    const maxCloudCover = agent.act(EmailSendAction.type);
    return weatherReport.clouds.all < maxCloudCover;
  }
  public get id(): string {
    return "c7ea0592-f8df-4ea7-9266-58ef6fe94ad1";
  }
  public static get id(): string {
    return "c7ea0592-f8df-4ea7-9266-58ef6fe94ad1";
  }
  public get agentID(): string {
    return "f9ab8514-8e26-407e-bb05-9bf49e3b35fa";
  }
  public static get agentID(): string {
    return "f9ab8514-8e26-407e-bb05-9bf49e3b35fa";
  }
}

@staticImplements<IPolicyStatic>()
export class ColdEmailTemplatePolicy implements IPolicy {
  async exec(): Promise<Template> {
    return new Template();
  }
  public get id(): string {
    return "86d20ae6-f9df-41f4-b886-ab3403e948f5";
  }
  public static get id(): string {
    return "86d20ae6-f9df-41f4-b886-ab3403e948f5";
  }
  public get agentID(): string {
    return "0e5ef7f9-dbac-4b48-ba40-4439adedec79";
  }
  public static get agentID(): string {
    return "0e5ef7f9-dbac-4b48-ba40-4439adedec79";
  }
}

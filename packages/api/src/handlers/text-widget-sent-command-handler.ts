import twilio from "twilio";
import {
  ID,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
} from "@huckleberry/core";
import { TextWidgetSentCommand } from "@huckleberry/text";
import { injectable } from "inversify";
import { EventRepository } from "../event-repository";
import { TextWidgetSettingsRepository } from "../app-repository";
import { MessageAggregator } from "../message-aggregator";

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(twilioAccountSid, twilioAuthToken);

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TextWidgetSentCommandHandler implements IEventHandler {
  public id = new ID("48b5a544-1f33-48dd-badd-d0c523210004");
  public static type = TextWidgetSentCommand.type;
  constructor(
    private settingsRepo: TextWidgetSettingsRepository,
    private eventRepo: EventRepository
  ) {}
  async handle(event: TextWidgetSentCommand) {
    const app = await this.settingsRepo.getByID(event.appID);
    const events = await this.eventRepo.getByCorrID(event.corrID);
    const { name, message, phone } = MessageAggregator(events);
    await client.messages.create({
      body: `New Message from ${name}: ${message}
		\n Reply to them at ${phone}`,
      to: app.phone,
      from: twilioPhoneNumber,
    });
    await this.eventRepo.add(event);
  }
}

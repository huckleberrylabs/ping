import twilio, { Twilio } from "twilio";
import {
  ID,
  IEventHandler,
  IEventHandlerStatic,
  staticImplements,
} from "@huckleberryai/core";
import { TextWidgetSentCommand } from "@huckleberryai/text";
import { injectable } from "inversify";
import { EventRepository } from "../event-repository";
import { TextWidgetSettingsRepository } from "../widget-repository";
import { MessageAggregator } from "../message-aggregator";

@injectable()
@staticImplements<IEventHandlerStatic>()
export class TextWidgetSentCommandHandler implements IEventHandler {
  public id = new ID("48b5a544-1f33-48dd-badd-d0c523210004");
  private twilioPhoneNumber: string;
  private client: Twilio;
  public static type = TextWidgetSentCommand.type;
  constructor(
    private settingsRepo: TextWidgetSettingsRepository,
    private eventRepo: EventRepository
  ) {
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio Env Variables Required");
    }
    this.twilioPhoneNumber = TWILIO_PHONE_NUMBER;
    this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  async handle(event: TextWidgetSentCommand) {
    const widgetSettings = await this.settingsRepo.getByID(event.widgetID);
    if (widgetSettings) {
      const events = await this.eventRepo.getByCorrID(event.corrID);
      if (events) {
        const { name, message, phone } = MessageAggregator(events);
        await this.client.messages.create({
          body: `New Message from ${name}: ${message}
		\n Reply to them at ${phone}`,
          to: widgetSettings.phone,
          from: this.twilioPhoneNumber,
        });
      }
    }
    await this.eventRepo.add(event);
  }
}

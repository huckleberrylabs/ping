import twilio, { Twilio } from "twilio";
import {
  UUID,
  IEventHandler,
  Result,
  ErrorName,
  OK,
  INTERNAL_SERVER_ERROR,
  PhoneSerializer,
} from "@huckleberryai/core";
import { ITextWidgetSentCommand } from "@huckleberryai/text";
import { injectable } from "inversify";
import { EventRepository } from "../repositories/event-repository";
import { TextWidgetSettingsRepository } from "../repositories/widget-repository";
import { TextMessageAggregator } from "@huckleberryai/text";

@injectable()
export class TextWidgetSentCommandHandler implements IEventHandler {
  public id = UUID("48b5a544-1f33-48dd-badd-d0c523210004");
  private twilioPhoneNumber: string;
  private client: Twilio;
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
  async handle(event: ITextWidgetSentCommand) {
    const widgetSettings = await this.settingsRepo.getByID(event.widget);
    if (!widgetSettings) {
      return Result(
        `Could not retrieve WidgetSettings for ID ${event.widget}`,
        ErrorName,
        INTERNAL_SERVER_ERROR,
        this.id,
        event.corr,
        event.id
      );
    }

    const events = await this.eventRepo.getByCorrID(event.corr);
    if (!events) {
      return Result(
        `Could not retrieve Events for CorrID ${event.corr}`,
        ErrorName,
        INTERNAL_SERVER_ERROR,
        this.id,
        event.corr,
        event.id
      );
    }

    const { name, message, phone } = TextMessageAggregator(events);

    await this.client.messages.create({
      body: `New Message from ${name}: ${message}
		\n Reply to them at ${phone}`,
      to: PhoneSerializer(widgetSettings.phone),
      from: this.twilioPhoneNumber,
    });

    await this.eventRepo.add(event);

    return Result(null, ErrorName, OK, this.id, event.corr, event.id);
  }
}

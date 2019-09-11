import twilio, { Twilio } from "twilio";
import {
  UUID,
  IEventHandler,
  Result,
  NullName,
  IPhone,
  Phone,
  OK,
  INTERNAL_SERVER_ERROR,
  PhoneSerializer,
} from "@huckleberryai/core";
import { ITextWidgetSentCommand } from "@huckleberryai/text";
import { injectable } from "inversify";
import { EventRepository } from "../repositories/event-repository";
import { TextWidgetSettingsRepository } from "../repositories/widget-repository";
import { TextMessageAggregator } from "@huckleberryai/text";
import { MessageName } from "@huckleberryai/core/src/value-objects/message";

@injectable()
export class TextWidgetSentCommandHandler implements IEventHandler {
  public id = UUID("48b5a544-1f33-48dd-badd-d0c523210004");
  private twilioPhoneNumber: IPhone;
  private client: Twilio;
  constructor(
    private settingsRepo: TextWidgetSettingsRepository,
    private eventRepo: EventRepository
  ) {
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error("twilio env variables required");
    }
    this.twilioPhoneNumber = Phone(TWILIO_PHONE_NUMBER);
    this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  async handle(event: ITextWidgetSentCommand) {
    const widgetSettings = await this.settingsRepo.getByID(event.widget);
    if (!widgetSettings) {
      return Result(
        `could not retrieve widgetsettings for id ${event.widget}`,
        MessageName,
        INTERNAL_SERVER_ERROR,
        this.id,
        event.corr,
        event.id
      );
    }

    const events = await this.eventRepo.getByCorrID(event.corr);
    if (!events) {
      return Result(
        `could not retrieve events for corr id ${event.corr}`,
        MessageName,
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
      from: this.twilioPhoneNumber.format("E.164"),
    });

    await this.eventRepo.add(event);

    return Result(null, NullName, OK, this.id, event.corr, event.id);
  }
}

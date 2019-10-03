import { injectable } from "inversify";
import twilio, { Twilio } from "twilio";
import {
  Phone,
  ParsePhone,
  NonEmptyString,
  ITextingClient,
} from "@huckleberryai/core";

@injectable()
export class TextingClient implements ITextingClient {
  private twilioPhoneNumber: Phone;
  private client: Twilio;
  constructor() {
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error("twilio env variables required");
    }
    this.twilioPhoneNumber = ParsePhone(TWILIO_PHONE_NUMBER);
    this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  async send(body: NonEmptyString, to: Phone): Promise<void> {
    await this.client.messages.create({
      body,
      to,
      from: this.twilioPhoneNumber,
    });
  }
}

import { Twilio } from "twilio";
import { left, right } from "fp-ts/lib/Either";
import {
  Phone,
  NonEmptyString,
  Errors,
  SMSClient,
} from "@huckleberrylabs/core";

export const C = (client: Twilio): SMSClient => async (
  body: NonEmptyString.T,
  to: Phone.T
) => {
  try {
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    await client.messages.create({
      body,
      to,
      messagingServiceSid,
    });
    return right(null);
  } catch (error) {
    console.log("sms-client", JSON.stringify(error));
    return left(Errors.Adapter.C());
  }
};

import { Twilio } from "twilio";
import { left, right } from "fp-ts/lib/Either";
import { Phone, NonEmptyString, Errors, SMSClient } from "@huckleberryai/core";

export const C = (client: Twilio): SMSClient => async (
  body: NonEmptyString.T,
  to: Phone.T
) => {
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  if (messagingServiceSid) return left(Errors.Adapter.C());
  try {
    await client.messages.create({
      body,
      to,
      messagingServiceSid,
    });
    return right(null);
  } catch (error) {
    return left(Errors.Adapter.C());
  }
};

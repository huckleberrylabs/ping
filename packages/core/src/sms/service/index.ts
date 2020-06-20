import { left, right } from "fp-ts/lib/Either";
import { ITwilio, ISMSService } from "../../interfaces";
import { NonEmptyString, Phone, Errors } from "../../values";

export const C = (client: ITwilio): ISMSService => async (
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
    console.log("sms-service", JSON.stringify(error));
    return left(Errors.Adapter.C());
  }
};

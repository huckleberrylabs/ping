import twilio from "twilio";
import { left, right, Either } from "fp-ts/lib/Either";
import { Errors, ITwilio } from "@huckleberrylabs/ping-core";

export const C = (): Either<
  Errors.Adapter.T | Errors.Environment.T,
  ITwilio
> => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const auth_token = process.env.TWILIO_AUTH_TOKEN;
  if (sid && auth_token) {
    try {
      // @ts-ignore
      const client: twilio.Twilio & {
        TWILIO_ACCOUNT_SID: string;
        TWILIO_AUTH_TOKEN: string;
      } = twilio(sid, auth_token);
      client.TWILIO_ACCOUNT_SID = sid;
      client.TWILIO_AUTH_TOKEN = sid;
      return right(client);
    } catch (error) {
      return left(Errors.Adapter.C());
    }
  }
  return left(Errors.Environment.C());
};
